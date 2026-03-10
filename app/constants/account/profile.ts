import type { PersonalFormState } from '~/types/account/profile'

/** Empty personal form state */
export const personal_form_defaults = (): PersonalFormState => ({
	fields: {},
})