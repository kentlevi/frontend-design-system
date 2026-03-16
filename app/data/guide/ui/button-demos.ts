import type { ButtonSize, ButtonTone, ButtonVariant } from '~/data/ui/buttons';

export type ButtonDemoItem = {
	label?: string;
	props?: {
		variant?: ButtonVariant;
		size?: ButtonSize;
		tone?: ButtonTone;
		icon?: string;
		'aria-label'?: string;
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
			{ label: 'Left icon', props: { icon: 'light-plus', tone: 'neutral' } },
			{
				label: 'Right icon',
				props: { icon: 'light-plus', iconPosition: 'right', tone: 'neutral' },
			},
			{
				props: {
					icon: 'light-plus',
					iconOnly: true,
					tone: 'neutral',
					'aria-label': 'Add',
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
				props: { selected: true, icon: 'light-check', tone: 'neutral' },
			},
			{
				label: 'Disabled',
				props: { disabled: true, icon: 'light-plus', tone: 'neutral' },
			},
			{
				label: 'Disabled outline',
				props: { variant: 'outline', disabled: true, tone: 'neutral' },
			},
		],
	},
	{
		type: 'examples',
		title: 'Long Label',
		items: [{ label: 'Long Button Text', props: { icon: 'light-arrow-right', tone: 'neutral' } }],
	},
];