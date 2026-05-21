<#
.SYNOPSIS
    Batch-optimize uploaded product images (PNG -> WebP) and videos (MP4 -> MP4 web-ready).

.DESCRIPTION
    Walks a source directory, mirrors its tree under -DstRoot, and:
      * Converts every .png to .webp via ffmpeg's libwebp (quality 82, photo preset).
      * Re-encodes every .mp4 with h264 high profile, CRF 26, capped at 1080p / 30 fps,
        audio stripped, +faststart so the moov atom sits at the front for instant
        playback.
      * Passes through .webp files unchanged (kept in the mirror so you can rsync
        the whole optimized tree to the CDN in one shot).

    Idempotent — re-running skips any output file that already exists.

.PARAMETER SrcRoot
    Directory of source media (e.g. raw 1080p60 product uploads). Required.

.PARAMETER DstRoot
    Where to write the optimized mirror. Required.

.PARAMETER Ffmpeg
    Path to ffmpeg.exe. Defaults to "ffmpeg" on PATH.

.PARAMETER Crf
    h264 constant rate factor. Default 26. Lower = higher quality + bigger file.

.PARAMETER MaxRate
    Max video bitrate (kbps). Default 1800. Buffer is 2x.

.PARAMETER WebpQuality
    libwebp quality 0-100. Default 82.

.EXAMPLE
    .\optimize-media.ps1 -SrcRoot "C:\tmp\raw-products" -DstRoot "C:\tmp\optimized-products"

.NOTES
    Only worth running on files that are *unoptimized at source* — typically raw
    exports straight from a camera or editor (1080p60, 10 Mbps, audio attached).
    Files that are already small (~< 1 MB / 540p-720p / no audio) are very
    likely already optimized at the source pipeline; re-encoding them will
    INCREASE size because CRF 26 targets higher quality than the source.
    Inspect with `ffprobe` and only optimize the outliers.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$SrcRoot,
    [Parameter(Mandatory)][string]$DstRoot,
    [string]$Ffmpeg = "ffmpeg",
    [int]$Crf = 26,
    [int]$MaxRate = 1800,
    [int]$WebpQuality = 82
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $SrcRoot)) { throw "SrcRoot not found: $SrcRoot" }

# Verify ffmpeg is reachable up-front so we fail fast.
try {
    & $Ffmpeg -version > $null 2>&1
    if ($LASTEXITCODE -ne 0) { throw }
} catch {
    throw "ffmpeg not found at '$Ffmpeg'. Pass -Ffmpeg <full path> or add it to PATH."
}

function Initialize-Dir($path) {
    $dir = Split-Path -Parent $path
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
}

$results = @()
$srcFiles = Get-ChildItem $SrcRoot -Recurse -File | Where-Object { $_.Extension -in '.png', '.mp4', '.webp' }

foreach ($f in $srcFiles) {
    $rel = $f.FullName.Substring($SrcRoot.Length).TrimStart('\', '/')

    if ($f.Extension -eq '.png') {
        $relOut = [System.IO.Path]::ChangeExtension($rel, '.webp')
        $dst = Join-Path $DstRoot $relOut
        Initialize-Dir $dst
        if (Test-Path $dst) {
            Write-Host "SKIP (exists): $relOut"
        } else {
            Write-Host "PNG->WebP: $rel"
            & $Ffmpeg -hide_banner -loglevel error -y -i $f.FullName `
                -c:v libwebp -quality $WebpQuality -preset photo $dst
            if ($LASTEXITCODE -ne 0) { throw "ffmpeg PNG->WebP failed: $rel" }
        }
        $newSize = (Get-Item $dst).Length
        $results += [PSCustomObject]@{
            File      = $relOut
            SrcKB     = [math]::Round($f.Length / 1KB, 1)
            DstKB     = [math]::Round($newSize / 1KB, 1)
            SavingPct = [math]::Round((1 - $newSize / $f.Length) * 100, 1)
        }
    }
    elseif ($f.Extension -eq '.mp4') {
        $dst = Join-Path $DstRoot $rel
        Initialize-Dir $dst
        if (Test-Path $dst) {
            Write-Host "SKIP (exists): $rel"
        } else {
            Write-Host "Transcode MP4: $rel"
            $bufSize = $MaxRate * 2
            & $Ffmpeg -hide_banner -loglevel error -y -i $f.FullName `
                -c:v libx264 -profile:v high -preset medium -crf $Crf `
                -maxrate "${MaxRate}k" -bufsize "${bufSize}k" `
                -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30" `
                -pix_fmt yuv420p -an -movflags +faststart `
                $dst
            if ($LASTEXITCODE -ne 0) { throw "ffmpeg MP4 transcode failed: $rel" }
        }
        $newSize = (Get-Item $dst).Length
        $results += [PSCustomObject]@{
            File      = $rel
            SrcKB     = [math]::Round($f.Length / 1KB, 1)
            DstKB     = [math]::Round($newSize / 1KB, 1)
            SavingPct = [math]::Round((1 - $newSize / $f.Length) * 100, 1)
        }
    }
    elseif ($f.Extension -eq '.webp') {
        # Pass-through so the mirror is upload-ready in one go.
        $dst = Join-Path $DstRoot $rel
        Initialize-Dir $dst
        if (-not (Test-Path $dst)) {
            Copy-Item $f.FullName $dst
            Write-Host "Copy WebP (passthrough): $rel"
        }
    }
}

Write-Host ""
Write-Host "===== SIZE REPORT ====="
$results | Sort-Object SavingPct -Descending | Format-Table -AutoSize

$srcTotal = ($srcFiles | Where-Object { $_.Extension -in '.png', '.mp4' } | Measure-Object Length -Sum).Sum
if ($srcTotal -gt 0) {
    $dstTotal = ($results | Measure-Object DstKB -Sum).Sum * 1KB
    $pct = (1 - $dstTotal / $srcTotal) * 100
    Write-Host ("TOTAL (png+mp4): {0:N2} MB -> {1:N2} MB  ({2:N1}% smaller)" -f ($srcTotal / 1MB), ($dstTotal / 1MB), $pct)
}
