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

	function clear_terms_error_hover_close_timer() {
		if (!terms_error_hover_close_timer.value) return;
		clearTimeout(terms_error_hover_close_timer.value);
		terms_error_hover_close_timer.value = null;
	}

	function toggle_terms_error_popover() {
		terms_error_popover_pinned.value = !terms_error_popover_pinned.value;
	}

	function on_terms_error_hover_start() {
		clear_terms_error_hover_close_timer();
		terms_error_popover_hovered.value = true;
	}

	function on_terms_error_hover_end() {
		clear_terms_error_hover_close_timer();
		terms_error_hover_close_timer.value = setTimeout(() => {
			terms_error_popover_hovered.value = false;
			terms_error_hover_close_timer.value = null;
		}, 90);
	}

	function on_document_click(event: MouseEvent) {
		const target = event.target as Node | null;
		if (!target) return;
		if (!terms_error_ref.value?.contains(target)) {
			clear_terms_error_hover_close_timer();
			terms_error_popover_pinned.value = false;
			terms_error_popover_hovered.value = false;
		}
	}

	watch(
		() => Boolean(params.termsError.value && !params.agreeTerms.value),
		(has_terms_error) => {
			if (!has_terms_error) {
				clear_terms_error_hover_close_timer();
				terms_error_popover_pinned.value = false;
				terms_error_popover_hovered.value = false;
			}
		}
	);

	onMounted(() => {
		document.addEventListener('click', on_document_click);
	});

	onBeforeUnmount(() => {
		clear_terms_error_hover_close_timer();
		document.removeEventListener('click', on_document_click);
	});

	return {
		termsErrorPopoverOpen: terms_error_popover_open,
		termsErrorIconStrong: terms_error_icon_strong,
		termsErrorRef: terms_error_ref,
		toggleTermsErrorPopover: toggle_terms_error_popover,
		onTermsErrorHoverStart: on_terms_error_hover_start,
		onTermsErrorHoverEnd: on_terms_error_hover_end,
	};
}