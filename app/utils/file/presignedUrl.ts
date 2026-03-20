import axios from 'axios'
import { getPresignedUrl } from '~/services/aws/presignedUrl.service'

interface payload {
	full_path: string,
	file: File
}


/**
 * Get presigned url
 * Upload to S3 using presigned url and file_path
 */
export async function uploadFileToPresignedUrl(
	payload: payload
): Promise<void> {
	/** Request presigned upload url */
	const presigned_response = await getPresignedUrl({
		full_path: payload.full_path
	})

	/** Get presigned url from response */
	const presigned_url = presigned_response.data?.presigned_url

	/** Stop if presigned url was not returned */
	if (!presigned_url) {
		throw new Error('Presigned URL was not returned.')
	}

	/** Upload file to storage using the presigned url */
	await axios.put(presigned_url, payload.file, {
		headers: {
			'Content-Type': payload.file.type
		}
	})
}