<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatProductFileSize, readProductArtworkAsDataUrl } from '~/helpers/products/productCategory.helper';
import type { CartRow } from '~/composables/cart/page/useCartPage';

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

const fileInputRef = ref<HTMLInputElement | null>(null);
const localArtworkName = ref('');
const localArtworkSizeLabel = ref('');
const localArtworkPreviewUrl = ref('');
const localSpecialInstructions = ref('');
const { t } = useI18n();

const fileExtensionLabel = computed(() => {
	const parts = localArtworkName.value.split('.');
	const extension = parts.length > 1 ? parts.at(-1)?.toLowerCase() : '';
	return extension ? `.${extension}` : '';
});

const fileMetaLabel = computed(() => {
	const parts = [fileExtensionLabel.value, localArtworkSizeLabel.value].filter(Boolean);
	return parts.join(' | ');
});

const artworkActionLabel = computed(() => (
	localArtworkPreviewUrl.value || localArtworkName.value
		? t('cart.uploadArtwork.replaceImage')
		: t('cart.cartPage.itemDetails.uploadImage')
));

watch(
	() => [props.modelValue, props.item] as const,
	([isOpen, item]) => {
		if (!isOpen || !item) return;
		localArtworkName.value = item.artworkName || '';
		localArtworkSizeLabel.value = item.artworkSizeLabel || '';
		localArtworkPreviewUrl.value = item.artworkPreviewUrl || '';
		localSpecialInstructions.value = item.specialInstructions || '';
	},
	{ immediate: true }
);

function closeModal() {
	emit('update:modelValue', false);
	emit('cancel');
}

function openFilePicker() {
	fileInputRef.value?.click();
}

function removeArtwork() {
	localArtworkName.value = '';
	localArtworkSizeLabel.value = '';
	localArtworkPreviewUrl.value = '';
	if (fileInputRef.value) {
		fileInputRef.value.value = '';
	}
}

async function onFileSelected(event: Event) {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (!file) return;

	localArtworkName.value = file.name;
	localArtworkSizeLabel.value = formatProductFileSize(file.size);
	localArtworkPreviewUrl.value = file.type.startsWith('image/')
		? await readProductArtworkAsDataUrl(file)
		: '';
}

function submitChanges() {
	emit('save', {
		artworkName: localArtworkName.value,
		artworkSizeLabel: localArtworkSizeLabel.value,
		artworkPreviewUrl: localArtworkPreviewUrl.value,
		specialInstructions: localSpecialInstructions.value.trim(),
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
		<section v-if="props.item" class="cart-item-details-modal" data-testid="cart-item-details-modal">
			<input
				ref="fileInputRef"
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
								:src="localArtworkPreviewUrl || props.item.product.image"
								:alt="localArtworkName || props.item.product.name"
								class="cart-item-details-thumb-image"
							>
						</div>
						<div class="cart-item-details-file-copy">
							<p class="cart-item-details-file-name">
								{{ localArtworkName || props.item.product.name }}
							</p>
							<p class="cart-item-details-file-meta">
								{{ fileMetaLabel || t('cart.cartPage.itemDetails.noArtworkFile') }}
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
							{{ artworkActionLabel }}
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
						:model-value="localSpecialInstructions"
						:rows="4"
						resize="none"
						field-class="cart-item-details-textarea-field"
						:placeholder="t('cart.uploadArtwork.specialInstructionsPlaceholder')"
						@update:model-value="localSpecialInstructions = $event"
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

<style scoped lang="scss">
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

	.cart-item-details-replace-btn, .cart-item-details-delete-btn {
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

:global(.cart-item-details-modal-shell) {
	border-radius: 16px;
	overflow: hidden;
	max-width: 760px;
}

:global(.cart-item-details-modal-shell .ui-modal-header) {
	padding: 18px 24px;
	min-height: 62px;
	border-bottom: 1px solid var(--gray-30);
	align-items: center;
}

:global(.cart-item-details-modal-shell .ui-modal-title) {
	font-size: var(--type-size-300);
	line-height: var(--type-line-300);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

:global(.cart-item-details-modal-shell .ui-modal-header-actions) {
	align-items: center;
}

:global(.cart-item-details-modal-shell .ui-modal-close) {
	width: 24px;
	height: 24px;
	min-width: 24px;
	border-radius: 0;
	padding: 0;
}

:global(.cart-item-details-modal-shell .ui-modal-body) {
	padding: 0;
}
</style>