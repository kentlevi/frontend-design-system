import type { ComponentPublicInstance } from 'vue';
import type { HighlightPart } from '~/types/layout/appHeaderSearch';

export function useAppHeaderSearchModal(params: {
	searchQuery: () => string;
	setModalRef: (element: HTMLElement | null) => void;
	setInputRef: (element: HTMLInputElement | null) => void;
}) {
	function escapeRegExp(value: string) {
		return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function getHighlightParts(value: string): HighlightPart[] {
		const term =
			typeof params.searchQuery() === 'string' ? params.searchQuery().trim() : '';
		if (!term) return [{ text: value, isMatch: false }];

		const escaped_term = escapeRegExp(term);
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

	function bindModalRef(element: Element | ComponentPublicInstance | null) {
		params.setModalRef(element instanceof HTMLElement ? element : null);
	}

	function bindInputRef(element: Element | ComponentPublicInstance | null) {
		params.setInputRef(element instanceof HTMLInputElement ? element : null);
	}

	return {
		getHighlightParts,
		bindModalRef,
		bindInputRef,
	};
}