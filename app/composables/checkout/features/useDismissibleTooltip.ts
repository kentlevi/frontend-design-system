import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export function useDismissibleTooltip(
	tooltip_ref: Ref<HTMLElement | null>,
	is_open: Ref<boolean>,
) {
	function handleDocumentClick(event: MouseEvent) {
		const target = event.target as HTMLElement | null;
		if (!target || !is_open.value || !tooltip_ref.value) return;

		if (!tooltip_ref.value.contains(target)) {
			is_open.value = false;
		}
	}

	onMounted(() => {
		document.addEventListener('click', handleDocumentClick, true);
	});

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleDocumentClick, true);
	});
}