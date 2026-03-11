import type { CSSProperties } from 'vue';
import type { GuideTargetRect } from '~/types/home/guideTour';

export const HOME_GUIDE_TOUR_HEADER_IMAGE_BY_STEP: Record<number, string> = {
	1: '/home/guide-tour/step-1/profile-card.png',
	2: '/home/guide-tour/step-2/categories-card.png',
	3: '/home/guide-tour/step-3/search-card.png',
};

const HOME_GUIDE_TOUR_PANEL_POSITION_BY_STEP: Record<number, { x: number; y: number }> = {
	1: { x: 1314, y: 84 },
	2: { x: 752, y: 88 },
	3: { x: 1140, y: 84 },
	4: { x: 1140, y: 680 },
};

export function resolve_home_guide_tour_panel_style(
	step: number,
	target_rect: GuideTargetRect | null,
	window_width?: number
): CSSProperties {
	const position = HOME_GUIDE_TOUR_PANEL_POSITION_BY_STEP[step];

	if (position) {
		if (typeof window_width !== 'number') return {};

		const panel_width = Math.min(416, window_width - 24);
		const clamped_left = Math.min(
			Math.max(12, position.x),
			Math.max(12, window_width - panel_width - 12)
		);
		const clamped_top = Math.max(12, position.y);

		return {
			top: `${clamped_top}px`,
			left: `${clamped_left}px`,
			right: 'auto',
			transform: 'none',
		};
	}

	if (!target_rect || typeof window_width !== 'number') {
		return {};
	}

	const panel_width = Math.min(520, window_width - 24);
	const centered_left = target_rect.left + target_rect.width / 2 - panel_width / 2;
	const clamped_left = Math.min(
		Math.max(12, centered_left),
		Math.max(12, window_width - panel_width - 12)
	);

	return {
		top: `${target_rect.top + target_rect.height + 12}px`,
		left: `${clamped_left}px`,
		right: 'auto',
		transform: 'none',
	};
}

export function split_home_guide_tour_skip_copy(body: string) {
	const match = body.match(/"([^"]+)"/);
	if (!match || match.index === undefined) {
		return {
			before: body,
			highlighted: '',
			after: '',
		};
	}

	const highlighted = match[0];
	const start = match.index;
	const end = start + highlighted.length;

	return {
		before: body.slice(0, start),
		highlighted,
		after: body.slice(end),
	};
}