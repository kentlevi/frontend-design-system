import { useProfilePhotoContext } from '~/composables/account/profile/context/useProfilePhotoContext'
import { useProfilePhotoDisplay } from '~/utils/profile_photo/profile_photo'

export function useProfilePersonalPhoto() {

	/**
	 * Display values
	 */
	const { display_avatar, user_initial } = useProfilePhotoDisplay()


	/**
	 * Context
	 */
	const {
		error: photo_inline_error,

		openFilePicker,
		openDeletePhotoModal,
	} = useProfilePhotoContext()


	return {
		display_avatar,
		user_initial,
		photo_inline_error,

		openFilePicker,
		openDeletePhotoModal,
	}
}