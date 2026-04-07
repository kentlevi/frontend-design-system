<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { AccountOrderLineItem } from '~/types/account/orders';

const props = defineProps<{
	open: boolean;
	item: AccountOrderLineItem | null;
}>();

const emit = defineEmits<{
	close: [];
	submit: [{ itemNumber: string; instructions: string; files: File[] }];
}>();

const file_input_ref = ref<HTMLInputElement | null>(null);
const selected_files = ref<File[]>([]);
const special_instructions = ref('');

const primary_file = computed(() => selected_files.value[0] || null);

const primary_file_preview_url = computed(() => {
	if (!primary_file.value) return '';
	if (!primary_file.value.type.startsWith('image/')) return '';
	return URL.createObjectURL(primary_file.value);
});

const primary_file_extension = computed(() => {
	if (!primary_file.value) return '';
	const parts = primary_file.value.name.split('.');
	return parts.length > 1 ? `.${parts.pop()?.toLowerCase() || ''}` : '';
});

const primary_file_size_label = computed(() => {
	if (!primary_file.value) return '';
	const size_in_mb = primary_file.value.size / (1024 * 1024);
	return `${size_in_mb.toFixed(1)}MB`;
});

watch(
	() => props.open,
	(is_open) => {
		if (!is_open) return;
		selected_files.value = [];
		special_instructions.value = '';
		if (file_input_ref.value) {
			file_input_ref.value.value = '';
		}
	}
);

function closeModal() {
	emit('close');
}

function openFilePicker() {
	file_input_ref.value?.click();
}

function handleFileChange(event: Event) {
	const target = event.target as HTMLInputElement | null;
	selected_files.value = Array.from(target?.files || []);
}

function removeSelectedArtwork() {
	selected_files.value = [];
	if (file_input_ref.value) {
		file_input_ref.value.value = '';
	}
}

function submitUpload() {
	if (!props.item) return;

	emit('submit', {
		itemNumber: props.item.number,
		instructions: special_instructions.value.trim(),
		files: selected_files.value,
	});
	closeModal();
}
</script>

<template>
	<UiModal
		:model-value="props.open"
		align="top"
		width="720px"
		padding="0"
		gap="0"
		modal-class="account-orders-upload-modal-shell"
		@update:model-value="!$event ? closeModal() : undefined"
	>
		<section v-if="props.item" class="account-orders-upload-modal">
			<header class="account-orders-upload-modal-header">
				<h3 class="account-orders-upload-modal-title">Upload Artwork - Item No. {{ props.item.number }}</h3>
				<button
					type="button"
					class="account-orders-upload-modal-close"
					aria-label="Close upload artwork modal"
					@click="closeModal"
				>
					<UiIcon name="regular-times" size="24" color="var(--text-primary)" decorative />
				</button>
			</header>

			<div class="account-orders-upload-modal-body">
				<section class="account-orders-upload-details-card">
					<h4 class="account-orders-upload-section-title">Item Details:</h4>
					<div class="account-orders-upload-details-grid">
						<div class="account-orders-upload-details-row">
							<span class="account-orders-upload-details-label">Product:</span>
							<strong class="account-orders-upload-details-value">{{ props.item.productName }}</strong>
						</div>
						<div class="account-orders-upload-details-row">
							<span class="account-orders-upload-details-label">Size:</span>
							<strong class="account-orders-upload-details-value">{{ props.item.size }}</strong>
						</div>
						<div class="account-orders-upload-details-row">
							<span class="account-orders-upload-details-label">Quantity:</span>
							<strong class="account-orders-upload-details-value">{{ props.item.quantity }} pcs</strong>
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

						<UiButton type="button" variant="outline" tone="neutral" size="md" height="40px" @click="openFilePicker">
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
							<UiButton type="button" variant="outline" tone="neutral" size="md" height="48px" @click="openFilePicker">
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
								@click="removeSelectedArtwork"
							/>
						</div>
					</template>

					<input
						ref="file_input_ref"
						type="file"
						multiple
						accept=".eps,.ai,.psd,.pdf,.tif,.png,.jpg,.jpeg"
						class="account-orders-upload-hidden-input"
						@change="handleFileChange"
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

			<footer class="account-orders-upload-modal-footer">
				<UiButton type="button" variant="ghost" tone="neutral" size="sm" :no-hover="true" @click="closeModal">
					Cancel
				</UiButton>
				<UiButton type="button" variant="filled" tone="neutral" size="md" @click="submitUpload">
					Submit
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
.account-orders-upload-modal {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) auto;
	background: var(--contrast-light);
	border: 1px solid var(--gray-40);
	border-radius: 12px;
	overflow: hidden;
}

.account-orders-upload-modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 18px 24px;
	border-bottom: 1px solid var(--gray-40);
}

.account-orders-upload-modal-title {
	font-size: var(--type-size-300);
	line-height: var(--type-line-300);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.account-orders-upload-modal-close {
	border: 0;
	background: transparent;
	padding: 0;
	width: 24px;
	height: 24px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

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
	gap: 16px;
	padding: 16px 24px 24px;
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