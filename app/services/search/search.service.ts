import type { ApiResponse } from '~/types/config/api';
import type {
	SearchApiResponse,
	SearchRecentApiResponse,
} from '~/types/layout/appHeaderSearch';

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

export async function getRecentSearchedProducts(): Promise<SearchRecentApiResponse> {
	const { $api } = useNuxtApp();

	return $api.get('/search/recent');
}

export async function saveRecentSearchedProducts(payload: { product_id: number }): Promise<ApiResponse> {
	const { $api } = useNuxtApp();

	return $api.post('/search/save-recent', { ...payload });
}