import { socialIcons, socialVariants } from '~/data/ui/social-icons';
import { useGuideMediaTokenSize } from '@/composables/guide/useGuideMediaSize';

export function useGuideSocialIcons() {
    const { selectedSize, customSize, resolvedSize } = useGuideMediaTokenSize();

    return {
        socialIcons,
        socialVariants,
        selectedSize,
        customSize,
        resolvedSize,
    };
}
