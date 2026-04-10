export type LetteringPaintSpec =
	| {
		kind: 'solid';
		color: string;
	}
	| {
		kind: 'gradient';
		type: 'vertical' | 'diagonal';
		stops: Array<{
			offset: number;
			color: string;
		}>;
	}

const normalizeLetteringColorKey = (value: string | null | undefined) =>
	(value || '')
		.toLowerCase()
		.trim()
		.replace(/_/g, '-')

export const resolveLetteringPaintSpec = (
	colorKey: string | null | undefined,
	hexCode?: string
): LetteringPaintSpec => {
	const normalizedColorKey = normalizeLetteringColorKey(colorKey)
	const fallbackColor = hexCode || (colorKey?.startsWith('#') ? colorKey : '#000000')

	switch (normalizedColorKey) {
		case 'white':
			return { kind: 'solid', color: '#FFFFFF' }
		case 'red':
			return { kind: 'solid', color: '#FF0000' }
		case 'orange':
		case 'yellow-orange':
		case 'yelloworange':
		case 'yellow orange':
			return { kind: 'solid', color: '#FFB700' }
		case 'yellow':
			return { kind: 'solid', color: '#FFE600' }
		case 'green':
			return { kind: 'solid', color: '#008F00' }
		case 'blue':
			return { kind: 'solid', color: '#1B1BFF' }
		case 'purple':
			return { kind: 'solid', color: '#80008F' }
		case 'pink':
			return { kind: 'solid', color: '#F5A9B8' }
		case 'gold':
			return {
				kind: 'gradient',
				type: 'vertical',
				stops: [
					{ offset: 0, color: '#B78019' },
					{ offset: 0.18, color: '#FBE254' },
					{ offset: 0.36, color: '#F0CC44' },
					{ offset: 0.5, color: '#FFFFFF' },
					{ offset: 0.64, color: '#F0CC44' },
					{ offset: 0.82, color: '#FBE254' },
					{ offset: 1, color: '#B78019' },
				],
			}
		case 'silver':
			return {
				kind: 'gradient',
				type: 'vertical',
				stops: [
					{ offset: 0, color: '#898989' },
					{ offset: 0.18, color: '#CFCFCF' },
					{ offset: 0.36, color: '#ACACAC' },
					{ offset: 0.5, color: '#FFFFFF' },
					{ offset: 0.64, color: '#ACACAC' },
					{ offset: 0.82, color: '#CFCFCF' },
					{ offset: 1, color: '#898989' },
				],
			}
		case 'bronze':
			return {
				kind: 'gradient',
				type: 'vertical',
				stops: [
					{ offset: 0, color: '#6E3A06' },
					{ offset: 0.18, color: '#CD7F31' },
					{ offset: 0.36, color: '#9E5D1C' },
					{ offset: 0.5, color: '#FCD060' },
					{ offset: 0.64, color: '#9E5D1C' },
					{ offset: 0.82, color: '#CD7F31' },
					{ offset: 1, color: '#6E3A06' },
				],
			}
		case 'hologram':
			return {
				kind: 'gradient',
				type: 'diagonal',
				stops: [
					{ offset: 0, color: '#B6EEE8' },
					{ offset: 0.32, color: '#F5F3EA' },
					{ offset: 0.5, color: '#F1B2B9' },
					{ offset: 0.6, color: '#D893C1' },
					{ offset: 0.8, color: '#B6EEE8' },
				],
			}
		default:
			return { kind: 'solid', color: fallbackColor }
	}
}