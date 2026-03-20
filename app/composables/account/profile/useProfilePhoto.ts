import { saveAvatar } from "~/services/profile/avatar.service";
import { useUsersStore } from "~/stores/users/users.store";
import { processAvatarFile } from "~/utils/avatar/processAvatar";
import { resolveUploadPath } from "~/utils/file/file";
import { uploadFileToPresignedUrl } from "~/utils/file/presignedUrl";

export function useProfilePhoto() {

	/** State */
	const user_store = useUsersStore()
	const loading_overlay_store = useLoadingOverlayStore()

	const is_delete_photo_modal_open = ref(false)

	const file_input = ref<HTMLInputElement | null>(null);
	const photo_url = ref<string | null>(null);


	/** Opens the native file picker */
	function openFilePicker() {
		file_input.value?.click();
	}

	/**
     * Handles file selection from the input
     *
     * Process image according to rules
     * Get file path
     * Upload to S3
     */
	async function onFilePicked(event: Event) {
		/** Get the input element from the emitted event */
		const input = event.target as HTMLInputElement;

		/** Get the first selected file */
		const file = input.files?.[0];

		if (!file) return;

		startRequestOverlay()

		try {

			/** Process image before upload */
			const processed_avatar = await processAvatarFile(file, 'image/webp', 0.82)

			/** Resolve final storage path */
			const { full_path, file_name } = await resolveUploadPath({
				file_path_code: 'avatar',
				image_type: processed_avatar.file.type
			})

			/** Upload processed file directly to storage */
			await uploadFileToPresignedUrl({
				full_path,
				file: processed_avatar.file
			})

			/** Save file name in database */
			await saveAvatar(file_name)

			try {
				/**
                 * Convert the processed file into a data URL
                 * so it can be displayed immediately in the UI
                 */
				photo_url.value = await readFileAsDataUrl(processed_avatar.file)
			} catch {
				console.log('Failed to read data as url');
				return
			}

			/** Set file name in store */
			user_store.setProfileField('file_name', file_name)
		} catch (_error: unknown) {
			console.log(_error);
		} finally {
			loading_overlay_store.stopLoading('upload_avatar')
		}
	}

	function readFileAsDataUrl(file: File): Promise<string> {
		/** Return a Promise because file reading is asynchronous */
		return new Promise((resolve, reject) => {
			/** Create browser file reader */
			const reader = new FileReader();

			/** Runs when file reading succeeds */
			reader.onload = () => {
				/** Ensure result is a string before resolving */
				if (typeof reader.result === 'string') {
					resolve(reader.result);
					return;
				}

				/** Reject if result is not the expected type */
				reject(new Error('Failed to read file as data URL.'));
			};

			/** Runs when file reading fails */
			reader.onerror = () => reject(new Error('Failed to read file.'));

			/** Start reading the file as a Data URL */
			reader.readAsDataURL(file);
		});
	}

	/**
	 * Revokes the current photo URL if it is a blob URL
	 *
	 * This prevents memory leaks when replacing an old preview.
	 * Only blob URLs need manual cleanup.
	 */
	function revokePhotoUrl() {
		if (photo_url.value?.startsWith('blob:')) {
			URL.revokeObjectURL(photo_url.value);
		}
	}

	function removePhoto() {
		revokePhotoUrl()
		photo_url.value = null

		closeDeletePhotoModal()
	}



	/** Delete Photo Modal */
	function openDeletePhotoModal() {
		is_delete_photo_modal_open.value = true
	}

	function closeDeletePhotoModal() {
		is_delete_photo_modal_open.value = false
	}
	/** End: Delete Photo Modal */








	/**
	 * Start request overlay
	 */
	function startRequestOverlay() {
		loading_overlay_store.startLoading('upload_avatar', {
			showCopy: true,
			testId: 'account-profile-upload-avatar-overlay',
			position: 'fixed'
		})
	}

	return {
		file_input,
		photo_url,
		is_delete_photo_modal_open,

		openFilePicker,
		onFilePicked,
		openDeletePhotoModal,
		closeDeletePhotoModal,
		removePhoto,
	};
}