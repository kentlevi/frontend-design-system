import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export function useProductReviewsCarousel(cardCount: number, gap = 18) {
	const current_slide = ref(0);
	const card_width = ref(0);
	const viewport_ref = ref<HTMLElement | null>(null);
	const card_ref = ref<HTMLElement | null>(null);
	const auto_timer = ref<ReturnType<typeof setInterval> | null>(null);
	const auto_resume_timer = ref<ReturnType<typeof setTimeout> | null>(null);

	const track_style = computed(() => ({
		transform: `translateX(-${current_slide.value * (card_width.value + gap)}px)`,
	}));

	const visible_cards = computed(() => {
		const viewport_width = viewport_ref.value?.getBoundingClientRect().width ?? 0;
		const slide_width = card_width.value + gap;

		if (!viewport_width || !slide_width) return 1;
		return Math.max(1, Math.floor((viewport_width + gap) / slide_width));
	});

	const max_slide = computed(() => Math.max(0, cardCount - visible_cards.value));
	const can_go_prev = computed(() => current_slide.value > 0);
	const can_go_next = computed(() => current_slide.value < max_slide.value);

	function syncCardWidth() {
		if (!card_ref.value) return;
		card_width.value = card_ref.value.getBoundingClientRect().width;
	}

	function setCardRef(el: Element | null, index: number) {
		if (index !== 0) return;
		card_ref.value = el as HTMLElement | null;
		syncCardWidth();
	}

	function moveToNextReview() {
		if (current_slide.value >= max_slide.value) {
			current_slide.value = 0;
			return;
		}

		current_slide.value += 1;
	}

	function moveToPrevReview() {
		if (current_slide.value === 0) return;
		current_slide.value -= 1;
	}

	function nextReview() {
		stopAuto();
		moveToNextReview();
		scheduleAutoResume();
	}

	function prevReview() {
		stopAuto();
		moveToPrevReview();
		scheduleAutoResume();
	}

	function startAuto() {
		clearAutoResumeTimer();
		stopAuto();
		auto_timer.value = setInterval(moveToNextReview, 3200);
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
		}, 3200);
	}

	watch(max_slide, (next_max) => {
		if (current_slide.value > next_max) {
			current_slide.value = next_max;
		}
	});

	onMounted(() => {
		syncCardWidth();
		current_slide.value = 0;
		startAuto();
		window.addEventListener('resize', syncCardWidth);
	});

	onBeforeUnmount(() => {
		stopAuto();
		clearAutoResumeTimer();
		window.removeEventListener('resize', syncCardWidth);
	});

	return {
		viewport_ref,
		track_style,
		can_go_prev,
		can_go_next,
		setCardRef,
		nextReview,
		prevReview,
		startAuto,
		stopAuto,
	};
}