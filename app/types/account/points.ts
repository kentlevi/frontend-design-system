export type AccountPointLogFilter = 'all' | 'earned' | 'deducted';

export interface AccountPointLog {
	id: string;
	title: string;
	date: string;
	value: string;
	positive: boolean;
	filter: Exclude<AccountPointLogFilter, 'all'>;
}

export interface AccountPointSummary {
	tier_name_key: string;
	badge_src: string;
	last_tier_upgrade_date: string;
	balance: string;
	expiry_date: string;
	progress_percent: number;
	remaining_spend: string;
	conversion_rate_label: string;
}

export interface AccountPointChallenge {
	id: string;
	name: string;
	state: 'active' | 'locked';
	icon_src: string;
	reward_copy: string;
}

export interface AccountPointHistoryFilter {
	id: AccountPointLogFilter;
	label: string;
}

export interface AccountPointRank {
	id: string;
	rank_label: string;
	name: string;
	badge_src: string;
	background_src: string;
	spend_requirement: string;
	perks: string[];
	level_up_bonus_gifts: string[];
	is_current?: boolean;
	theme: 'scout' | 'leader' | 'boss' | 'dynamo';
}