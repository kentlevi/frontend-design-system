import { useAccountCollection } from '~/composables/account/useAccountCollection'
import { accountGalleryItems } from '~/data/account/gallery'

export function useAccountGallery() {
	return {
		...useAccountCollection(accountGalleryItems),
	}
}