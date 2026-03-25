/**
 * Form state used by the UI
 */
export interface PreferenceState {
	id: number
	user_id: number
	offers_emails?: boolean
	reviews_emails?: boolean
	created_at: string
	updated_at: string
}