<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import UiButton from '@/components/ui/Button.vue';
import UiIcon from '@/components/ui/Icon.vue';
import MuLinearWrapper from '@/components/base/MuLinearWrapper.vue';
import MuText from '@/components/base/MuText.vue';

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
		multiple: false,
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
const preview_urls = ref<string[]>([]);
const is_drag_over = ref(false);
const removed_existing = ref(false);
const replace_index = ref<number | null>(null);

// --- helpers ---

function fileExt(name: string): string {
	const i = name.lastIndexOf('.');
	return i < 0 ? '' : name.slice(i + 1).toLowerCase();
}

function toExt(raw: string): string {
	const ext = raw.trim().toLowerCase().replace(/^\./, '');
	return ext ? `.${ext}` : '';
}

function formatSize(bytes: number): string {
	return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// --- computed ---

const accepted_extensions = computed(() => {
	const unique = new Set<string>();
	for (const f of props.acceptedFormats) {
		const ext = f.trim().toLowerCase().replace(/^\./, '');
		if (ext) unique.add(ext);
	}
	return Array.from(unique);
});

const accept_attr = computed(() =>
	accepted_extensions.value.map(e => `.${e}`).join(',')
);

const accepted_filetypes_text = computed(() => {
	if (props.acceptedText.trim()) return props.acceptedText.trim();
	if (!accepted_extensions.value.length) return '';
	return `Accepted filetypes: ${accepted_extensions.value.map(e => `.${e}`).join(', ')}`;
});

// --- file state ---

function makePreview(file: File): string {
	return file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
}

function revokeAll() {
	for (const url of preview_urls.value) {
		if (url) URL.revokeObjectURL(url);
	}
	preview_urls.value = [];
}

function commit(files: File[]) {
	revokeAll();
	selected_files.value = files;
	preview_urls.value = files.map(makePreview);
	emit('change', files);
}

function filterAccepted(files: File[]): File[] {
	if (!accepted_extensions.value.length) return files.slice();
	const allowed = new Set(accepted_extensions.value);
	return files.filter(f => allowed.has(fileExt(f.name)));
}

function applyFiles(incoming: File[]) {
	const filtered = filterAccepted(incoming);
	if (!filtered.length) {
		replace_index.value = null;
		return;
	}

	if (!props.multiple) {
		removed_existing.value = false;
		commit([filtered[0]]);
		replace_index.value = null;
		return;
	}

	if (replace_index.value !== null) {
		const idx = replace_index.value;
		replace_index.value = null;
		const files = [...selected_files.value];
		const urls = [...preview_urls.value];
		if (urls[idx]) URL.revokeObjectURL(urls[idx]);
		files[idx] = filtered[0];
		urls[idx] = makePreview(filtered[0]);
		selected_files.value = files;
		preview_urls.value = urls;
		emit('change', files);
		return;
	}

	const files = [...selected_files.value, ...filtered];
	const urls = [...preview_urls.value, ...filtered.map(makePreview)];
	selected_files.value = files;
	preview_urls.value = urls;
	emit('change', files);
}

// --- actions ---

function openFilePicker() {
	replace_index.value = null;
	file_input_ref.value?.click();
}

function openReplacePicker(index: number) {
	replace_index.value = index;
	file_input_ref.value?.click();
}

function onFileChange(event: Event) {
	const input = event.target as HTMLInputElement | null;
	applyFiles(Array.from(input?.files || []));
	if (file_input_ref.value) file_input_ref.value.value = '';
}

function removeAt(index: number) {
	const files = [...selected_files.value];
	const urls = [...preview_urls.value];
	if (urls[index]) URL.revokeObjectURL(urls[index]);
	files.splice(index, 1);
	urls.splice(index, 1);
	selected_files.value = files;
	preview_urls.value = urls;
	emit('change', files);
}

function clearAll() {
	revokeAll();
	selected_files.value = [];
	removed_existing.value = true;
	if (file_input_ref.value) file_input_ref.value.value = '';
	emit('change', []);
}

function onDrop(event: DragEvent) {
	event.preventDefault();
	is_drag_over.value = false;
	applyFiles(Array.from(event.dataTransfer?.files || []));
}

function onDragOver(event: DragEvent) {
	event.preventDefault();
	is_drag_over.value = true;
}

function onDragLeave() {
	is_drag_over.value = false;
}

onBeforeUnmount(revokeAll);

// --- display ---

const file_rows = computed(() =>
	selected_files.value.map((file, index) => {
		const ext = toExt(fileExt(file.name));
		const size = formatSize(file.size);
		return {
			key: `${file.name}-${file.size}-${file.lastModified}-${index}`,
			index,
			name: file.name,
			meta: [ext, size].filter(Boolean).join(' | '),
			previewUrl: preview_urls.value[index] || '',
		};
	})
);

const single_file = computed(() => {
	const sel = selected_files.value[0];
	if (sel) {
		const ext = toExt(fileExt(sel.name));
		const size = formatSize(sel.size);
		return {
			name: sel.name,
			meta: [ext, size].filter(Boolean).join(' | '),
			previewUrl: preview_urls.value[0] || '',
		};
	}
	const ex = removed_existing.value ? null : props.existingFile;
	if (!ex) return null;
	return {
		name: ex.name,
		meta: [toExt(ex.extension || fileExt(ex.name)), ex.sizeLabel || ''].filter(Boolean).join(' | '),
		previewUrl: ex.url || '',
	};
});
</script>

<template>
	<div class="ui-file-input-wrap">
		<!-- Multi-mode: stacked file list + always-visible dropzone -->
		<template v-if="multiple">
			<div v-if="file_rows.length" class="ui-file-input-list">
				<article
					v-for="row in file_rows"
					:key="row.key"
					class="ui-file-input-row"
				>
					<MuLinearWrapper class="ui-file-input-copy ui-file-input-copy--file" align="center" :gap="18">
						<div class="ui-file-input-thumb">
							<img
								v-if="row.previewUrl"
								:src="row.previewUrl"
								:alt="row.name"
								class="ui-file-input-image"
							>
							<UiIcon v-else name="regular-file-image" :size="24" color="var(--text-primary)" />
						</div>
						<MuLinearWrapper direction="column" :gap="6">
							<MuText size="large" weight="semi-bold">{{ row.name }}</MuText>
							<MuText size="small" color="text-secondary">{{ row.meta }}</MuText>
						</MuLinearWrapper>
					</MuLinearWrapper>

					<MuLinearWrapper class="ui-file-input-actions" align="center" :gap="10">
						<UiButton type="button" variant="outline" tone="neutral" size="md" height="48px" @click="openReplacePicker(row.index)">
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
							@click="removeAt(row.index)"
						/>
					</MuLinearWrapper>
				</article>
			</div>

			<section
				class="ui-file-input"
				:data-drag-over="is_drag_over ? 'true' : 'false'"
				@drop="onDrop"
				@dragover="onDragOver"
				@dragleave="onDragLeave"
			>
				<MuLinearWrapper class="ui-file-input-copy" direction="column" :gap="10">
					<MuLinearWrapper align="center" :gap="12">
						<UiIcon name="regular-upload" :size="24" color="var(--text-primary)" />
						<MuText size="large" weight="semi-bold">{{ dragDropText }}</MuText>
					</MuLinearWrapper>
					<MuText size="small" color="text-secondary">{{ accepted_filetypes_text }}</MuText>
				</MuLinearWrapper>

				<UiButton type="button" variant="outline" tone="neutral" size="md" height="40px" @click="openFilePicker">
					{{ selectText }}
				</UiButton>
			</section>
		</template>

		<!-- Single-mode: dropzone or one file row -->
		<section
			v-else
			class="ui-file-input"
			:data-drag-over="is_drag_over ? 'true' : 'false'"
			@drop="onDrop"
			@dragover="onDragOver"
			@dragleave="onDragLeave"
		>
			<template v-if="!single_file">
				<MuLinearWrapper class="ui-file-input-copy" direction="column" :gap="10">
					<MuLinearWrapper align="center" :gap="12">
						<UiIcon name="regular-upload" :size="24" color="var(--text-primary)" />
						<MuText size="large" weight="semi-bold">{{ dragDropText }}</MuText>
					</MuLinearWrapper>
					<MuText size="small" color="text-secondary">{{ accepted_filetypes_text }}</MuText>
				</MuLinearWrapper>

				<UiButton type="button" variant="outline" tone="neutral" size="md" height="40px" @click="openFilePicker">
					{{ selectText }}
				</UiButton>
			</template>

			<template v-else>
				<MuLinearWrapper class="ui-file-input-copy ui-file-input-copy--file" align="center" :gap="18">
					<div class="ui-file-input-thumb">
						<img
							v-if="single_file.previewUrl"
							:src="single_file.previewUrl"
							:alt="single_file.name"
							class="ui-file-input-image"
						>
						<UiIcon v-else name="regular-file-image" :size="24" color="var(--text-primary)" />
					</div>
					<MuLinearWrapper direction="column" :gap="6">
						<MuText size="large" weight="semi-bold">{{ single_file.name }}</MuText>
						<MuText size="small" color="text-secondary">{{ single_file.meta }}</MuText>
					</MuLinearWrapper>
				</MuLinearWrapper>

				<MuLinearWrapper class="ui-file-input-actions" align="center" :gap="10">
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
						@click="clearAll"
					/>
				</MuLinearWrapper>
			</template>
		</section>

		<input
			ref="file_input_ref"
			type="file"
			:multiple="multiple"
			:accept="accept_attr"
			class="ui-file-input-hidden"
			@change="onFileChange"
		>
	</div>
</template>

<style scoped lang="scss">
.ui-file-input-wrap {
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
}

.ui-file-input-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
}

.ui-file-input,
.ui-file-input-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	padding: 22px 24px;
	border: 1px dashed var(--gray-40);
	border-radius: 12px;
	width: 100%;
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
	.ui-file-input,
	.ui-file-input-row {
		flex-direction: column;
		align-items: stretch;
	}

	.ui-file-input-copy--file,
	.ui-file-input-actions {
		width: 100%;
	}
}
</style>
