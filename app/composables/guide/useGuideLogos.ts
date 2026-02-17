import { logos, logoVariants, logoColors } from '~/data/ui/logos';
import { useGuideMediaTokenSize } from '@/composables/guide/useGuideMediaSize';

export function useGuideLogos() {
    const { selectedSize, customSize, resolvedSize } = useGuideMediaTokenSize();

    return {
        logos,
        variants: logoVariants,
        colors: logoColors,
        selectedSize,
        customSize,
        resolvedSize,
    };
}
