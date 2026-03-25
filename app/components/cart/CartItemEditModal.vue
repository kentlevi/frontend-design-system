<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { CartPreviewItem } from '~/types/cart/preview';

type SelectOption = {
	label: string;
	value: string | number;
}

const props = withDefaults(defineProps<{
	modelValue: boolean;
	item?: CartPreviewItem | null;
	sizeOptions?: SelectOption[];
	quantityOptions?: SelectOption[];
	showQuantity?: boolean;
	sizeKey?: string;
	customSizeWidth?: string;
	customSizeHeight?: string;
	qty?: number;
	customQty?: string;
}>(), {
	item: null,
	sizeOptions: () => [],
	quantityOptions: () => [],
	showQuantity: true,
	sizeKey: '',
	customSizeWidth: '',
	customSizeHeight: '',
	qty: 0,
	customQty: '',
});

const emit = defineEmits<{
	'update:modelValue': [value: boolean];
	'update:sizeKey': [value: string];
	'update:customSizeWidth': [value: string];
	'update:customSizeHeight': [value: string];
	'update:qty': [value: number];
	'update:customQty': [value: string];
	save: [];
	cancel: [];
}>();

const { t } = useI18n();
const digits_only = (value: string | number | null | undefined) => String(value ?? '').replace(/[^0-9]/g, '');
const size_dropdown_ref = ref<HTMLElement | null>(null);
const qty_dropdown_ref = ref<HTMLElement | null>(null);
const custom_width_input_ref = ref<HTMLInputElement | null>(null);
const size_menu_open = ref(false);
const qty_menu_open = ref(false);

const current_size_option = computed(() =>
	props.sizeOptions.find((option) => String(option.value) === props.sizeKey) ?? null
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
	props.sizeKey === 'custom' ? digits_only(props.customSizeWidth) : parsed_size_from_option.value.width
);

const display_height = computed(() =>
	props.sizeKey === 'custom' ? digits_only(props.customSizeHeight) : parsed_size_from_option.value.height
);

const display_qty = computed(() =>
	props.qty === -1 ? digits_only(props.customQty) : (props.qty > 0 ? String(props.qty) : '')
);

const is_update_disabled = computed(() => {
	if (!props.sizeKey) return true;

	const is_custom_size = props.sizeKey === 'custom';
	const custom_width = Number(props.customSizeWidth);
	const custom_height = Number(props.customSizeHeight);
	const custom_qty = Number(props.customQty);

	if (is_custom_size) {
		if (!Number.isFinite(custom_width) || custom_width <= 0) return true;
		if (!Number.isFinite(custom_height) || custom_height <= 0) return true;
	}

	if (!props.showQuantity) {
		return false;
	}

	if (props.qty === -1) {
		if (!Number.isFinite(custom_qty) || custom_qty <= 0) return true;
	}

	return !Number.isFinite(props.qty) || props.qty === 0;
});

function closeMenus() {
	size_menu_open.value = false;
	qty_menu_open.value = false;
}

function toggleSizeMenu() {
	size_menu_open.value = !size_menu_open.value;
	if (size_menu_open.value) qty_menu_open.value = false;
}

function toggleQtyMenu() {
	qty_menu_open.value = !qty_menu_open.value;
	if (qty_menu_open.value) size_menu_open.value = false;
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
	emit('update:sizeKey', normalized_value);
	if (normalized_value === 'custom') {
		emit('update:customSizeWidth', '');
		emit('update:customSizeHeight', '');
		closeMenus();
		nextTick(() => {
			custom_width_input_ref.value?.focus();
		});
		return;
	}

	const selected_option = props.sizeOptions.find((item) => String(item.value) === normalized_value);
	const matched = selected_option?.label.match(/(\d+)\D+(\d+)/i);
	emit('update:customSizeWidth', matched?.[1] ?? '');
	emit('update:customSizeHeight', matched?.[2] ?? '');
	closeMenus();
}

function onQtyOptionSelect(value: string | number) {
	const normalized_value = Number(value);
	emit('update:qty', normalized_value);
	if (normalized_value !== -1) {
		emit('update:customQty', '');
	}
	closeMenus();
}

function onCustomWidthInput(value: string) {
	emit('update:sizeKey', 'custom');
	emit('update:customSizeWidth', value.replace(/[^0-9]/g, ''));
}

function onCustomHeightInput(value: string) {
	emit('update:sizeKey', 'custom');
	emit('update:customSizeHeight', value.replace(/[^0-9]/g, ''));
}

function onCustomQtyInput(value: string) {
	emit('update:qty', -1);
	emit('update:customQty', value.replace(/[^0-9]/g, ''));
}

function closeModal() {
	closeMenus();
	emit('update:modelValue', false);
	emit('cancel');
}

function saveChanges() {
	emit('save');
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
	() => [props.modelValue, props.sizeKey] as const,
	([is_open, size_key]) => {
		if (!is_open || size_key !== 'custom') return;
		nextTick(() => {
			custom_width_input_ref.value?.focus();
		});
	},
	{ immediate: true }
);
</script>

<template>
	<UiModal
		:model-value="modelValue"
		align="center"
		width="640px"
		padding="0"
		gap="0"
		modal-class="cart-item-edit-modal-shell"
		:title="showQuantity ? t('cart.cartPreview.editModal.title') : t('cart.cartPreview.editModal.sizeOnlyTitle')"
		@update:model-value="emit('update:modelValue', $event)"
		@close="emit('cancel')"
	>
		<section v-if="item" class="cart-item-edit-modal" data-testid="cart-item-edit-modal">
			<div class="cart-item-edit-modal-body">
				<div class="cart-item-edit-modal-thumb">
					<img
						:src="item.artworkPreviewUrl || item.product.image"
						:alt="item.artworkName || item.product.name"
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
							v-if="sizeKey !== 'custom'"
							:model-value="sizeKey"
							size="40"
							class="cart-item-edit-select"
							trigger-class="cart-item-edit-select-trigger"
							:options="sizeOptions"
							data-testid="cart-item-edit-size-select"
							@update:model-value="onSizeOptionSelect($event)"
						/>
						<div
							v-else
							ref="size_dropdown_ref"
							class="cart-item-edit-select-shell ui-select"
							:data-open="size_menu_open || null"
							data-testid="cart-item-edit-size-select"
						>
							<div class="cart-item-edit-size-combo">
								<input
									ref="custom_width_input_ref"
									:value="display_width"
									type="text"
									inputmode="numeric"
									pattern="[0-9]*"
									:placeholder="t('cart.cartPreview.editModal.widthPlaceholder')"
									class="cart-item-edit-inline-input"
									data-testid="cart-item-edit-custom-width"
									@beforeinput="preventNonDigitInput"
									@input="onCustomWidthInput(($event.target as HTMLInputElement).value)"
								>
								<span class="cart-item-edit-multiply">x</span>
								<input
									:value="display_height"
									type="text"
									inputmode="numeric"
									pattern="[0-9]*"
									:placeholder="t('cart.cartPreview.editModal.heightPlaceholder')"
									class="cart-item-edit-inline-input"
									data-testid="cart-item-edit-custom-height"
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
											v-for="option in sizeOptions"
											:key="option.value"
											type="button"
											class="ui-select-option"
											:class="{ 'is-selected': String(option.value) === sizeKey }"
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

					<div v-if="showQuantity" class="cart-item-edit-field">
						<label class="cart-item-edit-label">{{ t('cart.cartPreview.quantity') }}</label>
						<UiSelect
							v-if="qty !== -1"
							:model-value="qty"
							size="40"
							class="cart-item-edit-select"
							trigger-class="cart-item-edit-select-trigger"
							:options="quantityOptions"
							data-testid="cart-item-edit-qty-select"
							@update:model-value="onQtyOptionSelect($event)"
						/>
						<div
							v-else
							ref="qty_dropdown_ref"
							class="cart-item-edit-select-shell ui-select"
							:data-open="qty_menu_open || null"
							data-testid="cart-item-edit-qty-select"
						>
							<input
								:value="display_qty"
								type="text"
								inputmode="numeric"
								pattern="[0-9]*"
								placeholder="Enter quantity"
								class="cart-item-edit-inline-input cart-item-edit-inline-input--qty"
								data-testid="cart-item-edit-custom-qty"
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
											v-for="option in quantityOptions"
											:key="option.value"
											type="button"
											class="ui-select-option"
											:class="{ 'is-selected': Number(option.value) === qty }"
											@mousedown.prevent="onQtyOptionSelect(option.value)"
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

			<div class="cart-item-edit-modal-actions">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					class="cart-item-edit-cancel"
					data-testid="cart-item-edit-cancel"
					@click="closeModal"
				>
					{{ t('cart.cartPreview.editModal.cancel') }}
				</UiButton>
				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					class="cart-item-edit-update"
					data-testid="cart-item-edit-update"
					:disabled="is_update_disabled"
					@click="saveChanges"
				>
					{{ t('cart.cartPreview.editModal.update') }}
				</UiButton>
			</div>
		</section>
	</UiModal>
</template>

<style lang="scss">
.cart-item-edit-modal-shell {
	border-radius: 18px;
	box-shadow: 0 18px 48px rgba(12, 19, 35, 0.22);

	.ui-modal-header {
		padding: 12px 24px;
		border-bottom: 1px solid var(--gray-30);
		align-items: center;
	}

	.ui-modal-title {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		color: var(--text-primary);
	}

	.ui-modal-body {
		padding: 0;
	}
}

.cart-item-edit-modal {
	padding: 24px;
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
		height: 100%;
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

	.cart-item-edit-size-unit {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
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

	.cart-item-edit-inline-input--qty {
		padding-right: 10px;
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

		.cart-item-edit-modal-actions {
			justify-content: stretch;
		}

		.cart-item-edit-cancel,
		.cart-item-edit-update {
			flex: 1;
		}
	}
}
</style>