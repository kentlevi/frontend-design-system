import { accountGalleryItems } from '~/data/account/gallery';

export function useAccountGallery() {
    return {
        items: accountGalleryItems,
    };
}
