<script setup lang="ts">
interface AddressItem {
	name: string;
	phone?: string;
	address: string;
	company: string;
	tag: string;
	isDefault?: boolean;
}

const props = defineProps<{
	item: AddressItem;
	section: string;
	index: number;
}>();

const { t } = useI18n();

const tagBadgeColors = {
	home: {
		bgColor: 'var(--aloha-10)',
		textColor: 'var(--aloha-60)',
	},
	office: {
		bgColor: 'var(--neon-blue-10)',
		textColor: 'var(--neon-blue-60)',
	},
	client: {
		bgColor: 'var(--azure-10)',
		textColor: 'var(--azure-60)',
	},
} as const;
</script>

<template>
	<article
		class="account-address-book-card"
		:data-testid="`account-address-book-item-${section}-${index}`"
	>
		<header class="account-address-book-card-header">
			<div class="account-address-book-card-title-row">
				<h3 class="account-address-book-card-name">{{ item.name }}</h3>
				<UiBadge
					v-if="item.isDefault"
					variant="outline"
					tone="default"
					size="md"
				>
					{{ t('account.addressBook.default') }}
				</UiBadge>
			</div>
			<UiButton
				variant="ghost"
				tone="neutral"
				height="40px"
				width="40px"
				:no-hover="true"
				class="account-address-book-menu-button"
				:data-testid="`account-address-book-item-menu-${section}-${index}-button`"
			>
				<UiIcon name="regular-ellipsis-horizontal" :size="24" />
			</UiButton>
		</header>
		<div class="account-address-book-card-body">
			<div class="account-address-book-card-footer">
				<div class="account-address-book-card-copy">
					<p v-if="item.phone" class="account-address-book-card-phone">
						{{ item.phone }}
					</p>
					<p class="account-address-book-card-address">{{ item.address }}</p>
					<span class="account-address-book-card-company">{{ item.company }}</span>
				</div>
				<UiBadge
					v-if="item.tag"
					variant="tonal"
					tone="default"
					size="md"
					:bg-color="tagBadgeColors[item.tag.toLowerCase() as keyof typeof tagBadgeColors]?.bgColor || 'var(--gray-10)'"
					:text-color="tagBadgeColors[item.tag.toLowerCase() as keyof typeof tagBadgeColors]?.textColor || 'var(--gray-60)'"
				>
					{{ t(`account.addressBook.tags.${item.tag}`) }}
				</UiBadge>
			</div>
		</div>
	</article>
</template>

<style scoped lang="scss">
.account-address-book-card {
	border: 1px solid var(--border-default);
	border-radius: 12px;
	background: var(--contrast-light);
	overflow: hidden;
	transition: border-color 0.18s ease, box-shadow 0.18s ease;

	.account-address-book-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 24px;
		border-bottom: 1px solid var(--border-subtle, var(--border-default));
	}

	.account-address-book-card-title-row {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}

	.account-address-book-card-name {
		font-size: var(--type-size-200);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-200);
	}

	.account-address-book-menu-button {
		color: var(--text-primary);
		flex-shrink: 0;
		padding: 0;
	}

	.account-address-book-card-body {
		padding: 20px 24px;
	}

	.account-address-book-card-phone {
		color: var(--text-primary);
		font-size: var(--type-size-100);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-100);
	}

	.account-address-book-card-address {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}

	.account-address-book-card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	.account-address-book-card-company {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	&:hover {
		border-color: color-mix(in srgb, var(--brand-primary) 26%, var(--border-default));
		box-shadow: var(--shadow-sm);
	}
}

@media (max-width: 980px) {
	.account-address-book-card {
		.account-address-book-card-header,
		.account-address-book-card-body {
			padding-left: 16px;
			padding-right: 16px;
		}
	}
}

@media (max-width: 640px) {
	.account-address-book-card {
		.account-address-book-card-title-row,
		.account-address-book-card-footer {
			align-items: flex-start;
			flex-direction: column;
		}
	}
}
</style>