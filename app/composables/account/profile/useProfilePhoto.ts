import { deleteAvatar, saveAvatar } from "~/services/profile/avatar.service";
import { useUsersStore } from "~/stores/users/users.store";
import { processAvatarFile } from "~/utils/avatar/processAvatar";
import { isValidImage } from "~/utils/file/file";
import { uploadFileToPresignedUrl } from "~/utils/file/presignedUrl";

export function useProfilePhoto() {
	const { t } = useI18n()
	const MAX_PROFILE_PHOTO_BYTES = 3 * 1024 * 1024;

	/** State */
	const user_store = useUsersStore()
	const loading_overlay_store = useLoadingOverlayStore()
	const toast_store = useToastStore()

	const is_delete_photo_modal_open = ref(false)

	const file_input = ref<HTMLInputElement | null>(null);
	const error = ref('')

	/** Opens the native file picker */
	function openFilePicker() {
		resetPhotoInput()
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

		/** Reset error */
		error.value = ''

		/** Get the first selected file */
		const file = input.files?.[0];

		if (!file) return;

		if (!isValidImage(file)) {
			error.value = t('account.profile.invalidFileType')
			return;
		}
		if (file.size > MAX_PROFILE_PHOTO_BYTES) {
			error.value = t('account.profile.photoTooLarge')
			return;
		}

		startRequestOverlay()

		try {

			/** Process image before upload */
			const processed_avatar = await processAvatarFile(file, 'image/webp', 0.82)

			/** Upload processed file directly to storage */
			const { file_name } = await uploadFileToPresignedUrl({
				file_path_code: 'avatar',
				file: processed_avatar.file
			})

			const orig_file_name = processed_avatar.file.name

			/** Save file name in database */
			const response = await saveAvatar(orig_file_name, file_name)

			toast_store.handleApiResponse(response)

			/** Set file name in store */
			user_store.setProfileField('file_name', file_name)

			toast_store.handleApiResponse(response)
		} catch {
			toast_store.showToastWithTimer({
				title: t('account.profile.photoUploadFailedTitle'),
				message: t('account.profile.photoUploadFailedMessage'),
				tone: 'error',
				dismissible: true,
				variant: 'default',
			})
			return
		} finally {
			loading_overlay_store.stopLoading('upload_avatar')
		}
	}

	async function deletePhoto() {
		closeDeletePhotoModal()
		startDeleteOverlay()
		try {
			const response = await deleteAvatar()
			user_store.setProfileField('file_name', null)

			toast_store.handleApiResponse(response)
		} catch {
			toast_store.showToastWithTimer({
				title: t('account.profile.photoDeleteFailedTitle'),
				message: t('account.profile.photoDeleteFailedMessage'),
				tone: 'error',
				dismissible: true,
				variant: 'default',
			})
			return
		} finally {
			loading_overlay_store.stopLoading('delete_avatar')
		}
	}

	function resetPhotoInput() {
	/** Clear file input so selecting the same file will trigger change again */
		if (file_input.value) {
			file_input.value.value = ''
		}
	}



	/** Delete Photo Modal */
	function openDeletePhotoModal() {
		is_delete_photo_modal_open.value = true
	}

	function closeDeletePhotoModal() {
		is_delete_photo_modal_open.value = false
	}
	/** End: Delete Photo Modal */








	/** Overlays */
	function startRequestOverlay() {
		loading_overlay_store.startLoading('upload_avatar', {
			showCopy: true,
			testId: 'account-profile-upload-avatar-overlay',
			position: 'fixed'
		})
	}

	function startDeleteOverlay() {
		loading_overlay_store.startLoading('delete_avatar', {
			showCopy: true,
			testId: 'account-profile-upload-avatar-overlay',
			position: 'fixed'
		})
	}
	/** End: Overlays */

	return {
		file_input,
		is_delete_photo_modal_open,
		error,

		openFilePicker,
		onFilePicked,
		openDeletePhotoModal,
		closeDeletePhotoModal,
		deletePhoto,
	};
}