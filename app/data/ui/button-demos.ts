// app/data/button-demos.ts
import type { ButtonVariant, ButtonSize, ButtonTone } from './buttons';

export type ButtonDemoItem = {
    label?: string;
    props?: {
        variant?: ButtonVariant;
        size?: ButtonSize;
        tone?: ButtonTone;
        icon?: string;
        iconPosition?: 'left' | 'right';
        iconOnly?: boolean;
        selected?: boolean;
        disabled?: boolean;
    };
};

export type ButtonDemoSection =
    | {
          type: 'builder';
          title: 'Custom Button';
          description: string;
      }
    | {
          type: 'examples';
          title: string;
          items: ButtonDemoItem[];
      };

export const buttonDemoSections: ButtonDemoSection[] = [
    {
        type: 'builder',
        title: 'Custom Button',
        description: 'Configure variant, size, tone, and custom color.',
    },

    {
        type: 'examples',
        title: 'Icon Positions',
        items: [
            { label: 'Left icon', props: { icon: 'light-plus' } },
            {
                label: 'Right icon',
                props: { icon: 'light-plus', iconPosition: 'right' },
            },
            {
                props: {
                    icon: 'light-plus',
                    iconOnly: true,
                    'aria-label': 'Add' as any,
                },
            },
        ],
    },

    {
        type: 'examples',
        title: 'States',
        items: [
            {
                label: 'Selected',
                props: { selected: true, icon: 'light-check' },
            },
            {
                label: 'Disabled',
                props: { disabled: true, icon: 'light-plus' },
            },
            {
                label: 'Disabled outline',
                props: { variant: 'outline', disabled: true },
            },
        ],
    },

    {
        type: 'examples',
        title: 'Long Label',
        items: [
            { label: 'Long Button Text', props: { icon: 'light-arrow-right' } },
        ],
    },
];
