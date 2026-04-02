export function useCheckoutFeatureTransition() {
	const enter_duration_ms = 1000;
	const leave_duration_ms = 360;

	function beforeEnter(element: Element) {
		const node = element as HTMLElement;
		node.style.opacity = '0';
		node.style.overflow = 'hidden';
		node.style.clipPath = 'inset(0 0 100% 0)';
	}

	function enter(element: Element, done: () => void) {
		const node = element as HTMLElement;
		requestAnimationFrame(() => {
			node.style.opacity = '1';
			node.style.clipPath = 'inset(0 0 0 0)';
		});
		window.setTimeout(() => done(), enter_duration_ms);
	}

	function afterEnter(element: Element) {
		const node = element as HTMLElement;
		node.style.opacity = '1';
		node.style.overflow = '';
		node.style.clipPath = '';
	}

	function beforeLeave(element: Element) {
		const node = element as HTMLElement;
		node.style.opacity = '1';
		node.style.overflow = 'hidden';
		node.style.clipPath = 'inset(0 0 0 0)';
		node.style.position = 'absolute';
		node.style.inset = '0';
		node.style.width = '100%';
	}

	function leave(element: Element, done: () => void) {
		const node = element as HTMLElement;
		requestAnimationFrame(() => {
			node.style.opacity = '0';
			node.style.clipPath = 'inset(0 0 100% 0)';
		});
		window.setTimeout(() => done(), leave_duration_ms);
	}

	function afterLeave(element: Element) {
		const node = element as HTMLElement;
		node.style.opacity = '';
		node.style.overflow = '';
		node.style.clipPath = '';
		node.style.position = '';
		node.style.inset = '';
		node.style.width = '';
	}

	return {
		enter_duration_ms,
		leave_duration_ms,
		beforeEnter,
		enter,
		afterEnter,
		beforeLeave,
		leave,
		afterLeave,
	};
}