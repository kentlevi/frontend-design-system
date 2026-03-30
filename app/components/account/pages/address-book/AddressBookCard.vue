<script setup lang="ts">
import type { AddressMap, AddressType, ShippingAddress } from '~/types/address';

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

/** Check if current item is a shipping address */
const is_shipping = computed(() => {
	return props.item.type === 'shipping'
})

/** Check if current item is a drop address */
const is_drop = computed(() => {
	return props.item.type === 'drop'
})

/** Safely expose shipping phone number only for shipping items */
const shipping_phone_number = computed(() => {
	if (!is_shipping.value) return ''

	return (props.item as ShippingAddress).phone_number ?? ''
})

/** Normalize company name */
const company_name = computed(() => {
	return props.item.company ?? ''
})

/** Build all visible address lines for the template */
const address_lines = computed(() => {
	const lines: string[] = []

	/** Add standard address fields for non-drop items */
	if (!is_drop.value) {
		if ('address_line_1' in props.item && props.item.address_line_1) {
			lines.push(props.item.address_line_1)
		}

		if ('address_line_2' in props.item && props.item.address_line_2) {
			lines.push(props.item.address_line_2)
		}
	}

	/** Add dynamic fields if they exist */
	if ('dynamic_fields' in props.item && Array.isArray(props.item.dynamic_fields)) {
		props.item.dynamic_fields.forEach((dynamic_field) => {
			if (dynamic_field?.value) {
				lines.push(dynamic_field.value)
			}
		})
	}

	/** Add postcode for non-drop items */
	if (!is_drop.value && 'postcode' in props.item && props.item.postcode) {
		lines.push(props.item.postcode)
	}

	return lines
})
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
					v-if="props.item.is_default"
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
					<p v-if="is_shipping && shipping_phone_number" class="account-address-book-card-phone">
						{{ shipping_phone_number }}
					</p>

					<div style="display: flex; gap: 4px;">
						<p
							v-for="(line, y_index) in address_lines"
							:key="y_index"
							class="account-address-book-card-address"
						>
							{{ line }}<span v-if="y_index !== address_lines.length - 1">, </span>
						</p>
					</div>

					<span v-if="company_name" class="account-address-book-card-company">
						{{ company_name }}
					</span>
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