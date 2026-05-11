<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import UiButton from '@/components/ui/Button.vue';
import UiIcon from '@/components/ui/Icon.vue';
import UiLinearWrapper from '@/components/ui/LinearWrapper.vue';
import UiText from '@/components/ui/Text.vue';

type ExistingFile = {
	name: string;
	url?: string;
	extension?: string;
	sizeLabel?: string;
};

const props = withDefaults(
	defineProps<{
		existingFile?: ExistingFile | null;
		acceptedFormats?: string[];
		multiple?: boolean;
		dragDropText?: string;
		acceptedText?: string;
		selectText?: string;
		replaceText?: string;
		removeSrLabel?: string;
	}>(),
	{
		existingFile: null,
		acceptedFormats: () => ['eps', 'ai', 'psd', 'pdf', 'tif', 'png', 'jpg'],
		multiple: true,
		dragDropText: 'Drag and drop files to upload',
		acceptedText: '',
		selectText: 'Select Files',
		replaceText: 'Replace Image',
		removeSrLabel: 'Remove selected file',
	}
);

const emit = defineEmits<{
	(e: 'change', files: File[]): void;
}>();

const file_input_ref = ref<HTMLInputElement | null>(null);
const selected_files = ref<File[]>([]);
const preview_url = ref('');
const is_drag_over = ref(false);
const removed_existing_file = ref(false);

function sanitizeExtension(value: string): string {
	return value.trim().toLowerCase().replace(/^\./, '');
}

function toDottedExtension(value: string): string {
	const extension = sanitizeExtension(value);
	return extension ? `.${extension}` : '';
}

function getFileExtension(file_name: string): string {
	const parts = file_name.split('.');
	if (parts.length < 2) return '';
	return sanitizeExtension(parts[parts.length - 1] || '');
}

function formatFileSize(bytes: number): string {
	return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function joinWithAnd(values: string[]): string {
	if (!values.length) return '';
	if (values.length === 1) return values[0];
	if (values.length === 2) return `${values[0]} and ${values[1]}`;
	return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
}

const accepted_extensions = computed(() => {
	const unique = new Set<string>();
	for (const format of props.acceptedFormats) {
		const normalized = sanitizeExtension(format);
		if (normalized) unique.add(normalized);
	}
	return Array.from(unique);
});

const accepted_extension_set = computed(() => new Set(accepted_extensions.value));
const accept_attr = computed(() => accepted_extensions.value.map(ext => `.${ext}`).join(','));

const accepted_filetypes_text = computed(() => {
	const custom = props.acceptedText.trim();
	if (custom) return custom;

	const dotted = accepted_extensions.value.map(ext => `.${ext}`);
	const list = joinWithAnd(dotted);
	return list ? `Accepted filetypes: ${list}` : '';
});

const first_selected_file = computed(() => selected_files.value[0] || null);
const visible_existing_file = computed(() => (removed_existing_file.value ? null : props.existingFile));

const display_file = computed(() => {
	const selected = first_selected_file.value;
	if (selected) {
		return {
			name: selected.name,
			extension: toDottedExtension(getFileExtension(selected.name)),
			sizeLabel: formatFileSize(selected.size),
			previewUrl: preview_url.value,
		};
	}

	const existing = visible_existing_file.value;
	if (!existing) return null;

	return {
		name: existing.name,
		extension: toDottedExtension(existing.extension || getFileExtension(existing.name)),
		sizeLabel: existing.sizeLabel || '',
		previewUrl: existing.url || '',
	};
});

const has_display_file = computed(() => Boolean(display_file.value));

const display_meta = computed(() => {
	const file = display_file.value;
	if (!file) return '';
	if (file.extension && file.sizeLabel) return `${file.extension} | ${file.sizeLabel}`;
	return file.extension || file.sizeLabel;
});

function revokePreview() {
	if (!preview_url.value) return;
	URL.revokeObjectURL(preview_url.value);
	preview_url.value = '';
}

function setPreview(file: File | null) {
	revokePreview();
	if (!file || !file.type.startsWith('image/')) return;
	preview_url.value = URL.createObjectURL(file);
}

function resetNativeInput() {
	if (file_input_ref.value) file_input_ref.value.value = '';
}

function prepareFiles(files: File[]): File[] {
	const filtered = files.filter((file) => {
		if (!accepted_extension_set.value.size) return true;
		return accepted_extension_set.value.has(getFileExtension(file.name));
	});

	return props.multiple ? filtered : filtered.slice(0, 1);
}

function applyFiles(files: File[]) {
	const next = prepareFiles(files);
	selected_files.value = next;
	removed_existing_file.value = false;
	setPreview(next[0] || null);
	emit('change', next);
}

function openFilePicker() {
	file_input_ref.value?.click();
}

function onFileChange(event: Event) {
	const input = event.target as HTMLInputElement | null;
	applyFiles(Array.from(input?.files || []));
}

function removeSelectedFile() {
	selected_files.value = [];
	removed_existing_file.value = true;
	resetNativeInput();
	setPreview(null);
	emit('change', []);
}

function onDrop(event: DragEvent) {
	event.preventDefault();
	is_drag_over.value = false;
	const dropped = Array.from(event.dataTransfer?.files || []);
	if (!dropped.length) return;
	applyFiles(dropped);
}

function onDragOver(event: DragEvent) {
	event.preventDefault();
	is_drag_over.value = true;
}

function onDragLeave() {
	is_drag_over.value = false;
}

onBeforeUnmount(revokePreview);
</script>

<template>
	<section
		class="ui-file-input"
		:data-drag-over="is_drag_over ? 'true' : 'false'"
		@drop="onDrop"
		@dragover="onDragOver"
		@dragleave="onDragLeave"
	>
		<template v-if="!has_display_file">
			<UiLinearWrapper class="ui-file-input-copy" direction="column" :gap="10">
				<UiLinearWrapper align="center" :gap="12">
					<UiIcon name="regular-upload" :size="24" color="var(--text-primary)" />
					<UiText size="large" weight="semi-bold">{{ dragDropText }}</UiText>
				</UiLinearWrapper>
				<UiText size="small" color="text-secondary">{{ accepted_filetypes_text }}</UiText>
			</UiLinearWrapper>

			<UiButton type="button" variant="outline" tone="neutral" size="md" height="40px" @click="openFilePicker">
				{{ selectText }}
			</UiButton>
		</template>

		<template v-else>
			<UiLinearWrapper class="ui-file-input-copy ui-file-input-copy--file" align="center" :gap="18">
				<div class="ui-file-input-thumb">
					<img
						v-if="display_file?.previewUrl"
						:src="display_file.previewUrl"
						:alt="display_file.name"
						class="ui-file-input-image"
					>
					<UiIcon v-else name="regular-file-image" :size="24" color="var(--text-primary)" />
				</div>
				<UiLinearWrapper direction="column" :gap="6">
					<UiText size="large" weight="semi-bold">{{ display_file?.name }}</UiText>
					<UiText size="small" color="text-secondary">{{ display_meta }}</UiText>
				</UiLinearWrapper>
			</UiLinearWrapper>

			<UiLinearWrapper class="ui-file-input-actions" align="center" :gap="10">
				<UiButton type="button" variant="outline" tone="neutral" size="md" height="48px" @click="openFilePicker">
					{{ replaceText }}
				</UiButton>
				<UiButton
					type="button"
					variant="outline"
					tone="neutral"
					size="md"
					icon-only
					icon="regular-trash"
					icon-size="24"
					:sr-label="removeSrLabel"
					width="48px"
					height="48px"
					@click="removeSelectedFile"
				/>
			</UiLinearWrapper>
		</template>

		<input
			ref="file_input_ref"
			type="file"
			:multiple="multiple"
			:accept="accept_attr"
			class="ui-file-input-hidden"
			@change="onFileChange"
		>
	</section>
</template>

<style scoped lang="scss">
.ui-file-input {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	padding: 22px 24px;
	border: 1px dashed var(--gray-40);
	border-radius: 12px;
}

.ui-file-input[data-drag-over='true'] {
	background: var(--gray-10);
}

.ui-file-input-thumb {
	width: 56px;
	height: 56px;
	border-radius: 10px;
	background: var(--gray-10);
	display: grid;
	place-items: center;
	overflow: hidden;
	flex: 0 0 auto;
}

.ui-file-input-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.ui-file-input-hidden {
	display: none;
}

@media (max-width: 760px) {
	.ui-file-input {
		flex-direction: column;
		align-items: stretch;
	}

	.ui-file-input-copy--file,
	.ui-file-input-actions {
		width: 100%;
	}
}
</style>
