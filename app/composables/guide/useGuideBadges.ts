import { badgeSizes, badgeTones, badgeVariants } from '@/data/ui/badge';
import { toGuideLabel } from '@/utils/text';

export function useGuideBadges() {
    return {
        badgeVariants,
        badgeTones,
        badgeSizes,
        labelize: toGuideLabel,
    };
}
