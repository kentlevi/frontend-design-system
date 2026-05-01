<script setup lang="ts">
import { nextTick } from 'vue';
import { useArtworkSectionHandler } from '~/composables/product-page/useArtworkSectionHandler';
import { useCartService } from '~/services/core/cart/cart.service';

const { t } = useI18n();
const { adding_item, addItem } = useCartService('upload-modal')

const {
	is_modal_open,
	artwork_file_name,
	artwork_file_ext,
	artwork_file_size,
	artwork_preview,
	instruction,
	uploading,
	is_dragging,
	has_uploaded_file,
	handleDrop,
	fileChange,
	unsetFile,
	closeModal,
	openPreview,
	resetForm,
} = useArtworkSectionHandler()

const skipUpload = async () => {
	if( uploading.value || adding_item.value ) {
		console.log(uploading.value, adding_item.value)
		return
	}

	await addItem()

	closeModal()
	await nextTick()
	openPreview()
}

const addToCart = async () => {
	if( uploading.value || adding_item.value ) {
		console.log(uploading.value, adding_item.value)
		return
	}

	const dispatched = await addItem()

	if( dispatched ) {
		closeModal()
		await nextTick()
		openPreview()
	}
}

const artwork_input = ref<HTMLInputElement | null>(null)

const openFilePicker = () => {
	if( uploading.value )
		return

	artwork_input.value?.click();
}

const removeFile = () => {
	if ( uploading.value )
		return

	unsetFile()
	if (artwork_input.value)
		artwork_input.value.value = '';
}

watch(() => is_modal_open.value, (n) => {
	if( n )
		resetForm()
})

</script>

<template>
	<UiModal
		:model-value="is_modal_open"
		align="center"
		width="708px"
		padding="24px"
		gap="0"
		:title="t('cart.uploadArtwork.title')"
		modal-class="upload-modal-shell"
		@update:model-value="!$event ? closeModal() : undefined"
	>
		<div class="upload-modal-body" data-testid="product-category-upload-body">
			<div
				class="upload-dropzone"
				:class="{ 'is-dragging': is_dragging }"
				data-testid="product-category-upload-dropzone"
				@dragover.prevent="is_dragging = true"
				@dragenter.prevent="is_dragging = true"
				@dragleave.prevent="is_dragging = false"
				@drop.prevent="handleDrop"
			>
				<template v-if="!has_uploaded_file">
					<div
						class="upload-dropzone-copy upload-dropzone-copy--empty"
						data-testid="product-category-upload-empty-state"
					>
						<p class="upload-dropzone-title">
							<UiIcon name="regular-upload" :size="24" color="#2a2f3d" />
							<span>{{ t('cart.uploadArtwork.dragDropTitle') }}</span>
						</p>
						<p class="upload-dropzone-meta">
							{{ t('cart.uploadArtwork.acceptedTypes') }}
						</p>
					</div>
					<UiButton
						type="button"
						variant="outline"
						tone="neutral"
						size="md"
						height="44px"
						class="upload-secondary-btn"
						data-testid="product-category-upload-select-files-button"
						@click="openFilePicker"
					>
						{{ t('cart.uploadArtwork.selectFiles') }}
					</UiButton>
				</template>
				<template v-else>
					<div class="upload-dropzone-copy" data-testid="product-category-upload-file-state">
						<div class="upload-artwork-thumb">
							<img
								v-if="has_uploaded_file"
								:src="artwork_preview"
								:alt="artwork_file_name"
								class="upload-artwork-image"
							>
							<UiIcon v-else name="regular-file-image" :size="24" color="#2a2f3d" />
						</div>
						<div>
							<p class="upload-dropzone-title">{{ artwork_file_name }}</p>
							<p class="upload-dropzone-meta">
								.{{ artwork_file_ext }} | {{ artwork_file_size }}
							</p>
						</div>
					</div>
					<div class="upload-file-actions" data-testid="product-category-upload-file-actions">
						<UiButton
							type="button"
							variant="outline"
							tone="neutral"
							size="md"
							height="44px"
							class="upload-secondary-btn"
							data-testid="product-category-upload-replace-image-button"
							@click="openFilePicker"
						>
							{{ t('cart.uploadArtwork.replaceImage') }}
						</UiButton>
						<UiButton
							type="button"
							variant="outline"
							tone="neutral"
							size="md"
							icon-only
							icon="regular-trash"
							icon-size="24"
							sr-label="Remove uploaded artwork"
							width="40px"
							height="40px"
							class="upload-icon-btn"
							data-testid="product-category-upload-remove-image-button"
							@click="removeFile"
						/>
					</div>
				</template>
			</div>

			<div class="upload-notes" data-testid="product-category-upload-notes">
				<span class="upload-notes-label">{{ t('cart.uploadArtwork.modalSpecialInstructions') }}</span>
				<UiTextarea
					v-model="instruction"
					class="upload-notes-textarea"
					:rows="4"
					resize="none"
					field-class="upload-notes-textarea-field"
					:placeholder="t('cart.uploadArtwork.specialInstructionsPlaceholder')"
					data-testid="product-category-upload-special-instructions"
				/>
			</div>

			<p class="upload-note" data-testid="product-category-upload-note">
				{{ t('cart.uploadArtwork.note') }}
			</p>

			<input
				ref="artwork_input" type="file" class="artwork-file-input"
				accept=".eps,.ai,.psd,.pdf,.tif,.tiff,.png,.jpg,.jpeg" data-testid="product-category-artwork-input"
				@change="fileChange"
			>
		</div>

		<template #footer>
			<div class="upload-modal-footer ui-modal-footer-item" data-testid="product-category-upload-footer">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="md"
					height="44px"
					class="upload-skip-btn"
					:disabled="uploading || adding_item"
					data-testid="product-category-upload-skip-button"
					@click="skipUpload()"
				>
					{{ t('cart.uploadArtwork.skipUploadLater') }}
				</UiButton>
				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					size="md"
					height="44px"
					class="upload-primary-btn"
					:disabled="uploading || adding_item"
					data-testid="product-category-upload-proceed-button"
					@click="addToCart()"
				>
					<UiIcon
						name="regular-shop-cart"
						:size="18"
						color="#ffffff"
					/>
					{{
						uploading
							? `${t('cart.uploadArtwork.addToCart')}...`
							: t('cart.uploadArtwork.addToCart')
					}}
				</UiButton>
			</div>
		</template>
	</UiModal>
</template>

<style scoped lang="scss">
.upload-modal-body {
	display: grid;
	gap: 16px;
}

.upload-dropzone {
	border: 1px dashed var(--gray-40);
	border-radius: 10px;
	min-height: 140px;
	padding: 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	transition: all 0.2s ease;

	&.is-dragging {
		border-color: var(--black-base);
		background: var(--gray-20);
		transform: scale(1.01);
		border-style: solid;
		box-shadow: var(--shadow-md);

		.upload-dropzone-title {
			color: var(--black-base);
		}

		:deep(.ui-icon) {
			transform: scale(1.1);
			color: var(--black-base) !important;
		}
	}
}

.upload-dropzone-copy {
	display: flex;
	align-items: center;
	gap: 16px;
}

.upload-dropzone-copy--empty {
	display: grid;
	align-items: start;
	gap: 8px;
}

.upload-dropzone-title {
	font-size: var(--type-size-100);
	font-weight: var(--font-weight-semibold);
	line-height: var(--type-line-100);
}

.upload-dropzone-copy--empty .upload-dropzone-title {
	display: flex;
	align-items: center;
	gap: 12px;
}

.upload-dropzone-meta {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--gray-80);
}

.upload-artwork-thumb {
	width: 54px;
	height: 54px;
	border-radius: 10px;
	background: var(--gray-10);
	overflow: hidden;
	display: grid;
	place-items: center;
}

.upload-artwork-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.upload-file-actions {
	display: flex;
	align-items: center;
	gap: 10px;
}

.upload-secondary-btn {
	border: 1px solid var(--gray-60);
	padding: 0 20px;
	box-shadow: none;
}

.upload-icon-btn {
	width: 44px;
	height: 44px;
	border: 1px solid var(--gray-60);
	border-radius: 10px;
	background: #ffffff;
	display: grid;
	place-items: center;
	box-shadow: none;
	padding: 0;
}

.upload-notes {
	display: grid;
	gap: 8px;
}

.upload-notes-label {
	font-size: var(--type-size-100);
	font-weight: var(--font-weight-semibold);
	line-height: var(--type-line-100);
}

.upload-notes-textarea {
	width: 100%;
	min-height: 130px;
}

.upload-notes-textarea-field {
	min-height: 130px;
	padding: 14px 16px;
}

.upload-note {
	color: var(--gray-80);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
}

.upload-modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
}

.upload-primary-btn {
	border-radius: 999px;
	gap: 8px;
	padding: 0 22px;

	&:disabled {
		background: var(--gray-40);
	}
}

:global(.upload-modal-shell) {
	border-radius: 12px;
	overflow: hidden;
	max-width: 708px;
}

.artwork-file-input {
	display: none;
}

</style>