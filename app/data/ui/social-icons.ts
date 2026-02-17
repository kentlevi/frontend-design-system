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
        desc: 'Social icons displayed in their original brand colors provide instant recognition and maintain consistency with each platform’s identity.',
        color: 'colored',
    },
    {
        label: 'White Color',
        desc: 'White social icons are used on dark or colored backgrounds to ensure clarity and contrast while maintaining a clean, minimal appearance.',
        color: 'white',
        dark: true,
    },
    {
        label: 'Brand Black Color',
        desc: 'Social icons in a neutral black tone create a professional and consistent visual style across the interface.',
        color: 'black',
    },
] as const;
