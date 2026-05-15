import { provideChangeEmailForm } from '~/composables/account/profile/context/useChangeEmailFormContext'
import { provideProfilePhoto } from '~/composables/account/profile/context/useProfilePhotoContext'

export function useProfilePersonalIndex() {

	/**
	 * Provide contexts
	 */
	const {
		file_input,
		is_delete_photo_modal_open,

		onFilePicked,
		closeDeletePhotoModal,
		deletePhoto,
	} = provideProfilePhoto()

	const {
		pending_email,
		is_email_change_modal,
		email_change_error,

		is_otp_open,
		email_change_otp_code,
		email_change_otp_error,
		limit_reached_error,

		remaining,

		closeEmailChangeModal,
		confirmEmailChange,

		verifyOtp,
		resendOtp,
		closeOtpModal,
	} = provideChangeEmailForm()


	return {
		file_input,
		is_delete_photo_modal_open,

		pending_email,
		is_email_change_modal,
		email_change_error,

		is_otp_open,
		email_change_otp_code,
		email_change_otp_error,
		limit_reached_error,

		remaining,

		onFilePicked,
		closeDeletePhotoModal,
		deletePhoto,

		closeEmailChangeModal,
		confirmEmailChange,

		verifyOtp,
		resendOtp,
		closeOtpModal,
	}
}