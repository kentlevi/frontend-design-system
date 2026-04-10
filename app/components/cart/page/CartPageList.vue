<script setup lang="ts">
import { useCartPageList } from '~/composables/cart/page/useCartPageList';

const {
	rows,
	selected_ids,
	all_selected,
	custom_qty_item_id,
	custom_qty_draft,
	custom_qty_menu_open,
	qty_select_options,
	sizeDimOnly,
	getArtworkActionLabel,
	formatPrice,
	bindCustomQtyDropdownRef,
	bindCustomQtyInputRef,
	openDeleteModal,
	openEditSize,
	handleQtyOptionSelect,
	commitCustomQty,
	toggleCustomQtyMenu,
	setCustomQtyDraft,
	preventNonDigitInput,
	toggleSelection,
	setAllSelected,
} = useCartPageList();

const emit = defineEmits<{
	(e: 'openItemDetails', itemId: string): void;
	(e: 'openArtworkPicker', itemId: string): void;
}>();
</script>

<template>
	<section class="cart-list" data-testid="cart-page-list">
		<div class="cart-list-controls">
			<UiCheckbox
				class="cart-check-row"
				:model-value="all_selected"
				box-class="cart-check-row-box"
				icon-class="cart-check-row-icon"
				@update:model-value="setAllSelected"
			>
				{{ $t('cart.cartPage.selectAll', { count: rows.length }) }}
			</UiCheckbox>
			<UiButton
				class="cart-remove-btn"
				variant="outline"
				tone="default"
				size="md"
				label-class="cart-remove-btn-label"
				:disabled="selected_ids.length === 0"
				@click="openDeleteModal(selected_ids)"
			>
				<UiIcon name="regular-trash" :size="24" color="var(--text-primary)" />
				{{ $t('cart.cartPage.remove') }}
			</UiButton>
		</div>

		<div class="cart-list-head">
			<span class="cart-list-head-label">{{ $t('cart.cartPage.headers.item') }}</span>
			<span class="cart-list-head-label">{{ $t('cart.cartPage.headers.quantity') }}</span>
			<span class="cart-list-head-label">{{ $t('cart.cartPage.headers.price') }}</span>
			<span class="cart-list-head-spacer" />
		</div>

		<article
			v-for="row in rows"
			:key="row.id"
			class="cart-row"
			data-testid="cart-page-row"
		>
			<UiCheckbox
				class="cart-check-row cart-check-row--item"
				:model-value="selected_ids.includes(row.id)"
				box-class="cart-check-row-box"
				icon-class="cart-check-row-icon"
				@update:model-value="toggleSelection(row.id, $event)"
			/>

			<div class="cart-row-main">
				<div class="cart-item">
					<div class="cart-item-main">
						<button
							type="button"
							class="cart-item-thumb"
							:class="{ 'cart-item-thumb--interactive': Boolean(row.artworkPreviewUrl) }"
							:disabled="!row.artworkPreviewUrl"
							@click="row.artworkPreviewUrl ? emit('openItemDetails', row.id) : undefined"
						>
							<img
								:src="row.artworkPreviewUrl || row.product.image"
								:alt="row.product.name"
								class="cart-item-thumb-image"
							>
							<span
								v-if="row.artworkPreviewUrl"
								class="cart-item-thumb-overlay"
								aria-hidden="true"
							>
								<UiIcon name="regular-info-circle" :size="24" color="#ffffff" />
							</span>
						</button>
						<div class="cart-item-copy">
							<h3 class="cart-item-title">{{ row.product.name }}</h3>
							<p class="cart-item-size">{{ $t('cart.cartPage.sizeLabel', { size: sizeDimOnly(row.sizeLabel) }) }}</p>
							<UiButton class="cart-link-btn" variant="ghost" tone="default" size="24" @click="emit('openArtworkPicker', row.id)">
								{{ getArtworkActionLabel(Boolean(row.artworkPreviewUrl)) }}
							</UiButton>
						</div>
					</div>
					<div class="cart-item-links">
						<UiButton class="cart-link-btn" variant="ghost" tone="default" size="24" @click="openEditSize(row.id)">
							{{ $t('cart.cartPage.editSize') }}
						</UiButton>
					</div>
				</div>

				<div class="cart-qty-wrap">
					<UiSelect
						v-if="custom_qty_item_id !== row.id"
						class="cart-qty-select-control"
						size="40"
						:model-value="row.qty"
						:options="[...qty_select_options, { label: 'Custom', value: -1 }]"
						trigger-class="cart-qty-select-trigger"
						menu-class="cart-qty-menu"
						:pin-last-option="true"
						@update:model-value="handleQtyOptionSelect(row.id, $event)"
					/>
					<div
						v-else
						:ref="bindCustomQtyDropdownRef"
						class="cart-qty-select-shell ui-select"
						:data-open="custom_qty_menu_open || null"
					>
						<input
							:ref="bindCustomQtyInputRef"
							:value="custom_qty_draft"
							type="text"
							inputmode="numeric"
							placeholder="Enter quantity"
							class="cart-qty-inline-input"
							@beforeinput="preventNonDigitInput"
							@input="setCustomQtyDraft(($event.target as HTMLInputElement).value)"
							@blur="commitCustomQty(row.id)"
							@keydown.enter.prevent="commitCustomQty(row.id)"
						>
						<button
							type="button"
							class="cart-qty-select-arrow"
							aria-label="Open quantity options"
							@click="toggleCustomQtyMenu"
						>
							<UiIcon
								name="regular-angle-down"
								:size="24"
								color="var(--gray-90)"
								:class="{ 'is-open': custom_qty_menu_open }"
							/>
						</button>
						<Transition name="ui-select-menu">
							<div v-if="custom_qty_menu_open" class="ui-select-menu cart-qty-menu" role="listbox">
								<div class="ui-select-options">
									<button
										v-for="option in [...qty_select_options, { label: 'Custom', value: -1 }]"
										:key="option.value"
										type="button"
										class="ui-select-option"
										:class="{ 'is-selected': Number(option.value) === -1 }"
										@mousedown.prevent="handleQtyOptionSelect(row.id, option.value)"
									>
										<div class="ui-select-option-copy">
											<p class="ui-select-option-label">{{ option.label }}</p>
										</div>
									</button>
								</div>
							</div>
						</Transition>
					</div>
				</div>

				<strong class="cart-row-price">{{ formatPrice(row.total) }}</strong>
			</div>

			<UiButton
				class="cart-delete-btn"
				variant="ghost"
				tone="default"
				size="sm"
				icon-only
				icon="regular-trash"
				icon-size="24"
				:sr-label="$t('cart.cartPage.removeItemSr')"
				@click="openDeleteModal([row.id])"
			/>
		</article>
	</section>
</template>

<style scoped lang="scss">
.cart-list {
	.cart-list-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18px;

		.cart-check-row {
			display: inline-flex;
			align-items: center;
			gap: 10px;
			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);

			.cart-check-row-box {
				width: 20px;
				height: 20px;
				border-radius: 5px;
				border-color: var(--text-primary);
				background: var(--contrast-light);
			}

			.cart-check-row-icon {
				width: 16px;
				height: 16px;
				display: block;
			}
		}

		.cart-remove-btn {
			min-width: 118px;
			height: 40px;
			border-radius: 16px;
			border: 1px solid var(--gray-50);
			color: var(--abyss-base);
			padding: 8px 24px;
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-medium);
			cursor: pointer;
			transition: background-color 0.16s ease, border-color 0.16s ease, opacity 0.16s ease;

			.cart-remove-btn-label {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
			}

			&:hover:not(:disabled) {
				background: var(--gray-20);
			}

			&:disabled {
				opacity: 0.45;
				cursor: not-allowed;
			}
		}
	}

	.cart-list-head {
		display: grid;
		grid-template-columns: 1fr 176px 118px 40px;
		gap: 14px;
		border-bottom: 1px solid var(--gray-30);
		padding-bottom: 10px;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		font-weight: var(--font-weight-medium);
		line-height: var(--type-line-100);

		.cart-list-head-label,
		.cart-list-head-spacer {
			display: block;
		}
	}

	.cart-item-thumb {
		position: relative;
		width: 124px;
		height: 124px;
		border: 0;
		padding: 0;
		background: var(--gray-10);
		border-radius: 12px;
		overflow: hidden;
		flex-shrink: 0;

		&:disabled {
			cursor: default;
		}

		&.cart-item-thumb--interactive {
			cursor: pointer;

			.cart-item-thumb-overlay {
				opacity: 0;
				transition: opacity 0.18s ease;
			}

			&:hover .cart-item-thumb-overlay,
			&:focus-visible .cart-item-thumb-overlay {
				opacity: 1;
			}
		}

		.cart-item-thumb-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
			display: block;
		}

		.cart-item-thumb-overlay {
			position: absolute;
			inset: 0;
			display: grid;
			place-items: center;
			background: rgba(38, 41, 51, 0.56);
		}
	}

	.cart-row {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr) 40px;
		gap: 14px;
		align-items: center;
		padding: 20px 0;
		border-bottom: 1px solid var(--gray-30);

		.cart-check-row {
			&.cart-check-row--item {
				justify-self: start;
			}
		}

		.cart-row-main {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 176px 118px;
			align-items: center;
			column-gap: 32px;
			min-width: 0;
		}

		.cart-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			min-width: 0;

			.cart-item-main {
				display: flex;
				align-items: center;
				gap: 16px;
				min-width: 0;
			}

			.cart-item-links {
				display: grid;
				justify-items: start;
				gap: 2px;
				flex-shrink: 0;
			}

			.cart-link-btn {
				border: 0;
				background: transparent;
				color: var(--gold-60);
				padding: 0;
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-semibold);
				cursor: pointer;
			}

			.cart-item-thumb {
				width: 96px;
				height: 96px;
				border-radius: 10px;
				background: var(--gray-20);
				display: grid;
				place-items: center;
				overflow: hidden;

				.cart-item-thumb-image {
					width: 72px;
					height: 72px;
					object-fit: contain;
				}
			}

			.cart-item-copy {
				.cart-item-title {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					color: var(--text-primary);
				}

				.cart-item-size {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					color: var(--text-secondary);
				}
			}
		}

		.cart-qty-wrap {
			display: flex;
			align-items: center;
			gap: 32px;

			.cart-qty-select-control {
				width: 176px;
				min-width: 129px;
			}

			:deep(.cart-qty-select-trigger) {
				border-radius: 8px;
				padding: 8px 16px;
			}

			.cart-qty-select-shell {
				position: relative;
				width: 176px;
				min-width: 129px;
				display: grid;
				grid-template-columns: minmax(0, 1fr) auto;
				align-items: center;
				min-height: 40px;
				border-radius: 8px;
				border: 1px solid var(--gray-40);
				background: var(--contrast-light);
				padding: 8px 16px;

				.ui-select-menu {
					top: calc(100% + 8px);
					left: 0;
					right: 0;
				}
			}

			.cart-qty-inline-input {
				width: 100%;
				min-width: 0;
				border: 0;
				outline: 0;
				background: transparent;
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				color: var(--text-primary);

				&::placeholder {
					color: var(--text-muted);
				}
			}

			.cart-qty-select-arrow {
				border: 0;
				outline: 0;
				background: transparent;
				display: grid;
				place-items: center;
				padding: 0;
				cursor: pointer;

				.ui-icon {
					transition: transform 160ms ease;
				}

				.ui-icon.is-open {
					transform: rotate(180deg);
				}
			}

			.cart-qty-menu {
				.ui-select-option.is-selected {
					background: transparent;
				}

				.ui-select-option.is-selected:hover,
				.ui-select-option.is-selected:focus-visible {
					background: var(--surface-subtle);
				}

				.ui-select-option--pinned {
					background: transparent;
				}

				.ui-select-option--pinned:hover,
				.ui-select-option--pinned:focus-visible,
				.ui-select-option--pinned.is-selected:hover,
				.ui-select-option--pinned.is-selected:focus-visible {
					background: var(--surface-subtle);
				}
			}
		}

		.cart-row-price {
			font-size: var(--type-size-300);
			line-height: var(--type-line-300);
			color: var(--text-primary);
			white-space: nowrap;
		}

		.cart-delete-btn {
			color: var(--abyss-base);
			border: 0;
			background: transparent;
			width: 30px;
			height: 30px;
			display: grid;
			place-items: center;
			cursor: pointer;
		}
	}
}

@media (max-width: 1200px) {
	.cart-list {
		.cart-row {
			.cart-row-price {
				font-size: var(--type-size-500);
				line-height: var(--type-line-500);
			}
		}
	}
}

@media (max-width: 980px) {
	.cart-list {
		.cart-row {
			grid-template-columns: 24px 1fr;

			.cart-row-main {
				grid-template-columns: 1fr;
				row-gap: 16px;
			}

			.cart-qty-wrap,
			.cart-row-price,
			.cart-delete-btn {
				grid-column: 2 / 3;
			}

			.cart-row-price {
				margin-top: 6px;
			}
		}
	}
}
</style>