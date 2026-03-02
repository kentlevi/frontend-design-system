export const socialIcons = [
    'apple',
    'discord',
    'facebook',
    'figma',
    'github',
    'google',
    'instagram',
    'linkedin',
    'pinterest',
    'threads',
    'tiktok',
    'whatsapp',
    'x',
    'youtube',
] as const;

export const socialVariants = [
    {
        label: 'Social Brand Color',
        desc: 'Social icons in brand colors improve recognition and preserve platform identity.',
        color: 'colored',
    },
    {
        label: 'White Color',
        desc: 'White social icons are designed for dark backgrounds to maximize contrast.',
        color: 'white',
        dark: true,
    },
    {
        label: 'Brand Black Color',
        desc: 'Neutral black icons provide a consistent and professional visual style.',
        color: 'black',
    },
] as const;
