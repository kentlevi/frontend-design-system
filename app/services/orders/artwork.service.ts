import { uploadFileToPresignedUrl } from '~/utils/file/presignedUrl'
import { updateOrderItemArtwork } from './api.service'

/**
 * Upload an artwork file for an order item.
 *
 * Flow:
 *   1. Upload the file to S3 via presigned URL (returns the stored file_name)
 *   2. Hit the order-detail artwork update endpoint to persist the artwork
 *      against the order item
 */
export async function uploadArtwork(
	cart_item_id: number,
	file: File,
	instruction: string,
): Promise<boolean> {
	const { file_name } = await uploadFileToPresignedUrl({
		file_path_code: 'artwork',
		file,
	})

	const response = await updateOrderItemArtwork({
		item_id: cart_item_id,
		file_name: file.name,
		uploaded_file: file_name,
		instruction,
	})

	return Boolean(response?.success)
}