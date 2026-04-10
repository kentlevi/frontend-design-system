<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatProductFileSize, readProductArtworkAsDataUrl } from '~/helpers/products/productCategory.helper';
import type { CartRow } from '~/types/cart/cart';

const props = withDefaults(defineProps<{
	modelValue: boolean;
	item?: CartRow | null;
}>(), {
	item: null,
});

const emit = defineEmits<{
	'update:modelValue': [value: boolean];
	cancel: [];
	save: [payload: { artworkName: string; artworkSizeLabel: string; artworkPreviewUrl: string; specialInstructions: string }];
}>();

const file_input_ref = ref<HTMLInputElement | null>(null);
const local_artwork_name = ref('');
const local_artwork_size_label = ref('');
const local_artwork_preview_url = ref('');
const local_special_instructions = ref('');
const { t } = useI18n();
const display_item_name = computed(() => local_artwork_name.value || props.item?.product.name || '');
const display_item_image = computed(() => local_artwork_preview_url.value || props.item?.product.image || '');

const file_extension_label = computed(() => {
	const name_parts = local_artwork_name.value.split('.');
	const file_extension = name_parts.length > 1 ? name_parts.at(-1)?.toLowerCase() : '';
	return file_extension ? `.${file_extension}` : '';
});

const file_meta_label = computed(() => {
	const meta_parts = [file_extension_label.value, local_artwork_size_label.value].filter(Boolean);
	return meta_parts.join(' | ');
});

const artwork_action_label = computed(() => (
	local_artwork_preview_url.value || local_artwork_name.value
		? t('cart.uploadArtwork.replaceImage')
		: t('cart.cartPage.itemDetails.uploadImage')
));

watch(
	() => [props.modelValue, props.item] as const,
	([is_open, item]) => {
		if (!is_open || !item) return;
		local_artwork_name.value = item.artworkName || '';
		local_artwork_size_label.value = item.artworkSizeLabel || '';
		local_artwork_preview_url.value = item.artworkPreviewUrl || '';
		local_special_instructions.value = item.specialInstructions || '';
	},
	{ immediate: true }
);

function closeModal() {
	emit('update:modelValue', false);
	emit('cancel');
}

function openFilePicker() {
	file_input_ref.value?.click();
}

function removeArtwork() {
	local_artwork_name.value = '';
	local_artwork_size_label.value = '';
	local_artwork_preview_url.value = '';
	if (file_input_ref.value) {
		file_input_ref.value.value = '';
	}
}

async function onFileSelected(event: Event) {
	const input_target = event.target as HTMLInputElement;
	const selected_file = input_target.files?.[0];
	if (!selected_file) return;

	local_artwork_name.value = selected_file.name;
	local_artwork_size_label.value = formatProductFileSize(selected_file.size);
	local_artwork_preview_url.value = selected_file.type.startsWith('image/')
		? await readProductArtworkAsDataUrl(selected_file)
		: '';
}

function submitChanges() {
	emit('save', {
		artworkName: local_artwork_name.value,
		artworkSizeLabel: local_artwork_size_label.value,
		artworkPreviewUrl: local_artwork_preview_url.value,
		specialInstructions: local_special_instructions.value.trim(),
	});
	emit('update:modelValue', false);
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		align="center"
		width="760px"
		padding="0"
		gap="0"
		modal-class="cart-item-details-modal-shell"
		:title="t('cart.cartPage.itemDetails.title')"
		@update:model-value="emit('update:modelValue', $event)"
		@close="emit('cancel')"
	>
		<section class="cart-item-details-modal" data-testid="cart-item-details-modal">
			<input
				ref="file_input_ref"
				type="file"
				class="cart-item-details-file-input"
				accept=".eps,.ai,.psd,.pdf,.tif,.tiff,.png,.jpg,.jpeg"
				@change="onFileSelected"
			>

			<div class="cart-item-details-body">
				<div class="cart-item-details-upload-card">
					<div class="cart-item-details-upload-copy">
						<div class="cart-item-details-thumb">
							<img
								:src="display_item_image"
								:alt="display_item_name"
								class="cart-item-details-thumb-image"
							>
						</div>
						<div class="cart-item-details-file-copy">
							<p class="cart-item-details-file-name">
								{{ display_item_name }}
							</p>
							<p class="cart-item-details-file-meta">
								{{ file_meta_label || t('cart.cartPage.itemDetails.noArtworkFile') }}
							</p>
						</div>
					</div>
					<div class="cart-item-details-upload-actions">
						<UiButton
							type="button"
							variant="outline"
							tone="neutral"
							size="md"
							height="40px"
							class="cart-item-details-replace-btn"
							@click="openFilePicker"
						>
							<UiIcon name="regular-image" :size="20" color="var(--text-primary)" />
							{{ artwork_action_label }}
						</UiButton>
						<UiButton
							type="button"
							variant="outline"
							tone="neutral"
							size="md"
							icon-only
							icon="regular-trash"
							icon-size="24"
							width="40px"
							height="40px"
							class="cart-item-details-delete-btn"
							:sr-label="t('cart.cartPage.itemDetails.removeArtworkSr')"
							@click="removeArtwork"
						/>
					</div>
				</div>

				<div class="cart-item-details-field">
					<label class="cart-item-details-label">{{ t('cart.uploadArtwork.specialInstructions') }}</label>
					<UiTextarea
						:model-value="local_special_instructions"
						:rows="4"
						resize="none"
						field-class="cart-item-details-textarea-field"
						:placeholder="t('cart.uploadArtwork.specialInstructionsPlaceholder')"
						@update:model-value="local_special_instructions = $event"
					/>
				</div>
			</div>

			<footer class="cart-item-details-actions">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="cart-item-details-cancel"
					@click="closeModal"
				>
					{{ t('cart.cartPreview.editModal.cancel') }}
				</UiButton>
				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					size="md"
					class="cart-item-details-submit"
					@click="submitChanges"
				>
					{{ t('cart.cartPage.itemDetails.submit') }}
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>

<style lang="scss">
.cart-item-details-modal {
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	padding: 24px;
	gap: 24px;

	.cart-item-details-file-input {
		display: none;
	}

	.cart-item-details-body {
		display: grid;
		gap: 20px;
	}

	.cart-item-details-upload-card {
		border: 1px dashed var(--gray-40);
		border-radius: 12px;
		padding: 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.cart-item-details-upload-copy {
		display: flex;
		align-items: center;
		gap: 16px;
		min-width: 0;
	}

	.cart-item-details-thumb {
		width: 52px;
		height: 52px;
		border-radius: 10px;
		background: var(--gray-10);
		overflow: hidden;
		flex-shrink: 0;
	}

	.cart-item-details-thumb-image {
		width: 100%;
		height: 100%;
		padding: 8px;
		object-fit: contain;
		display: block;
	}

	.cart-item-details-file-copy {
		min-width: 0;
	}

	.cart-item-details-file-name {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.cart-item-details-file-meta {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}

	.cart-item-details-upload-actions {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.cart-item-details-replace-btn,
	.cart-item-details-delete-btn {
		border-radius: 16px;
		border-color: var(--gray-80);
	}

	.cart-item-details-field {
		display: grid;
		gap: 8px;
	}

	.cart-item-details-label {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.cart-item-details-actions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 18px;
	}

	.cart-item-details-submit {
		min-width: 92px;
		border-radius: 18px;
	}
}

.cart-item-details-modal-shell {
	border-radius: 16px;
	overflow: hidden;
	max-width: 760px;

	.ui-modal-header {
		padding: 18px 24px;
		min-height: 62px;
		border-bottom: 1px solid var(--gray-30);
		align-items: center;
	}

	.ui-modal-title {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.ui-modal-header-actions {
		align-items: center;
	}

	.ui-modal-close {
		width: 24px;
		height: 24px;
		min-width: 24px;
		border-radius: 0;
		padding: 0;
	}

	.ui-modal-body {
		padding: 0;
	}
}
</style>