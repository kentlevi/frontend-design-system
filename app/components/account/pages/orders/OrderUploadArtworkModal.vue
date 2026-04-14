<script setup lang="ts">
import { useOrderUploadArtworkModal } from '~/composables/account/orders/useOrderUploadArtworkModal';

const emit = defineEmits<{
	submit: [{ itemNumber: string; instructions: string; files: File[] }];
}>();

const {
	is_open,
	item,
	file_input_ref,
	selected_files,
	special_instructions,
	primary_file,
	primary_file_preview_url,
	primary_file_extension,
	primary_file_size_label,
	close_modal,
	open_file_picker,
	handle_file_change,
	remove_selected_artwork,
} = useOrderUploadArtworkModal();

function submitUpload() {
	if (!item.value) return;

	emit('submit', {
		itemNumber: item.value.number,
		instructions: special_instructions.value.trim(),
		files: selected_files.value,
	});
	close_modal();
}
</script>

<template>
	<UiModal
		:model-value="is_open"
		align="top"
		width="720px"
		padding="0"
		gap="0"
		:title="item ? `Upload Artwork - Item No. ${item.number}` : ''"
		modal-class="account-orders-upload-modal-shell"
		@update:model-value="!$event && close_modal()"
	>
		<div v-if="item" class="account-orders-upload-modal-body">
			<section class="account-orders-upload-details-card">
				<h4 class="account-orders-upload-section-title">Item Details:</h4>
				<div class="account-orders-upload-details-grid">
					<div class="account-orders-upload-details-row">
						<span class="account-orders-upload-details-label">Product:</span>
						<strong class="account-orders-upload-details-value">{{ item.productName }}</strong>
					</div>
					<div class="account-orders-upload-details-row">
						<span class="account-orders-upload-details-label">Size:</span>
						<strong class="account-orders-upload-details-value">{{ item.size }}</strong>
					</div>
					<div class="account-orders-upload-details-row">
						<span class="account-orders-upload-details-label">Quantity:</span>
						<strong class="account-orders-upload-details-value">{{ item.quantity }} pcs</strong>
					</div>
				</div>
			</section>

			<section class="account-orders-upload-dropzone">
				<template v-if="!primary_file">
					<div class="account-orders-upload-dropzone-copy">
						<p class="account-orders-upload-dropzone-title">
							<UiIcon name="regular-upload" size="24" color="var(--text-primary)" />
							<span>Drag and drop files to upload</span>
						</p>
						<p class="account-orders-upload-dropzone-meta">
							Accepted filetypes: .eps, .ai, .psd, .pdf, .tif, .png and .jpg
						</p>
					</div>

					<UiButton type="button" variant="outline" tone="neutral" size="md" height="40px" @click="open_file_picker">
						Select Files
					</UiButton>
				</template>
				<template v-else>
					<div class="account-orders-upload-dropzone-copy account-orders-upload-dropzone-copy--file">
						<div class="account-orders-upload-file-thumb">
							<img
								v-if="primary_file_preview_url"
								:src="primary_file_preview_url"
								:alt="primary_file.name"
								class="account-orders-upload-file-image"
							>
							<UiIcon v-else name="regular-file-image" size="24" color="var(--text-primary)" />
						</div>
						<div class="account-orders-upload-file-copy">
							<p class="account-orders-upload-dropzone-title">{{ primary_file.name }}</p>
							<p class="account-orders-upload-dropzone-meta">
								{{ primary_file_extension }} | {{ primary_file_size_label }}
							</p>
						</div>
					</div>

					<div class="account-orders-upload-file-actions">
						<UiButton type="button" variant="outline" tone="neutral" size="md" height="48px" @click="open_file_picker">
							Replace Image
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
							width="48px"
							height="48px"
							@click="remove_selected_artwork"
						/>
					</div>
				</template>

				<input
					ref="file_input_ref"
					type="file"
					multiple
					accept=".eps,.ai,.psd,.pdf,.tif,.png,.jpg,.jpeg"
					class="account-orders-upload-hidden-input"
					@change="handle_file_change"
				>
			</section>

			<section class="account-orders-upload-notes">
				<h4 class="account-orders-upload-section-title">Special Instructions</h4>
				<UiTextarea
					:model-value="special_instructions"
					:rows="4"
					resize="none"
					field-class="account-orders-upload-notes-field"
					placeholder="Enter special instruction here...."
					@update:model-value="special_instructions = String($event)"
				/>
			</section>
		</div>

		<template #footer>
			<div v-if="item" class="account-orders-upload-modal-footer ui-modal-footer-item">
				<UiButton type="button" variant="ghost" tone="neutral" size="sm" :no-hover="true" @click="close_modal">
					Cancel
				</UiButton>
				<UiButton type="button" variant="filled" tone="neutral" size="md" @click="submitUpload">
					Submit
				</UiButton>
			</div>
		</template>
	</UiModal>
</template>

<style scoped lang="scss">
.account-orders-upload-modal-body {
	display: grid;
	gap: 24px;
	padding: 24px;
}

.account-orders-upload-details-card {
	display: grid;
	gap: 12px;
	padding: 18px 22px;
	border-radius: 12px;
	background: var(--gray-10);
}

.account-orders-upload-section-title {
	font-size: var(--type-size-200);
	line-height: var(--type-line-200);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

.account-orders-upload-details-grid {
	display: grid;
	gap: 8px;
}

.account-orders-upload-details-row {
	display: grid;
	grid-template-columns: 92px minmax(0, 1fr);
	align-items: start;
	gap: 12px;
}

.account-orders-upload-details-label {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--text-secondary);
}

.account-orders-upload-details-value {
	justify-self: end;
	text-align: right;
	font-size: var(--type-size-200);
	line-height: var(--type-line-200);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

.account-orders-upload-dropzone {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	padding: 22px 24px;
	border: 1px dashed var(--gray-40);
	border-radius: 12px;
}

.account-orders-upload-dropzone-copy {
	display: grid;
	gap: 10px;
}

.account-orders-upload-dropzone-copy--file {
	display: flex;
	align-items: center;
	gap: 18px;
}

.account-orders-upload-dropzone-title {
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: var(--type-size-200);
	line-height: var(--type-line-200);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

.account-orders-upload-dropzone-meta,
.account-orders-upload-dropzone-files {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--text-secondary);
}

.account-orders-upload-file-thumb {
	width: 56px;
	height: 56px;
	border-radius: 10px;
	background: var(--gray-10);
	display: grid;
	place-items: center;
	overflow: hidden;
	flex: 0 0 auto;
}

.account-orders-upload-file-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.account-orders-upload-file-copy {
	display: grid;
	gap: 6px;
}

.account-orders-upload-file-actions {
	display: flex;
	align-items: center;
	gap: 10px;
}

.account-orders-upload-hidden-input {
	display: none;
}

.account-orders-upload-notes {
	display: grid;
	gap: 10px;
}

.account-orders-upload-notes-field {
	min-height: 102px;
}

.account-orders-upload-modal-footer {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

@media (max-width: 760px) {
	.account-orders-upload-modal-body {
		padding: 20px 16px;
	}

	.account-orders-upload-dropzone,
	.account-orders-upload-modal-footer {
		align-items: stretch;
		flex-direction: column;
	}

	.account-orders-upload-dropzone-copy--file,
	.account-orders-upload-file-actions {
		width: 100%;
	}

	.account-orders-upload-details-row {
		grid-template-columns: 1fr;
	}

	.account-orders-upload-details-value {
		justify-self: start;
		text-align: left;
	}
}
</style>