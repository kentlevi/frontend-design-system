<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import type { AddressMap, AddressType } from '~/types/user-address';
import { address_book_tag_badge_colors } from '~/composables/account/addressBook/addressBookPresentation';
import { useAddressBookCardUI } from '~/composables/account/addressBook/useAddressBookCardUI';

type CardProps = {
	item?: AddressMap[AddressType];
	index?: number;
	loading?: boolean;
};

const props = defineProps<CardProps>()

const {
	translate,

	shipping_phone_number,
	address_line_text,
	is_menu_open,
	active_menu_action,
	menu_actions,

	setMenuWrapRef,
	toggleMenu,
	handleMenuAction,
	getAddressLabel,
} = useAddressBookCardUI(props)
</script>

<template>
	<MuCard
		padding="none"
		bordered="default"
		class="account-address-book-card"
		:data-testid="props.loading ? undefined : `account-address-book-item-${props.item?.type}-${props.index}`"
	>
		<MuLinearWrapper
			class="account-address-book-card-header"
			justify="space-between"
			align="center"
			:gap="12"
		>
			<template v-if="props.loading">
				<UiSkeleton width="120px" height="24px" />
				<UiSkeleton width="40px" height="40px" border-radius="var(--radius-xl)" />
			</template>
			<template v-else>
				<MuLinearWrapper
					class="account-address-book-card-title-row"
					align="center"
					:gap="12"
				>
					<MuHeading variant="6" weight="semi-bold" class="account-address-book-card-name">
						{{ props.item?.contact_name }}
					</MuHeading>
					<UiBadge
						v-if="props.item?.is_default && props.item.type === 'shipping'"
						variant="outline"
						tone="default"
						size="md"
						class="account-address-book-card-default-badge"
						text-color="var(--gray-80)"
					>
						<UiIcon name="strong-ship" :size="18" />
						<span class="account-address-book-card-default-badge-copy">{{ translate('account.addressBook.defaultBadgeShipping') }}</span>
					</UiBadge>
					<UiBadge
						v-else-if="props.item?.is_default && props.item?.type === 'billing'"
						variant="outline"
						tone="default"
						size="md"
						class="account-address-book-card-default-badge"
						text-color="var(--gray-80)"
					>
						<UiIcon name="strong-file-dollar" :size="18" />
						<span class="account-address-book-card-default-badge-copy">{{ translate('account.addressBook.defaultBadgeBilling') }}</span>
					</UiBadge>
					<UiBadge
						v-else-if="props.item?.is_default && props.item?.type === 'drop'"
						variant="outline"
						tone="default"
						size="md"
						class="account-address-book-card-default-badge"
						text-color="var(--gray-80)"
					>
						<UiIcon name="strong-box-full" :size="18" />
						<span class="account-address-book-card-default-badge-copy">{{ translate('account.addressBook.defaultBadgeDrop') }}</span>
					</UiBadge>
					<UiBadge
						v-else-if="props.item?.is_default"
						variant="outline"
						tone="default"
						size="md"
					>
						{{ translate('account.addressBook.default') }}
					</UiBadge>
				</MuLinearWrapper>
				<div
					:ref="setMenuWrapRef"
					class="account-address-book-menu-wrap"
				>
					<UiButton
						variant="ghost"
						tone="neutral"
						height="40px"
						width="40px"
						:no-hover="true"
						:class="[
							'account-address-book-menu-button',
							{ 'account-address-book-menu-button--active': is_menu_open }
						]"
						:data-testid="`account-address-book-item-menu-${props.item?.type}-${props.index}-button`"
						@click="toggleMenu"
					>
						<UiIcon name="regular-ellipsis-horizontal" :size="24" />
					</UiButton>

					<transition name="account-address-book-menu">
						<MuCard
							v-if="is_menu_open"
							padding="none"
							class="account-address-book-menu-dropdown"
							:data-testid="`account-address-book-item-menu-${props.item?.type}-${props.index}`"
						>
							<button
								v-for="action in menu_actions"
								:key="action.key"
								type="button"
								class="account-address-book-menu-item"
								:class="{
									'account-address-book-menu-item--danger': action.tone === 'danger',
									'account-address-book-menu-item--active': active_menu_action === action.key,
								}"
								:data-testid="`account-address-book-item-menu-${props.item?.type}-${props.index}-${action.key}`"
								@click="handleMenuAction(action.key)"
							>
								{{ action.label }}
							</button>
						</MuCard>
					</transition>
				</div>
			</template>
		</MuLinearWrapper>
		<MuLinearWrapper
			class="account-address-book-card-body"
			justify="space-between"
			align="center"
			:gap="24"
		>
			<template v-if="props.loading">
				<MuLinearWrapper
					class="account-address-book-card-copy account-address-book-card-copy--skeleton"
					direction="column"
					:gap="4"
				>
					<UiSkeleton width="140px" height="20px" />
					<UiSkeleton width="100%" height="20px" />
					<UiSkeleton width="80px" height="20px" />
				</MuLinearWrapper>
				<UiSkeleton
					width="64px"
					height="32px"
					border-radius="16px"
					class="account-address-book-card-badge-skeleton"
				/>
			</template>
			<template v-else>
				<MuLinearWrapper
					v-if="shipping_phone_number || address_line_text || props.item?.company"
					class="account-address-book-card-copy"
					direction="column"
				>
					<MuText v-if="shipping_phone_number" weight="semi-bold" color="text-primary">
						{{ shipping_phone_number }}
					</MuText>
					<MuText v-if="address_line_text" color="text-secondary">
						{{ address_line_text }}
					</MuText>
					<MuText v-if="props.item?.company" variant="span" color="text-secondary">
						{{ props.item.company }}
					</MuText>
				</MuLinearWrapper>
				<UiBadge
					v-if="props.item?.label"
					variant="tonal"
					tone="default"
					size="md"
					:bg-color="address_book_tag_badge_colors[props?.item.label.toLowerCase() as keyof typeof address_book_tag_badge_colors]?.bgColor || 'var(--gray-10)'"
					:text-color="address_book_tag_badge_colors[props?.item.label.toLowerCase() as keyof typeof address_book_tag_badge_colors]?.textColor || 'var(--gray-60)'"
				>
					{{ getAddressLabel(props.item.label) }}
				</UiBadge>
			</template>
		</MuLinearWrapper>
	</MuCard>
</template>

<style scoped lang="scss">
.account-address-book-card {
	.account-address-book-card-header {
		padding: 12px 24px;
		border-bottom: 1px solid var(--border-subtle, var(--border-default));

		.account-address-book-card-title-row {
			min-width: 0;

			.account-address-book-card-name {
				font-size: var(--type-size-200);
				line-height: var(--type-line-200);
			}

			.account-address-book-card-default-badge {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				flex-shrink: 0;
			}
		}

		.account-address-book-menu-wrap {
			position: relative;
			flex-shrink: 0;

			.account-address-book-menu-button {
				color: var(--text-primary);
				flex-shrink: 0;
				padding: 0;

				&.account-address-book-menu-button--active {
					background-color: var(--gray-40) !important;
				}
			}

			.account-address-book-menu-dropdown {
				position: absolute;
				top: calc(100% + 8px);
				right: 0;
				z-index: 4;
				min-width: 204px;
				overflow: hidden;

				.account-address-book-menu-item {
					display: block;
					width: 100%;
					padding: 8px 16px;
					border: 0;
					background: transparent;
					color: var(--text-primary);
					font-size: var(--type-size-200);
					font-weight: var(--font-weight-semibold);
					line-height: var(--type-line-200);
					text-align: left;
					cursor: pointer;
					transition: background-color 0.18s ease, color 0.18s ease;

					&:hover,
					&.account-address-book-menu-item--active {
						background: var(--gray-20);
					}

					&.account-address-book-menu-item--danger {
						color: var(--error-60, #ff3838);
					}
				}
			}
		}
	}

	.account-address-book-card-body {
		padding: 20px 24px;

		.account-address-book-card-copy {
			&.account-address-book-card-copy--skeleton {
				flex: 1;
			}
		}

		.account-address-book-card-badge-skeleton {
			flex-shrink: 0;
		}
	}
}

.account-address-book-menu-enter-active,
.account-address-book-menu-leave-active {
	transition: opacity 0.16s ease, transform 0.16s ease;
}

.account-address-book-menu-enter-from,
.account-address-book-menu-leave-to {
	opacity: 0;
	transform: translateY(-6px);
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
		.account-address-book-card-header {
			.account-address-book-card-title-row {
				align-items: flex-start !important;
				flex-direction: column !important;
			}
		}

		.account-address-book-card-body {
			align-items: flex-start !important;
			flex-direction: column !important;
		}
	}
}
</style>