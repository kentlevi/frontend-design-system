/**
 * Result returned after processing an avatar image
 */
export interface ProcessedAvatarResult {
	file: File
	blob: Blob
	width: number
	height: number
}

/**
 * Load an image element from a File object
 *
 * @param file Source image file
 *
 * @returns Promise<HTMLImageElement>
 */
function loadImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		/** Create a temporary object URL for the selected file */
		const object_url = URL.createObjectURL(file)

		/** Create image element */
		const image = new Image()

		/** Resolve once image is fully loaded */
		image.onload = () => {
			URL.revokeObjectURL(object_url)
			resolve(image)
		}

		/** Reject if browser cannot read the image */
		image.onerror = () => {
			URL.revokeObjectURL(object_url)
			reject(new Error('Failed to load image'))
		}

		/** Start loading */
		image.src = object_url
	})
}

/**
 * Convert canvas output into Blob
 *
 * @param canvas Source canvas
 * @param mime_type Output mime type
 * @param quality Compression quality from 0 to 1
 *
 * @returns Promise<Blob>
 */
function canvasToBlob(
	canvas: HTMLCanvasElement,
	mime_type: string,
	quality: number
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					reject(new Error('Failed to generate compressed image blob'))
					return
				}

				resolve(blob)
			},
			mime_type,
			quality
		)
	})
}

/**
 * Process avatar image based on avatar rules
 *
 * Rules:
 * - If image is larger than 800x800, center-crop to square and resize to 800x800
 * - If image is smaller than 800x800, keep original size and do not upscale
 * - Always compress output
 *
 * @param file Original uploaded image
 * @param output_type Output mime type
 * @param quality Compression quality
 *
 * @returns Promise<ProcessedAvatarResult>
 */
export async function processAvatarFile(
	file: File,
	output_type: 'image/jpeg' | 'image/webp' = 'image/webp',
	quality = 0.82
): Promise<ProcessedAvatarResult> {
	/** Load source image into browser memory */
	const image = await loadImage(file)

	/** Original image dimensions */
	const original_width = image.width
	const original_height = image.height

	/** Detect whether image is bigger than avatar limit */
	const is_larger_than_limit = original_width > 800 || original_height > 800

	/** Canvas used for final processed image */
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	if (!context) {
		throw new Error('Canvas context is not available')
	}

	/**
	 * If image is larger than 800 in either dimension:
	 * - crop from center to a square
	 * - resize down to 800x800
	 */
	if (is_larger_than_limit) {
		/** Use shortest side so crop becomes a square */
		const crop_size = Math.min(original_width, original_height)

		/** Compute centered crop start position */
		const source_x = Math.floor((original_width - crop_size) / 2)
		const source_y = Math.floor((original_height - crop_size) / 2)

		/** Final avatar output size */
		const target_size = Math.min(crop_size, 800)

		/** Set canvas output size */
		canvas.width = target_size
		canvas.height = target_size

		/** Draw cropped and resized avatar */
		context.drawImage(
			image,
			source_x,
			source_y,
			crop_size,
			crop_size,
			0,
			0,
			target_size,
			target_size
		)
	} else {
		/**
		 * Smaller images are accepted as-is
		 * No upscaling
		 */
		canvas.width = original_width
		canvas.height = original_height

		/** Draw original image without resizing */
		context.drawImage(image, 0, 0, original_width, original_height)
	}

	/** Convert processed canvas into compressed blob */
	const processed_blob = await canvasToBlob(canvas, output_type, quality)

	/** Determine file extension from mime type */
	const extension =
		output_type === 'image/webp'
			? 'webp'
			: 'jpg'

	/** Build processed file name */
	const original_name_without_extension = file.name.replace(/\.[^/.]+$/, '')
	const processed_file_name = `${original_name_without_extension}.${extension}`

	/** Convert blob back into File for easier upload */
	const processed_file = new File(
		[processed_blob],
		processed_file_name,
		{
			type: output_type,
			lastModified: Date.now()
		}
	)

	return {
		file: processed_file,
		blob: processed_blob,
		width: canvas.width,
		height: canvas.height
	}
}