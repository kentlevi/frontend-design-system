import { getPresignedUrl } from '~/services/aws/presignedUrl.service'

/**
 * Get presigned url
 * Upload to S3 using presigned url and file_path
 */
export async function uploadFileToPresignedUrl(
	payload: { file_path_code: string, file: File }
): Promise<{ file_name: string}> {

	/** Request presigned upload url */
	const presigned_response = await getPresignedUrl({
		file_path_code: payload.file_path_code,
		image_type: payload.file.type
	})

	/** Get data from response */
	const presigned_url = presigned_response.data?.presigned_url
	const file_name = presigned_response.data?.file_name

	/** Stop if presigned url was not returned */
	if (!presigned_url) {
		throw new Error('Presigned URL was not returned.')
	}
	/** Stop if full path or file name was not returned */
	if (!file_name) {
		throw new Error('File name was not resolved.')
	}

	/** Upload file to storage using the presigned url */
	await $fetch(presigned_url, {
		method: 'PUT',
		body: payload.file,
		headers: {
			'Content-Type': payload.file.type
		}
	})

	return {
		file_name,
	}
}