import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

export function useAuthRegisterCard(params: {
	termsError: Ref<string>;
	agreeTerms: Ref<boolean>;
}) {
	const terms_error_popover_pinned = ref(false);
	const terms_error_popover_hovered = ref(false);
	const terms_error_hover_close_timer = ref<ReturnType<typeof setTimeout> | null>(null);
	const terms_error_ref = ref<HTMLElement | null>(null);

	const terms_error_popover_open = computed(
		() => terms_error_popover_pinned.value || terms_error_popover_hovered.value
	);
	const terms_error_icon_strong = computed(() => terms_error_popover_open.value);

	function clearTermsErrorHoverCloseTimer() {
		if (!terms_error_hover_close_timer.value) return;
		clearTimeout(terms_error_hover_close_timer.value);
		terms_error_hover_close_timer.value = null;
	}

	function toggleTermsErrorPopover() {
		terms_error_popover_pinned.value = !terms_error_popover_pinned.value;
	}

	function onTermsErrorHoverStart() {
		clearTermsErrorHoverCloseTimer();
		terms_error_popover_hovered.value = true;
	}

	function onTermsErrorHoverEnd() {
		clearTermsErrorHoverCloseTimer();
		terms_error_hover_close_timer.value = setTimeout(() => {
			terms_error_popover_hovered.value = false;
			terms_error_hover_close_timer.value = null;
		}, 90);
	}

	function onDocumentClick(event: MouseEvent) {
		const target = event.target as Node | null;
		if (!target) return;
		if (!terms_error_ref.value?.contains(target)) {
			clearTermsErrorHoverCloseTimer();
			terms_error_popover_pinned.value = false;
			terms_error_popover_hovered.value = false;
		}
	}

	watch(
		() => Boolean(params.termsError.value && !params.agreeTerms.value),
		(has_terms_error) => {
			if (!has_terms_error) {
				clearTermsErrorHoverCloseTimer();
				terms_error_popover_pinned.value = false;
				terms_error_popover_hovered.value = false;
			}
		}
	);

	onMounted(() => {
		document.addEventListener('click', onDocumentClick);
	});

	onBeforeUnmount(() => {
		clearTermsErrorHoverCloseTimer();
		document.removeEventListener('click', onDocumentClick);
	});

	return {
		termsErrorPopoverOpen: terms_error_popover_open,
		termsErrorIconStrong: terms_error_icon_strong,
		termsErrorRef: terms_error_ref,
		toggleTermsErrorPopover: toggleTermsErrorPopover,
		onTermsErrorHoverStart: onTermsErrorHoverStart,
		onTermsErrorHoverEnd: onTermsErrorHoverEnd,
	};
}