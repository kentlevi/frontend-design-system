import {
	computed,
	onBeforeUnmount,
	onMounted,
	ref,
	type ComponentPublicInstance,
	type Ref,
} from 'vue';

type UseHomeReviewsCarouselOptions = {
	gap?: number;
	intervalMs?: number;
};

export function useHomeReviewsCarousel(
	itemCount: Ref<number>,
	options: UseHomeReviewsCarouselOptions = {}
) {
	const gap = options.gap ?? 24;
	const intervalMs = options.intervalMs ?? 3200;

	const currentSlide = ref(0);
	const cardWidth = ref(0);
	const viewportRef = ref<HTMLElement | null>(null);
	const cardRef = ref<HTMLElement | null>(null);
	const sectionRef = ref<HTMLElement | null>(null);
	const autoTimer = ref<ReturnType<typeof setInterval> | null>(null);
	const autoResumeTimer = ref<ReturnType<typeof setTimeout> | null>(null);
	const viewportObserver = ref<IntersectionObserver | null>(null);

	const trackStyle = computed(() => ({
		transform: `translateX(-${currentSlide.value * (cardWidth.value + gap)}px)`,
	}));

	const visibleCards = computed(() => {
		const viewportWidth = viewportRef.value?.getBoundingClientRect().width ?? 0;
		const slideWidth = cardWidth.value + gap;
		if (!viewportWidth || !slideWidth) return 1;
		return Math.max(1, Math.floor((viewportWidth + gap) / slideWidth));
	});

	const maxSlide = computed(() => Math.max(0, itemCount.value - visibleCards.value));
	const canGoPrev = computed(() => currentSlide.value > 0);
	const canGoNext = computed(() => currentSlide.value < maxSlide.value);

	function syncCardWidth() {
		if (!cardRef.value) return;
		cardWidth.value = cardRef.value.getBoundingClientRect().width;
	}

	function moveToNextSlide() {
		if (currentSlide.value >= maxSlide.value) {
			currentSlide.value = 0;
			return;
		}

		currentSlide.value += 1;
	}

	function moveToPrevSlide() {
		if (currentSlide.value === 0) return;
		currentSlide.value -= 1;
	}

	function nextSlide() {
		stopAuto();
		moveToNextSlide();
		scheduleAutoResume();
	}

	function prevSlide() {
		stopAuto();
		moveToPrevSlide();
		scheduleAutoResume();
	}

	function startAuto() {
		clearAutoResumeTimer();
		stopAuto();
		autoTimer.value = setInterval(moveToNextSlide, intervalMs);
	}

	function stopAuto() {
		if (!autoTimer.value) return;
		clearInterval(autoTimer.value);
		autoTimer.value = null;
	}

	function clearAutoResumeTimer() {
		if (!autoResumeTimer.value) return;
		clearTimeout(autoResumeTimer.value);
		autoResumeTimer.value = null;
	}

	function scheduleAutoResume() {
		clearAutoResumeTimer();
		autoResumeTimer.value = setTimeout(() => {
			autoResumeTimer.value = null;
			startAuto();
		}, intervalMs);
	}

	function setCardRef(el: Element | ComponentPublicInstance | null) {
		const resolved =
			el && '$el' in el
				? (el.$el as Element | null)
				: (el as Element | null);
		cardRef.value = (resolved as HTMLElement | null) ?? null;
	}

	onMounted(() => {
		syncCardWidth();
		currentSlide.value = 0;

		if ('IntersectionObserver' in window && sectionRef.value) {
			viewportObserver.value = new IntersectionObserver(
				(entries) => {
					const [entry] = entries;
					if (entry?.isIntersecting) {
						syncCardWidth();
						startAuto();
						return;
					}

					stopAuto();
				},
				{ threshold: 0.2 }
			);

			viewportObserver.value.observe(sectionRef.value);
		} else {
			startAuto();
		}

		window.addEventListener('resize', syncCardWidth);
	});

	onBeforeUnmount(() => {
		stopAuto();
		clearAutoResumeTimer();
		viewportObserver.value?.disconnect();
		window.removeEventListener('resize', syncCardWidth);
	});

	return {
		sectionRef,
		viewportRef,
		trackStyle,
		canGoPrev,
		canGoNext,
		nextSlide,
		prevSlide,
		startAuto,
		stopAuto,
		setCardRef,
	};
}