import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export function useProductReviewsCarousel(cardCount: number, gap = 18) {
    const currentSlide = ref(0);
    const cardWidth = ref(0);
    const viewportRef = ref<HTMLElement | null>(null);
    const cardRef = ref<HTMLElement | null>(null);
    const autoTimer = ref<ReturnType<typeof setInterval> | null>(null);

    const trackStyle = computed(() => ({
        transform: `translateX(-${currentSlide.value * (cardWidth.value + gap)}px)`,
    }));

    const visibleCards = computed(() => {
        const viewportWidth = viewportRef.value?.getBoundingClientRect().width ?? 0;
        const slideWidth = cardWidth.value + gap;

        if (!viewportWidth || !slideWidth) return 1;
        return Math.max(1, Math.floor((viewportWidth + gap) / slideWidth));
    });

    const maxSlide = computed(() => Math.max(0, cardCount - visibleCards.value));
    const canGoPrev = computed(() => currentSlide.value > 0);
    const canGoNext = computed(() => currentSlide.value < maxSlide.value);

    function syncCardWidth() {
        if (!cardRef.value) return;
        cardWidth.value = cardRef.value.getBoundingClientRect().width;
    }

    function setCardRef(el: Element | null, index: number) {
        if (index !== 0) return;
        cardRef.value = el as HTMLElement | null;
        syncCardWidth();
    }

    function nextReview() {
        if (currentSlide.value >= maxSlide.value) {
            currentSlide.value = 0;
            return;
        }

        currentSlide.value += 1;
    }

    function prevReview() {
        if (currentSlide.value === 0) return;
        currentSlide.value -= 1;
    }

    function startAuto() {
        stopAuto();
        autoTimer.value = setInterval(nextReview, 3200);
    }

    function stopAuto() {
        if (!autoTimer.value) return;
        clearInterval(autoTimer.value);
        autoTimer.value = null;
    }

    watch(maxSlide, (nextMax) => {
        if (currentSlide.value > nextMax) {
            currentSlide.value = nextMax;
        }
    });

    onMounted(() => {
        syncCardWidth();
        currentSlide.value = 0;
        startAuto();
        window.addEventListener('resize', syncCardWidth);
    });

    onBeforeUnmount(() => {
        stopAuto();
        window.removeEventListener('resize', syncCardWidth);
    });

    return {
        viewportRef,
        trackStyle,
        canGoPrev,
        canGoNext,
        setCardRef,
        nextReview,
        prevReview,
        startAuto,
        stopAuto,
    };
}
