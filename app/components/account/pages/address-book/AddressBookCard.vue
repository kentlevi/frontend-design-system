<script setup lang="ts">
import type { AddressMap, AddressType } from '~/types/address';
import type { ComponentPublicInstance } from 'vue';
import { useAddressHelper } from '~/utils/address';
import { useAddressBookFeatureContext } from '~/composables/account/addressBook/addressBookFeatureContext';

const { buildAddressLines, shippingPhoneNumber } = useAddressHelper()
const address_book_feature_context = useAddressBookFeatureContext()

type MenuActionKey = 'edit' | 'delete' | 'default';

type CardProps = {
	item: AddressMap[AddressType];
	index: number;
};

const props = defineProps<CardProps>()

const { t } = useI18n();
const menu_wrap_ref = ref<HTMLElement | null>(null)
const is_menu_open = ref(false)

const menu_actions = computed(() => {
	return [
		{
			key: 'edit',
			label: t('account.addressBook.editAddress'),
			tone: 'default',
		},
		{
			key: 'delete',
			label: t('account.addressBook.deleteAddress'),
			tone: 'danger',
		},
		{
			key: 'default',
			label: t('account.addressBook.setAsDefault'),
			tone: 'default',
		},
	] as const
})

const tag_badge_colors = {
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

const shipping_phone_number = computed(() => shippingPhoneNumber(props.item))

/** Build all visible address lines for the template */
const address_line_text = computed(() => buildAddressLines(props.item))

function setMenuWrapRef(element: Element | ComponentPublicInstance | null) {
	menu_wrap_ref.value = element instanceof HTMLElement ? element : null
}

function closeMenu() {
	is_menu_open.value = false
}

function toggleMenu() {
	is_menu_open.value = !is_menu_open.value
}

function handleDocumentClick(event: MouseEvent) {
	if (!is_menu_open.value || !menu_wrap_ref.value) return

	const target = event.target

	if (!(target instanceof Node) || menu_wrap_ref.value.contains(target)) return

	closeMenu()
}

function handleWindowKeydown(event: KeyboardEvent) {
	if (event.key !== 'Escape') return

	closeMenu()
}

function handleMenuAction(action: MenuActionKey) {
	closeMenu()
	address_book_feature_context.handleCardMenuAction({
		action,
		item: props.item,
	})
}

onMounted(() => {
	document.addEventListener('click', handleDocumentClick, true)
	window.addEventListener('keydown', handleWindowKeydown)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleDocumentClick, true)
	window.removeEventListener('keydown', handleWindowKeydown)
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
					v-if="props.item.is_default && props.item.type === 'shipping'"
					variant="outline"
					tone="default"
					size="md"
					class="account-address-book-card-default-badge"
					text-color="var(--gray-80)"
				>
					<UiIcon name="strong-ship" :size="18" />
					<span class="account-address-book-card-default-badge-copy">Default Shipping</span>
				</UiBadge>
				<UiBadge
					v-else-if="props.item.is_default && props.item.type === 'billing'"
					variant="outline"
					tone="default"
					size="md"
					class="account-address-book-card-default-badge"
					text-color="var(--gray-80)"
				>
					<UiIcon name="strong-file-dollar" :size="18" />
					<span class="account-address-book-card-default-badge-copy">Default Billing</span>
				</UiBadge>
				<UiBadge
					v-else-if="props.item.is_default && props.item.type === 'drop'"
					variant="outline"
					tone="default"
					size="md"
					class="account-address-book-card-default-badge"
					text-color="var(--gray-80)"
				>
					<UiIcon name="strong-box-full" :size="18" />
					<span class="account-address-book-card-default-badge-copy">Default Drop Shipping</span>
				</UiBadge>
				<UiBadge
					v-else-if="props.item.is_default"
					variant="outline"
					tone="default"
					size="md"
				>
					{{ t('account.addressBook.default') }}
				</UiBadge>
			</div>
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
					class="account-address-book-menu-button"
					:data-testid="`account-address-book-item-menu-${props.item.type}-${props.index}-button`"
					@click="toggleMenu"
				>
					<UiIcon name="regular-ellipsis-horizontal" :size="24" />
				</UiButton>

				<transition name="account-address-book-menu">
					<div
						v-if="is_menu_open"
						class="account-address-book-menu-dropdown"
						:data-testid="`account-address-book-item-menu-${props.item.type}-${props.index}`"
					>
						<button
							v-for="action in menu_actions"
							:key="action.key"
							type="button"
							class="account-address-book-menu-item"
							:class="{
								'account-address-book-menu-item--danger': action.tone === 'danger',
							}"
							:data-testid="`account-address-book-item-menu-${props.item.type}-${props.index}-${action.key}`"
							@click="handleMenuAction(action.key)"
						>
							{{ action.label }}
						</button>
					</div>
				</transition>
			</div>
		</header>
		<div class="account-address-book-card-body">
			<div class="account-address-book-card-footer">
				<div class="account-address-book-card-copy">
					<p v-if="shipping_phone_number" class="account-address-book-card-phone">
						{{ shipping_phone_number }}
					</p>

					<div style="display: flex; gap: 4px;">
						<p
							class="account-address-book-card-address"
						>
							{{ address_line_text }}
						</p>
					</div>

					<span v-if="props.item.company" class="account-address-book-card-company">
						{{ props.item.company }}
					</span>
				</div>
				<UiBadge
					v-if="props.item.label"
					variant="tonal"
					tone="default"
					size="md"
					:bg-color="tag_badge_colors[props.item.label.toLowerCase() as keyof typeof tag_badge_colors]?.bgColor || 'var(--gray-10)'"
					:text-color="tag_badge_colors[props.item.label.toLowerCase() as keyof typeof tag_badge_colors]?.textColor || 'var(--gray-60)'"
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
	transition: border-color 0.18s ease, box-shadow 0.18s ease;

	.account-address-book-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 24px;
		border-bottom: 1px solid var(--border-subtle, var(--border-default));

		.account-address-book-card-title-row {
			display: flex;
			align-items: center;
			gap: 12px;
			min-width: 0;

			.account-address-book-card-name {
				font-size: var(--type-size-200);
				font-weight: var(--font-weight-semibold);
				line-height: var(--type-line-200);
			}

			.account-address-book-card-default-badge {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				flex-shrink: 0;

				.account-address-book-card-default-badge-copy {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-semibold);
				}
			}
		}

		.account-address-book-menu-wrap {
			position: relative;
			flex-shrink: 0;

			.account-address-book-menu-button {
				color: var(--text-primary);
				flex-shrink: 0;
				padding: 0;
			}

			.account-address-book-menu-dropdown {
				position: absolute;
				top: calc(100% + 8px);
				right: 0;
				z-index: 4;
				min-width: 204px;
				display: flex;
				flex-direction: column;
				border: 1px solid var(--gray-60);
				border-radius: 12px;
				background: var(--contrast-light);
				box-shadow: var(--shadow-md);
				overflow: hidden;

				.account-address-book-menu-item {
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

					&:hover {
						background: var(--gray-10);
					}

					&.account-address-book-menu-item--danger {
						color: var(--error-60, #ff3838);

						&:hover {
							background: color-mix(in srgb, var(--error-10, #fff0f0) 100%, transparent);
						}
					}
				}
			}
		}
	}

	.account-address-book-card-body {
		padding: 20px 24px;

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

			.account-address-book-card-company {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
			}
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
				align-items: flex-start;
				flex-direction: column;
			}
		}

		.account-address-book-card-body {
			.account-address-book-card-footer {
				align-items: flex-start;
				flex-direction: column;
			}
		}
	}
}
</style>