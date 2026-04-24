import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const SUPPORTED_EXTENSIONS = new Set(['.mp4', '.mov', '.m4v', '.webm'])

function parseArgs(argv) {
	const options = {
		input: '../tmp/video_and_poster',
		output: '../tmp/video_and_poster_optimized',
		width: 1600,
		crf: 28,
		preset: 'slow',
		audioBitrate: '96k',
	}

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index]
		const next = argv[index + 1]

		if (arg === '--input' && next) {
			options.input = next
			index += 1
		} else if (arg === '--output' && next) {
			options.output = next
			index += 1
		} else if (arg === '--width' && next) {
			options.width = Number.parseInt(next, 10)
			index += 1
		} else if (arg === '--crf' && next) {
			options.crf = Number.parseInt(next, 10)
			index += 1
		} else if (arg === '--preset' && next) {
			options.preset = next
			index += 1
		} else if (arg === '--audio-bitrate' && next) {
			options.audioBitrate = next
			index += 1
		} else if (arg === '--help') {
			printHelp()
			process.exit(0)
		}
	}

	return options
}

function printHelp() {
	console.log(`Usage: node scripts/optimize-videos.mjs [options]

Options:
	--input <dir>           Source folder containing videos
	--output <dir>          Destination folder for optimized videos
	--width <number>        Maximum output width, default 1600
	--crf <number>          H.264 quality target, default 28
	--preset <name>         ffmpeg preset, default slow
	--audio-bitrate <rate>  AAC audio bitrate, default 96k
	--help                  Show this help
`)
}

async function pathExists(target) {
	try {
		await fs.access(target)
		return true
	} catch {
		return false
	}
}

async function collectVideoFiles(directory) {
	const entries = await fs.readdir(directory, { withFileTypes: true })
	const files = []

	for (const entry of entries) {
		const resolved = path.join(directory, entry.name)
		if (entry.isDirectory()) {
			files.push(...await collectVideoFiles(resolved))
			continue
		}

		if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
			files.push(resolved)
		}
	}

	return files
}

function runCommand(command, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { stdio: 'inherit' })

		child.on('error', reject)
		child.on('exit', (code) => {
			if (code === 0) {
				resolve()
				return
			}

			reject(new Error(`${command} exited with code ${code}`))
		})
	})
}

function formatMegabytes(bytes) {
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

async function optimizeVideo(inputFile, outputFile, options) {
	const ffmpegArgs = [
		'-y',
		'-i', inputFile,
		'-map_metadata', '-1',
		'-map_chapters', '-1',
		'-c:v', 'libx264',
		'-preset', options.preset,
		'-crf', String(options.crf),
		'-pix_fmt', 'yuv420p',
		'-movflags', '+faststart',
		'-vf', `scale='min(${options.width},iw)':-2:force_original_aspect_ratio=decrease,fps=30`,
		'-c:a', 'aac',
		'-b:a', options.audioBitrate,
		'-ac', '2',
		outputFile,
	]

	await runCommand('ffmpeg', ffmpegArgs)
}

async function main() {
	const options = parseArgs(process.argv.slice(2))
	const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
	const inputRoot = path.resolve(scriptDirectory, options.input)
	const outputRoot = path.resolve(scriptDirectory, options.output)

	if (!(await pathExists(inputRoot))) {
		throw new Error(`Input directory does not exist: ${inputRoot}`)
	}

	await runCommand('ffmpeg', ['-version'])

	const sourceFiles = await collectVideoFiles(inputRoot)
	if (sourceFiles.length === 0) {
		console.log(`No supported video files found in ${inputRoot}`)
		return
	}

	await fs.mkdir(outputRoot, { recursive: true })

	let totalOriginalBytes = 0
	let totalOptimizedBytes = 0

	for (const sourceFile of sourceFiles) {
		const relativeFile = path.relative(inputRoot, sourceFile)
		const outputFile = path.join(outputRoot, relativeFile).replace(path.extname(relativeFile), '.mp4')
		await fs.mkdir(path.dirname(outputFile), { recursive: true })

		const originalStat = await fs.stat(sourceFile)
		totalOriginalBytes += originalStat.size

		console.log(`\nOptimizing ${relativeFile}`)
		await optimizeVideo(sourceFile, outputFile, options)

		const optimizedStat = await fs.stat(outputFile)
		totalOptimizedBytes += optimizedStat.size

		const savings = originalStat.size - optimizedStat.size
		const savingsPercent = originalStat.size > 0
			? ((savings / originalStat.size) * 100).toFixed(1)
			: '0.0'

		console.log(`Saved ${formatMegabytes(savings)} (${savingsPercent}%)`)
	}

	const totalSavings = totalOriginalBytes - totalOptimizedBytes
	const totalSavingsPercent = totalOriginalBytes > 0
		? ((totalSavings / totalOriginalBytes) * 100).toFixed(1)
		: '0.0'

	console.log('\nDone.')
	console.log(`Original total:  ${formatMegabytes(totalOriginalBytes)}`)
	console.log(`Optimized total: ${formatMegabytes(totalOptimizedBytes)}`)
	console.log(`Savings:         ${formatMegabytes(totalSavings)} (${totalSavingsPercent}%)`)
}

main().catch((error) => {
	console.error(error.message)
	process.exit(1)
})