type Side = 'top' | 'bottom' | 'left' | 'right'
type Alignment = 'start' | 'center' | 'end'

type HorizontalAlign = 'left' | 'center' | 'right'
type VerticalAlign = 'top' | 'center' | 'bottom'

export type MuTooltipPlacement =
	| 'top' | `top-${HorizontalAlign}`
	| 'bottom' | `bottom-${HorizontalAlign}`
	| 'left' | `left-${VerticalAlign}`
	| 'right' | `right-${VerticalAlign}`

export type MuTooltipIconConfig = {
	name: string
	color?: string
	size?: number
}

type ShowTooltipOptions = {
	iconLeft?: MuTooltipIconConfig
	iconRight?: MuTooltipIconConfig
}

export const parseMuTooltipPlacement = (
	placement: MuTooltipPlacement,
): { side: Side; align: Alignment } => {
	const dash = placement.indexOf('-')
	if (dash === -1) return { side: placement as Side, align: 'center' }

	const side = placement.slice(0, dash) as Side
	const align_token = placement.slice(dash + 1)

	if (side === 'top' || side === 'bottom') {
		if (align_token === 'left') return { side, align: 'start' }
		if (align_token === 'right') return { side, align: 'end' }
		return { side, align: 'center' }
	}

	if (align_token === 'top') return { side, align: 'start' }
	if (align_token === 'bottom') return { side, align: 'end' }
	return { side, align: 'center' }
}

export const useMuTooltip = () => {
	const visible = useState<boolean>('mu_tooltip_visible', () => false)
	const text = useState<string>('mu_tooltip_text', () => '')
	const x = useState<number>('mu_tooltip_x', () => 0)
	const y = useState<number>('mu_tooltip_y', () => 0)
	const placement = useState<MuTooltipPlacement>('mu_tooltip_placement', () => 'top')
	const icon_left = useState<MuTooltipIconConfig | null>('mu_tooltip_icon_left', () => null)
	const icon_right = useState<MuTooltipIconConfig | null>('mu_tooltip_icon_right', () => null)

	const showTooltip = (
		event: MouseEvent,
		content: string,
		placement_arg: MuTooltipPlacement = 'top',
		options: ShowTooltipOptions = {},
	) => {
		const target = event.currentTarget as HTMLElement
		const rect = target.getBoundingClientRect()
		const { side, align } = parseMuTooltipPlacement(placement_arg)

		text.value = content
		placement.value = placement_arg

		if (side === 'top' || side === 'bottom') {
			switch (align) {
				case 'start':
					x.value = rect.left
					break
				case 'end':
					x.value = rect.right
					break
				default:
					x.value = rect.left + rect.width / 2
			}
			y.value = side === 'top' ? rect.top : rect.bottom
		} else {
			switch (align) {
				case 'start':
					y.value = rect.top
					break
				case 'end':
					y.value = rect.bottom
					break
				default:
					y.value = rect.top + rect.height / 2
			}
			x.value = side === 'left' ? rect.left : rect.right
		}

		icon_left.value = options.iconLeft ?? null
		icon_right.value = options.iconRight ?? null
		visible.value = true
	}

	const hideTooltip = () => {
		visible.value = false
	}

	return {
		visible,
		text,
		x,
		y,
		placement,
		icon_left,
		icon_right,
		showTooltip,
		hideTooltip,
	}
}
