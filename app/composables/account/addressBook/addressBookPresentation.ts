export const address_book_tag_badge_colors = {
	home: {
		bgColor: 'var(--aloha-10)',
		textColor: 'var(--aloha-60)',
	},
	office: {
		bgColor: 'var(--neon-blue-10)',
		textColor: 'var(--neon-blue-60)',
	},
	client: {
		bgColor: 'var(--azure-10)',
		textColor: 'var(--azure-60)',
	},
} as const

export function capitalizeAddressBookLabel(label: string) {
	return label.charAt(0).toUpperCase() + label.slice(1)
}

export function getTranslatedAddressBookLabel(
	label: string,
	translate: (key: string) => string
) {
	const translation_key = `account.addressBook.tags.${label}`
	const translated_label = translate(translation_key)

	return translated_label !== translation_key
		? translated_label
		: capitalizeAddressBookLabel(label)
}