import { accountGalleryItems } from '~/data/account/gallery';
import { useAccountCollection } from '~/composables/account/useAccountCollection';

export function useAccountGallery() {
	return {
		...useAccountCollection(accountGalleryItems),
	};
}