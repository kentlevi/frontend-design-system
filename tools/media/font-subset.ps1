<#
.SYNOPSIS
    Subset Pretendard (or any variable TTF) into two WOFF2 files — Latin and Korean —
    so EN-only routes don't pay for Hangul glyphs and vice versa.

.DESCRIPTION
    Uses fontTools to split a variable TTF along unicode-range boundaries. The
    resulting WOFF2 files are typically 70-99% smaller than the original TTF.

    Pair the output with the matching @font-face declarations below in your SCSS:

        @font-face {
            font-family: 'Pretendard';
            src: url('/fonts/PretendardVariable.latin.woff2') format('woff2');
            font-weight: 100 900;
            font-style: normal;
            font-display: swap;
            unicode-range: U+0020-007F, U+00A0-00FF, U+0100-017F, U+2000-206F,
                           U+2070-209F, U+20A0-20CF, U+2100-214F, U+2150-218F,
                           U+2190-21FF, U+2200-22FF, U+25A0-25FF;
        }
        @font-face {
            font-family: 'Pretendard';
            src: url('/fonts/PretendardVariable.kr.woff2') format('woff2');
            font-weight: 100 900;
            font-style: normal;
            font-display: swap;
            unicode-range: U+1100-11FF, U+3000-303F, U+3130-318F, U+A960-A97F,
                           U+AC00-D7AF, U+D7B0-D7FF, U+FF00-FFEF;
        }

    Browsers fetch only the subset(s) that match glyphs actually rendered.

.PARAMETER Source
    Path to the source variable TTF (e.g. PretendardVariable.ttf).

.PARAMETER OutDir
    Directory to write the .woff2 files into. The base filename of -Source
    is reused with `.latin.woff2` and `.kr.woff2` suffixes.

.EXAMPLE
    .\font-subset.ps1 -Source "C:\path\to\PretendardVariable.ttf" `
                      -OutDir   "C:\path\to\frontend\public\fonts"
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$Source,
    [Parameter(Mandatory)][string]$OutDir
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $Source)) { throw "Source font not found: $Source" }
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

# Set up an isolated venv with fontTools + brotli (for WOFF2 compression).
$venvDir = Join-Path $PSScriptRoot ".fontwork-venv"
if (-not (Test-Path $venvDir)) {
    # Try py launcher first (Windows), then python3, then python.
    $bootPy = $null
    foreach ($candidate in @('py', 'python3', 'python')) {
        if (Get-Command $candidate -ErrorAction SilentlyContinue) {
            try {
                $version = & $candidate --version 2>&1
                if ($version -match 'Python 3') { $bootPy = $candidate; break }
            } catch {}
        }
    }
    if (-not $bootPy) { throw "Python 3 not found on PATH. Install Python 3.10+ and re-run." }

    Write-Host "Creating venv at $venvDir using $bootPy..."
    & $bootPy -m venv $venvDir
}

$py = Join-Path $venvDir "Scripts\python.exe"
& $py -m pip install --quiet --upgrade pip
& $py -m pip install --quiet fonttools brotli
if ($LASTEXITCODE -ne 0) { throw "pip install failed" }

# Latin subset: Basic Latin, Latin-1 Supplement, Latin Extended-A,
# General Punctuation, Superscripts/Subscripts, Currency Symbols,
# Letterlike Symbols, Number Forms, Arrows, Math Operators, Geometric Shapes.
$latinRanges = "U+0020-007F,U+00A0-00FF,U+0100-017F,U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F,U+2150-218F,U+2190-21FF,U+2200-22FF,U+25A0-25FF"

# Korean subset: Hangul Jamo, CJK Symbols & Punctuation, Hangul Compatibility
# Jamo, Hangul Jamo Extended-A & -B, Hangul Syllables, Halfwidth/Fullwidth.
$kRanges = "U+1100-11FF,U+3000-303F,U+3130-318F,U+A960-A97F,U+AC00-D7AF,U+D7B0-D7FF,U+FF00-FFEF"

$baseName = [System.IO.Path]::GetFileNameWithoutExtension($Source)
$latinOut = Join-Path $OutDir "$baseName.latin.woff2"
$krOut = Join-Path $OutDir "$baseName.kr.woff2"

Write-Host "Subsetting Latin..."
& $py -m fontTools.subset $Source `
    --unicodes=$latinRanges `
    --flavor=woff2 --with-zopfli `
    --layout-features='*' --name-IDs='*' `
    --notdef-outline --recommended-glyphs `
    --output-file=$latinOut
if ($LASTEXITCODE -ne 0) { throw "Latin subset failed" }

Write-Host "Subsetting Korean..."
& $py -m fontTools.subset $Source `
    --unicodes=$kRanges `
    --flavor=woff2 --with-zopfli `
    --layout-features='*' --name-IDs='*' `
    --notdef-outline --recommended-glyphs `
    --output-file=$krOut
if ($LASTEXITCODE -ne 0) { throw "Korean subset failed" }

Write-Host ""
Write-Host "===== SIZES ====="
$srcKB = (Get-Item $Source).Length / 1KB
$latinKB = (Get-Item $latinOut).Length / 1KB
$krKB = (Get-Item $krOut).Length / 1KB
"{0,-44} {1,10:N1} KB" -f (Split-Path -Leaf $Source), $srcKB
"{0,-44} {1,10:N1} KB ({2:N1}% smaller)" -f (Split-Path -Leaf $latinOut), $latinKB, ((1 - $latinKB / $srcKB) * 100)
"{0,-44} {1,10:N1} KB ({2:N1}% smaller)" -f (Split-Path -Leaf $krOut), $krKB, ((1 - $krKB / $srcKB) * 100)
