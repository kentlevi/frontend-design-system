export const badgeVariants = ['filled', 'tonal', 'outline', 'subtle'] as const;

export const badgeTones = ['default', 'success', 'warning', 'danger'] as const;

export const badgeSizes = ['sm', 'md'] as const;

/* optional helpful types */
export type BadgeVariant = (typeof badgeVariants)[number];
export type BadgeTone = (typeof badgeTones)[number];
export type BadgeSize = (typeof badgeSizes)[number];
