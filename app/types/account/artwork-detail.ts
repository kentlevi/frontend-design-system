export type ArtworkStatus =
	| 'submitted'
	| 'in_review'
	| 'approved'
	| 'rejected'
	| 'changes_requested'

export type ArtworkAttachment = {
	filename: string
	thumbnail_url: string
	product?: string
	size_label?: string
	quantity_label?: string
}

export type ActivityLogEntry = {
	id: string
	user: {
		name: string
		avatar_url?: string
	}
	timestamp: string
	message?: string
	attachment?: ArtworkAttachment
	status?: ArtworkStatus
}

export type ArtworkDetailItem = {
	id: string
	item_number: string
	product?: string
	size_label?: string
	quantity_label?: string
	preview_url: string
	status: ArtworkStatus
	activity_logs: ActivityLogEntry[]
}
