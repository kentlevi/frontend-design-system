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
	const { t } = useI18n();
	const active_filter = ref<AccountPointLogFilter>('all');
	const challenge_items = useAccountCollection(account_point_challenges).items;
	const log_items = useAccountCollection(account_point_logs).items;

	const summary = computed(() => ({
		...account_point_summary,
		conversion_rate_label: account_point_summary.conversion_rate_label.startsWith('account.')
			? t(account_point_summary.conversion_rate_label)
			: account_point_summary.conversion_rate_label,
	}));
	const challenges = computed(() =>
		challenge_items.value.map((challenge) => ({
			...challenge,
			name: t(challenge.name),
			reward_copy: t(challenge.reward_copy),
		}))
	);
	const ranks = computed(() =>
		account_point_ranks.map((rank) => ({
			...rank,
			rank_label: t(rank.rank_label),
			name: t(rank.name),
			spend_requirement: rank.spend_requirement.startsWith('account.') ? t(rank.spend_requirement) : rank.spend_requirement,
			perks: rank.perks.map((perk) => t(perk)),
			level_up_bonus_gifts: rank.level_up_bonus_gifts.map((gift) => t(gift)),
		}))
	);
	const filters = computed(() =>
		account_point_filters.map((filter) => ({
			...filter,
			label: t(filter.label),
		}))
	);
	const logs = computed(() =>
		log_items.value.map((log) => {
			if (log.id === 'earned-order-12405077220') {
				return { ...log, title: `${t(log.title)} (Order # 12405077220)` };
			}
			if (log.id === 'used-order-12405077220') {
				return { ...log, title: `${t(log.title)} (Order # 12405077220)` };
			}
			if (log.id === 'quest-sticker-explorer') {
				return { ...log, title: `${t(log.title)} (${t('account.points.challenges.stickerExplorer.name')})` };
			}
			if (log.id === 'quest-first-order-victory') {
				return { ...log, title: `${t(log.title)} (${t('account.points.challenges.firstOrderVictory.name')})` };
			}
			if (log.id === 'rank-level-up') {
				return {
					...log,
					title: `${t(log.title)} (${t('account.points.tierName')})`,
					value: t(log.value),
				};
			}
			return log;
		})
	);

	const visible_challenges = computed(() => challenges.value.slice(0, 6));
	const completed_challenge_count = computed(
		() => challenges.value.filter((challenge) => challenge.state === 'active').length
	);
	const filtered_logs = computed(() => {
		if (active_filter.value === 'all') return logs.value;

		return logs.value.filter((log) => log.filter === active_filter.value);
	});

	function setActiveFilter(filter_id: AccountPointLogFilter) {
		active_filter.value = filter_id;
	}

	return {
		summary: summary.value,
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
