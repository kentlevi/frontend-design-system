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
	item_count: Ref<number>,
	options: UseHomeReviewsCarouselOptions = {}
) {
	const gap = options.gap ?? 24;
	const interval_ms = options.intervalMs ?? 3200;

	const current_slide = ref(0);
	const card_width = ref(0);
	const viewport_ref = ref<HTMLElement | null>(null);
	const card_ref = ref<HTMLElement | null>(null);
	const section_ref = ref<HTMLElement | null>(null);
	const auto_timer = ref<ReturnType<typeof setInterval> | null>(null);
	const auto_resume_timer = ref<ReturnType<typeof setTimeout> | null>(null);
	const viewport_observer = ref<IntersectionObserver | null>(null);

	const track_style = computed(() => ({
		transform: `translateX(-${current_slide.value * (card_width.value + gap)}px)`,
	}));

	const visible_cards = computed(() => {
		const viewport_width = viewport_ref.value?.getBoundingClientRect().width ?? 0;
		const slide_width = card_width.value + gap;
		if (!viewport_width || !slide_width) return 1;
		return Math.max(1, Math.floor((viewport_width + gap) / slide_width));
	});

	const max_slide = computed(() => Math.max(0, item_count.value - visible_cards.value));
	const can_go_prev = computed(() => current_slide.value > 0);
	const can_go_next = computed(() => current_slide.value < max_slide.value);

	function syncCardWidth() {
		if (!card_ref.value) return;
		card_width.value = card_ref.value.getBoundingClientRect().width;
	}

	function moveToNextSlide() {
		if (current_slide.value >= max_slide.value) {
			current_slide.value = 0;
			return;
		}

		current_slide.value += 1;
	}

	function moveToPrevSlide() {
		if (current_slide.value === 0) return;
		current_slide.value -= 1;
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
		auto_timer.value = setInterval(moveToNextSlide, interval_ms);
	}

	function stopAuto() {
		if (!auto_timer.value) return;
		clearInterval(auto_timer.value);
		auto_timer.value = null;
	}

	function clearAutoResumeTimer() {
		if (!auto_resume_timer.value) return;
		clearTimeout(auto_resume_timer.value);
		auto_resume_timer.value = null;
	}

	function scheduleAutoResume() {
		clearAutoResumeTimer();
		auto_resume_timer.value = setTimeout(() => {
			auto_resume_timer.value = null;
			startAuto();
		}, interval_ms);
	}

	function setCardRef(el: Element | ComponentPublicInstance | null) {
		const resolved =
			el && '$el' in el
				? (el.$el as Element | null)
				: (el as Element | null);
		card_ref.value = (resolved as HTMLElement | null) ?? null;
	}

	onMounted(() => {
		syncCardWidth();
		current_slide.value = 0;

		if ('IntersectionObserver' in window && section_ref.value) {
			viewport_observer.value = new IntersectionObserver(
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

			viewport_observer.value.observe(section_ref.value);
		} else {
			startAuto();
		}

		window.addEventListener('resize', syncCardWidth);
	});

	onBeforeUnmount(() => {
		stopAuto();
		clearAutoResumeTimer();
		viewport_observer.value?.disconnect();
		window.removeEventListener('resize', syncCardWidth);
	});

	return {
		section_ref,
		viewport_ref,
		track_style,
		can_go_prev,
		can_go_next,
		nextSlide,
		prevSlide,
		startAuto,
		stopAuto,
		setCardRef,
	};
}