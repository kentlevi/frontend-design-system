import type { SearchApiResponse } from '~/types/layout/appHeaderSearch';

export async function searchProducts(payload: {
	query: string;
	page: number;
	per_page: number;
}): Promise<SearchApiResponse> {
	const { $api } = useNuxtApp();

	return $api.get('/search', {
		params: payload,
	});
}