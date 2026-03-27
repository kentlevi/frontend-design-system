<script setup lang="ts">
import type { AddressMap, AddressType } from '~/types/address';

type CardProps = {
	item: AddressMap[AddressType];
	index: number;
};

const props = defineProps<CardProps>()

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
		:data-testid="`account-address-book-item-${props.item.type}-${props.index}`"
	>
		<header class="account-address-book-card-header">
			<div class="account-address-book-card-title-row">
				<h3 class="account-address-book-card-name">{{ props.item.contact_name }}</h3>
				<UiBadge
					v-if="item.is_default"
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
				:data-testid="`account-address-book-item-menu-${props.item.type}-${props.index}-button`"
			>
				<UiIcon name="regular-ellipsis-horizontal" :size="24" />
			</UiButton>
		</header>
		<div class="account-address-book-card-body">
			<div class="account-address-book-card-footer">
				<div class="account-address-book-card-copy">
					<p v-if="props.item.type === 'shipping' && props.item.phone_number" class="account-address-book-card-phone">
						{{ props.item.phone_number }}
					</p>
					<div style="display: flex; gap: 4px;">
						<p v-if="props.item.type !== 'drop'" class="account-address-book-card-address">{{ props.item.address_line_1 }}</p>
						<p v-if="props.item.type !== 'drop'" class="account-address-book-card-address">{{ props.item.address_line_2 }}</p>
						<p
							v-for="(dynamic_field, y_index) in props.item.dynamic_fields"
							:key="y_index"
							class="account-address-book-card-address"
						>
							{{ dynamic_field.value }}
						</p>
						<span v-if="props.item.type !== 'drop'" class="account-address-book-card-company">{{ props.item.postcode}}</span>
					</div>

					<span class="account-address-book-card-company">{{ props.item.company }}</span>
				</div>
				<UiBadge
					v-if="props.item.label"
					variant="tonal"
					tone="default"
					size="md"
					:bg-color="tagBadgeColors[props.item.label.toLowerCase() as keyof typeof tagBadgeColors]?.bgColor || 'var(--gray-10)'"
					:text-color="tagBadgeColors[props.item.label.toLowerCase() as keyof typeof tagBadgeColors]?.textColor || 'var(--gray-60)'"
				>
					{{ t(`account.addressBook.tags.${props.item.label}`) }}
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