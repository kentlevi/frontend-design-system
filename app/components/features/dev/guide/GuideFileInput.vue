<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiFileInput</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Drag-and-drop or select files, with preview for image files.
		</UiText>

		<UiHeading variant="6" weight="bold">Basic</UiHeading>
		<div class="guide-demo">
			<UiFileInput @change="onChange" />
			<UiText size="small">
				Selected file count: <code>{{ files.length }}</code>
			</UiText>
		</div>

		<UiHeading variant="6" weight="bold">Custom Labels</UiHeading>
		<div class="guide-demo">
			<UiFileInput
				drag-drop-text="Drop your design file"
				select-text="Browse Files"
				replace-text="Replace File"
				:accepted-formats="['png', 'jpg', 'pdf']"
				@change="onCustomChange"
			/>
			<UiText size="small">
				Last update: <code>{{ custom_files.length }} file(s)</code>
			</UiText>
		</div>

		<UiHeading variant="6" weight="bold">Multiple Files</UiHeading>
		<div class="guide-demo">
			<UiFileInput
				:multiple="true"
				:accepted-formats="['eps', 'ai', 'psd', 'pdf', 'tif', 'png', 'jpg']"
				@change="onMultipleChange"
			/>
			<UiText size="small">
				When <code>multiple=true</code>, event emits all selected files.
			</UiText>
			<UiText size="small">
				Emitted count: <code>{{ multiple_files.length }}</code>
			</UiText>
			<UiLinearWrapper v-if="multiple_files.length" direction="column" :gap="4">
				<UiText v-for="file in multiple_files" :key="file.name + file.size" size="small" color="text-secondary">
					- {{ file.name }}
				</UiText>
			</UiLinearWrapper>
		</div>

		<UiHeading variant="6" weight="bold">Properties</UiHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Prop</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>accepted-formats</td>
					<td><code>string[]</code></td>
					<td>common artwork list</td>
					<td>Allowed file extensions for the native file picker.</td>
				</tr>
				<tr>
					<td>multiple</td>
					<td><code>boolean</code></td>
					<td><code>true</code></td>
					<td>Allow selecting multiple files (all files are emitted via <code>change</code>).</td>
				</tr>
				<tr>
					<td>drag-drop-text</td>
					<td><code>string</code></td>
					<td>drag/drop copy</td>
					<td>Title shown in empty state.</td>
				</tr>
				<tr>
					<td>accepted-text</td>
					<td><code>string</code></td>
					<td>accepted file types copy</td>
					<td>Meta text shown in empty state.</td>
				</tr>
				<tr>
					<td>select-text</td>
					<td><code>string</code></td>
					<td><code>Select Files</code></td>
					<td>Button label in empty state.</td>
				</tr>
				<tr>
					<td>replace-text</td>
					<td><code>string</code></td>
					<td><code>Replace Image</code></td>
					<td>Button label after file selection.</td>
				</tr>
			</tbody>
		</table>

		<UiHeading variant="6" weight="bold">Events</UiHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Event</th>
					<th>Payload</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>change</td>
					<td><code>File[]</code></td>
					<td>Emits selected files only (array length can be > 1 when <code>multiple=true</code>).</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
const files = ref<File[]>([]);
const custom_files = ref<File[]>([]);
const multiple_files = ref<File[]>([]);

const onChange = (value: File[]) => {
	files.value = value;
};

const onCustomChange = (value: File[]) => {
	custom_files.value = value;
};

const onMultipleChange = (value: File[]) => {
	multiple_files.value = value;
};
</script>
