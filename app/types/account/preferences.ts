/**
 * Form state used by the UI
 */
export interface PreferenceState {
	id: number
	user_id: number
	offers_emails?: boolean
	reviews_emails?: boolean
	confirmations_emails?: boolean
	unit_of_measurement?: 'in' | 'mm'
	guided_tour_enabled?: boolean
	created_at: string
	updated_at: string
}