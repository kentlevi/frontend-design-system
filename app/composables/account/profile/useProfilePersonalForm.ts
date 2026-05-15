import { useChangeEmailFormContext } from '~/composables/account/profile/context/useChangeEmailFormContext'
import { useProfilePersonal } from '~/composables/account/profile/useProfilePersonal'
import { useSocialAccount } from '~/composables/account/profile/useSocialAccount'

export function useProfilePersonalForm() {

	/**
	 * Composables
	 */
	const { social } = useSocialAccount()

	const {
		form_state,
		field_errors,
		dynamic_profile_fields,
		has_changes,

		submitPersonalForm,

		is_updating,
	} = useProfilePersonal()


	/**
	 * Context
	 */
	const {
		email,

		openEmailChangeModal,
	} = useChangeEmailFormContext()


	return {
		email,
		social,

		form_state,
		field_errors,
		dynamic_profile_fields,
		has_changes,
		is_updating,

		submitPersonalForm,
		openEmailChangeModal,
	}
}