<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useEditItemHandler } from '~/composables/cart/useEditItemHandler';

const { t } = useI18n();
const {
	is_open,
	active_item,
	show_quantity,
	sizes,
	formatImage,
	updateItemSize,
	updateItemQty,
	closeModal: close_edit_modal,
} = useEditItemHandler();
const modal_title = computed(() =>
	!show_quantity.value
		? t('cart.cartPreview.editModal.sizeOnlyTitle')
		: t('cart.cartPreview.editModal.title')
);
const active_item_product_name = computed(() => {
	const product_id = active_item.value?.product.id;
	return product_id ? t(`product.items.${product_id}.name`) : '';
});

const digits_only = (value: string | number | null | undefined) => String(value ?? '').replace(/[^0-9]/g, '');
const size_dropdown_ref = ref<HTMLElement | null>(null);
const qty_dropdown_ref = ref<HTMLElement | null>(null);
const custom_width_input_ref = ref<HTMLInputElement | null>(null);
const custom_qty_input_ref = ref<HTMLInputElement | null>(null);

const size_menu_open = ref(false);
const qty_menu_open = ref(false);

const size_key = ref<string | number>('');
const custom_size_width = ref<string>('');
const custom_size_height = ref<string>('');
const qty = ref<number>(10);
const custom_qty = ref<string>('');

const qty_options = [
	{ label: '10', value: 10 },
	{ label: '25', value: 25 },
	{ label: '50', value: 50 },
	{ label: '100', value: 100 },
	{ label: t('cart.cartPreview.editModal.customQuantity'), value: -1 },
];

// Initialize draft state from active_item
watch(active_item, (item) => {
	if (!item) return;

	const found_preset = sizes.value.find(s => {
		const label = String(s.label);
		return label.includes(`${item.width}x${item.height}mm`) || label.includes(`${item.width}x${item.height}"`);
	});

	size_key.value = found_preset ? found_preset.value : 'custom';
	custom_size_width.value = String(item.width || '');
	custom_size_height.value = String(item.height || '');

	const common_qtys = [10, 25, 50, 100];
	if (common_qtys.includes(item.quantity)) {
		qty.value = item.quantity;
	} else {
		qty.value = -1;
		custom_qty.value = String(item.quantity);
	}
}, { immediate: true });

// Sizing logic
const current_size_option = computed(() =>
	sizes.value.find((option) => String(option.value) === String(size_key.value)) ?? null
);

const parsed_size_from_option = computed(() => {
	const label_text = current_size_option.value?.label ?? '';
	const matched = label_text.match(/(\d+)\D+(\d+)/);
	return {
		width: matched?.[1] ?? '',
		height: matched?.[2] ?? '',
	};
});

const display_width = computed(() =>
	size_key.value === 'custom' ? digits_only(custom_size_width.value) : parsed_size_from_option.value.width
);

const display_height = computed(() =>
	size_key.value === 'custom' ? digits_only(custom_size_height.value) : parsed_size_from_option.value.height
);

const is_update_disabled = computed(() => {
	if (!size_key.value) return true;

	const is_custom_size = size_key.value === 'custom';
	const cw = Number(custom_size_width.value);
	const ch = Number(custom_size_height.value);

	if (is_custom_size) {
		if (!Number.isFinite(cw) || cw <= 0) return true;
		if (!Number.isFinite(ch) || ch <= 0) return true;
	}

	if (!show_quantity.value) return false;

	if (qty.value === -1) {
		const cq = Number(custom_qty.value);
		if (!Number.isFinite(cq) || cq <= 0) return true;
	}

	return false;
});

// Menu handlers
function closeMenus() {
	size_menu_open.value = false;
	qty_menu_open.value = false;
}

function toggleSizeMenu() {
	qty_menu_open.value = false;
	size_menu_open.value = !size_menu_open.value;
}

function toggleQtyMenu() {
	size_menu_open.value = false;
	qty_menu_open.value = !qty_menu_open.value;
}

function handlePointerDown(event: PointerEvent) {
	const target_node = event.target as Node | null;
	if (!target_node) return;
	if (size_dropdown_ref.value?.contains(target_node) || qty_dropdown_ref.value?.contains(target_node)) return;
	closeMenus();
}

function handleEscape(event: KeyboardEvent) {
	if (event.key === 'Escape') closeMenus();
}

function preventNonDigitInput(event: InputEvent) {
	if (!event.data) return;
	if (/^\d+$/.test(event.data)) return;
	event.preventDefault();
}

function onSizeOptionSelect(value: string | number) {
	const normalized_value = String(value);
	size_key.value = normalized_value;
	if (normalized_value === 'custom') {
		closeMenus();
		nextTick(() => {
			custom_width_input_ref.value?.focus();
		});
		return;
	}

	updateSelectedSize(normalized_value)

	const selected_option = sizes.value.find((item) => String(item.value) === normalized_value);
	const matched = selected_option?.label.match(/(\d+)\D+(\d+)/i);
	custom_size_width.value = matched?.[1] ?? '';
	custom_size_height.value = matched?.[2] ?? '';
	closeMenus();
}

function onQtyOptionSelect(value: number) {
	qty.value = value;
	if (value === -1) {
		closeMenus();
		nextTick(() => {
			custom_qty_input_ref.value?.focus();
		});
		return;
	}
	closeMenus();
}

function onCustomWidthInput(value: string) {
	size_key.value = 'custom';
	custom_size_width.value = value.replace(/[^0-9]/g, '');
}

function onCustomHeightInput(value: string) {
	size_key.value = 'custom';
	custom_size_height.value = value.replace(/[^0-9]/g, '');
}

function onCustomQtyInput(value: string) {
	qty.value = -1;
	custom_qty.value = value.replace(/[^0-9]/g, '');
}

function saveChanges() {
	if (!active_item.value) return;
	const final_width = size_key.value === 'custom' ? Number(custom_size_width.value) : Number(parsed_size_from_option.value.width);
	const final_height = size_key.value === 'custom' ? Number(custom_size_height.value) : Number(parsed_size_from_option.value.height);
	const final_qty = qty.value === -1 ? Number(custom_qty.value) : qty.value;

	updateItemSize(active_item.value.id, final_width, final_height);
	updateItemQty(active_item.value.id, final_qty);

	closeModal();
}

const closeModal = () => {
	closeMenus();
	close_edit_modal();
}

onMounted(() => {
	window.addEventListener('pointerdown', handlePointerDown, true);
	window.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
	window.removeEventListener('pointerdown', handlePointerDown, true);
	window.removeEventListener('keydown', handleEscape);
});

watch(
	() => [is_open.value, size_key.value] as const,
	([open, sk]) => {
		if (!open || sk !== 'custom') return;
		nextTick(() => {
			custom_width_input_ref.value?.focus();
		});
	},
	{ immediate: true }
);

watch(
	() => [is_open.value, qty.value] as const,
	([open, q]) => {
		if (!open || q !== -1) return;
		nextTick(() => {
			custom_qty_input_ref.value?.focus();
		});
	},
	{ immediate: true }
);

</script>

<template>
	<UiModal
		:model-value="is_open"
		align="center"
		width="640px"
		modal-class="cart-item-edit-modal-shell"
		:title="modal_title"
		@update:model-value="!$event && closeModal()"
		@close="closeModal"
	>
		<section v-if="active_item" class="cart-item-edit-modal">
			<div class="cart-item-edit-modal-body">
				<div class="cart-item-edit-modal-thumb">
					<img
						:src="formatImage(active_item)"
						:alt="active_item.artwork_file_name ?? active_item_product_name"
						class="cart-item-edit-modal-image"
					>
				</div>

				<div class="cart-item-edit-modal-fields">
					<div class="cart-item-edit-field">
						<div class="cart-item-edit-field-head">
							<label class="cart-item-edit-label">{{ t('cart.cartPreview.size') }}</label>
							<span class="cart-item-edit-unit">(Unit: mm)</span>
						</div>
						<UiSelect
							v-if="size_key !== 'custom'"
							:model-value="size_key"
							size="40"
							class="cart-item-edit-select"
							trigger-class="cart-item-edit-select-trigger"
							:options="sizes"
							@update:model-value="onSizeOptionSelect($event)"
						/>
						<div
							v-else
							ref="size_dropdown_ref"
							class="cart-item-edit-select-shell ui-select"
							:data-open="size_menu_open || null"
						>
							<div class="cart-item-edit-size-combo">
								<input
									ref="custom_width_input_ref"
									:value="display_width"
									type="text"
									inputmode="numeric"
									pattern="[0-9]*"
									placeholder="W"
									class="cart-item-edit-inline-input"
									@beforeinput="preventNonDigitInput"
									@input="onCustomWidthInput(($event.target as HTMLInputElement).value)"
								>
								<span class="cart-item-edit-multiply">x</span>
								<input
									:value="display_height"
									type="text"
									inputmode="numeric"
									pattern="[0-9]*"
									placeholder="H"
									class="cart-item-edit-inline-input"
									@beforeinput="preventNonDigitInput"
									@input="onCustomHeightInput(($event.target as HTMLInputElement).value)"
								>
							</div>
							<button
								type="button"
								class="cart-item-edit-select-arrow"
								aria-label="Open size options"
								@click="toggleSizeMenu"
							>
								<UiIcon
									name="regular-angle-down"
									:size="24"
									color="var(--gray-90)"
									:class="{ 'is-open': size_menu_open }"
								/>
							</button>
							<Transition name="ui-select-menu">
								<div v-if="size_menu_open" class="ui-select-menu" role="listbox">
									<div class="ui-select-options">
										<button
											v-for="option in sizes"
											:key="option.value"
											type="button"
											class="ui-select-option"
											:class="{ 'is-selected': String(option.value) === String(size_key) }"
											@mousedown.prevent="onSizeOptionSelect(option.value)"
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

					<div v-if="show_quantity" class="cart-item-edit-field">
						<label class="cart-item-edit-label">{{ t('cart.cartPreview.quantity') }}</label>
						<UiSelect
							v-if="qty !== -1"
							:model-value="qty"
							size="40"
							class="cart-item-edit-select"
							trigger-class="cart-item-edit-select-trigger"
							:options="qty_options"
							:pin-last-option="true"
							@update:model-value="onQtyOptionSelect(Number($event))"
						/>
						<div
							v-else
							ref="qty_dropdown_ref"
							class="cart-item-edit-select-shell ui-select"
							:data-open="qty_menu_open || null"
						>
							<input
								ref="custom_qty_input_ref"
								:value="custom_qty"
								type="text"
								inputmode="numeric"
								pattern="[0-9]*"
								placeholder="Enter quantity"
								class="cart-item-edit-inline-input cart-item-edit-inline-input--qty"
								@beforeinput="preventNonDigitInput"
								@input="onCustomQtyInput(($event.target as HTMLInputElement).value)"
							>
							<button
								type="button"
								class="cart-item-edit-select-arrow"
								aria-label="Open quantity options"
								@click="toggleQtyMenu"
							>
								<UiIcon
									name="regular-angle-down"
									:size="24"
									color="var(--gray-90)"
									:class="{ 'is-open': qty_menu_open }"
								/>
							</button>
							<Transition name="ui-select-menu">
								<div v-if="qty_menu_open" class="ui-select-menu" role="listbox">
									<div class="ui-select-options">
										<button
											v-for="option in qty_options"
											:key="option.value"
											type="button"
											class="ui-select-option"
											:class="{ 'is-selected': Number(option.value) === qty }"
											@mousedown.prevent="onQtyOptionSelect(Number(option.value))"
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
				</div>
			</div>
		</section>

		<template #footer>
			<div class="cart-item-edit-modal-actions ui-modal-footer-item">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					class="cart-item-edit-cancel"
					@click="closeModal"
				>
					{{ t('cart.cartPreview.editModal.cancel') }}
				</UiButton>
				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					class="cart-item-edit-update"
					:disabled="is_update_disabled"
					@click="saveChanges"
				>
					{{ t('cart.cartPreview.editModal.update') }}
				</UiButton>
			</div>
		</template>
	</UiModal>
</template>

<style lang="scss">
.cart-item-edit-modal-shell {
	border-radius: 18px;
}

.cart-item-edit-modal {
	background: var(--contrast-light);
	border-radius: inherit;
	display: flex;
	flex-direction: column;
	gap: 24px;

	.cart-item-edit-modal-body {
		display: grid;
		grid-template-columns: 152px minmax(0, 1fr);
		align-items: center;
		gap: 28px;
	}

	.cart-item-edit-modal-thumb {
		width: 152px;
		height: 152px;
		border-radius: 10px;
		background: var(--gray-10);
		display: grid;
		place-items: center;
		overflow: hidden;
	}

	.cart-item-edit-modal-image {
		width: 100%;
		height: inherit;
		object-fit: contain;
		padding: 18px;
	}

	.cart-item-edit-modal-fields {
		display: grid;
		gap: 18px;
	}

	.cart-item-edit-field {
		display: grid;
		gap: 8px;
	}

	.cart-item-edit-field-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.cart-item-edit-label {
		font-size: var(--type-size-100);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-100);
		color: var(--text-primary);
	}

	.cart-item-edit-unit {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}

	.cart-item-edit-select {
		width: 100%;

		.cart-item-edit-select-trigger {
			border-radius: 8px;
			padding: 8px 16px;
		}
	}

	.cart-item-edit-multiply {
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
		color: var(--text-secondary);
	}

	.cart-item-edit-select-shell {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		min-height: 40px;
		border-radius: 10px;
		border: 1px solid var(--gray-30);
		background: var(--contrast-light);
		padding: 0 12px;
		color: var(--text-primary);
		box-shadow: none;

		.ui-select-menu {
			top: calc(100% + 8px);
			left: 0;
			right: 0;
		}

		&:hover {
			border: 1px solid var(--gray-50);
			background-color: var(--gray-20);
		}
	}

	.cart-item-edit-size-combo {
		display: flex;
		gap: 24px;
		align-items: center;
		justify-content: center;
	}

	.cart-item-edit-inline-input {
		width: 42px;
		min-width: 0;
		border: 0;
		outline: 0;
		background: transparent;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-primary);

		&::placeholder {
			color: var(--text-secondary);
		}

		&.cart-item-edit-inline-input--qty {
			width: 100%;
		}
	}

	.cart-item-edit-select-arrow {
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

	.cart-item-edit-modal-actions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 16px;
	}

	.cart-item-edit-cancel {
		min-width: 88px;
		color: var(--text-primary);
	}

	.cart-item-edit-update {
		min-width: 96px;
		height: 44px;
		border-radius: 14px;
	}
}

@media (max-width: 720px) {
	.cart-item-edit-modal {
		padding: 20px;

		.cart-item-edit-modal-body {
			grid-template-columns: 1fr;
		}

		.cart-item-edit-modal-thumb {
			width: 112px;
			height: 112px;
		}

		:deep(.ui-modal-footer) {
			padding: 0 20px 20px;
		}
	}
}
</style>