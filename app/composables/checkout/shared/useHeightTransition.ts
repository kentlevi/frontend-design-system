import { watch, nextTick, type Ref } from 'vue';

export function useHeightTransition(
	wrapperRef: Ref<HTMLElement | null>,
	watchSource: any,
	getActivePanelSelector: () => string | null,
	options: {
		enabled?: () => boolean;
		enterDurationMs?: number;
		leaveDurationMs?: number;
	} = {}
) {
	const enterDuration = options.enterDurationMs ?? 1000;
	const leaveDuration = options.leaveDurationMs ?? 360;
	let timeout: number | null = null;

	watch(watchSource, async () => {
		if (options.enabled && !options.enabled()) return;
		const wrapper = wrapperRef.value;
		if (!wrapper) return;

		const start_height = wrapper.offsetHeight;
		wrapper.style.height = `${start_height}px`;
		wrapper.style.overflow = 'hidden';

		await nextTick();

		const selector = getActivePanelSelector();
		let end_height = 0;
		if (selector) {
			const active_panel = wrapper.querySelector<HTMLElement>(selector);
			end_height = active_panel?.scrollHeight ?? wrapper.scrollHeight;
		}

		requestAnimationFrame(() => {
			wrapper.style.height = `${end_height}px`;
		});

		if (timeout !== null) window.clearTimeout(timeout);
		timeout = window.setTimeout(() => {
			wrapper.style.height = '';
			wrapper.style.overflow = '';
			timeout = null;
		}, Math.max(enterDuration, leaveDuration) + 40);
	});
}
