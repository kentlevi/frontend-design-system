import { uploadFileToPresignedUrl } from '~/utils/file/presignedUrl'
import { useCartApiService } from '~/services/core/cart/api.service'

/**
 * Upload an artwork file for a cart/order item.
 *
 * Flow:
 *   1. Upload the file to S3 via presigned URL (returns the stored file_name)
 *   2. Reuse the existing cart artwork-update endpoint via requestArtworkUpdate
 */
export async function uploadArtwork(
	cart_item_id: number,
	file: File,
	instruction: string,
): Promise<boolean> {
	const cart_api = useCartApiService('order-detail-artwork-upload')

	const { file_name } = await uploadFileToPresignedUrl({
		file_path_code: 'artwork',
		file,
	})

	return await cart_api.requestArtworkUpdate(
		cart_item_id,
		file.name,
		file_name,
		instruction,
	)
}