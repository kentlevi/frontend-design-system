import type { ComponentPublicInstance } from 'vue';
import type { HighlightPart } from '~/types/layout/appHeaderSearch';

export function useAppHeaderSearchModal(params: {
	searchQuery: () => string;
	setModalRef: (element: HTMLElement | null) => void;
	setInputRef: (element: HTMLInputElement | null) => void;
}) {
	function escape_reg_exp(value: string) {
		return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function get_highlight_parts(value: string): HighlightPart[] {
		const term =
			typeof params.searchQuery() === 'string' ? params.searchQuery().trim() : '';
		if (!term) return [{ text: value, isMatch: false }];

		const escaped_term = escape_reg_exp(term);
		const split_matcher = new RegExp(`(${escaped_term})`, 'ig');
		const exact_matcher = new RegExp(`^${escaped_term}$`, 'i');

		return value
			.split(split_matcher)
			.filter((part) => part.length > 0)
			.map((part) => ({
				text: part,
				isMatch: exact_matcher.test(part),
			}));
	}

	function bind_modal_ref(element: Element | ComponentPublicInstance | null) {
		params.setModalRef(element instanceof HTMLElement ? element : null);
	}

	function bind_input_ref(element: Element | ComponentPublicInstance | null) {
		params.setInputRef(element instanceof HTMLInputElement ? element : null);
	}

	return {
		getHighlightParts: get_highlight_parts,
		bindModalRef: bind_modal_ref,
		bindInputRef: bind_input_ref,
	};
}