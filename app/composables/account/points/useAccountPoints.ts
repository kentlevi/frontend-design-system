import {
	account_point_challenges,
	account_point_filters,
	account_point_logs,
	account_point_ranks,
	account_point_summary,
} from '~/data/account/points';
import { useAccountCollection } from '~/composables/account/useAccountCollection';
import type { AccountPointLogFilter } from '~/types/account/points';

export function useAccountPoints() {
	const active_filter = ref<AccountPointLogFilter>('all');

	const summary = account_point_summary;
	const challenges = useAccountCollection(account_point_challenges).items;
	const ranks = account_point_ranks;
	const filters = account_point_filters;
	const logs = useAccountCollection(account_point_logs).items;

	const visible_challenges = computed(() => challenges.slice(0, 6));
	const completed_challenge_count = computed(
		() => challenges.filter((challenge) => challenge.state === 'active').length
	);
	const filtered_logs = computed(() => {
		if (active_filter.value === 'all') return logs;

		return logs.filter((log) => log.filter === active_filter.value);
	});

	function setActiveFilter(filter_id: AccountPointLogFilter) {
		active_filter.value = filter_id;
	}

	return {
		summary,
		ranks,
		challenges,
		visible_challenges,
		completed_challenge_count,
		filters,
		logs: filtered_logs,
		active_filter,
		setActiveFilter,
	};
}