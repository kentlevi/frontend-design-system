<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuFileInput from '~/components/base/MuFileInput.vue';

const files = ref<File[]>([]);
const custom_files = ref<File[]>([]);
const multiple_files = ref<File[]>([]);

function onChange(fileList: File[]) { files.value = fileList; }
function onCustomChange(fileList: File[]) { custom_files.value = fileList; }
function onMultipleChange(fileList: File[]) { multiple_files.value = fileList; }
</script>

<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuFileInput</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Drag-and-drop or select files, with preview for image files.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<MuFileInput @change="onChange" />
			<MuText size="small">
				Selected file count: <code>{{ files.length }}</code>
			</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Custom Labels</MuHeading>
		<div class="guide-demo">
			<MuFileInput
				drag-drop-text="Drop your design file"
				select-text="Browse Files"
				replace-text="Replace File"
				:accepted-formats="['png', 'jpg', 'pdf']"
				@change="onCustomChange"
			/>
			<MuText size="small">
				Last update: <code>{{ custom_files.length }} file(s)</code>
			</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Multiple Files</MuHeading>
		<div class="guide-demo">
			<MuFileInput
				:multiple="true"
				:accepted-formats="['eps', 'ai', 'psd', 'pdf', 'tif', 'png', 'jpg']"
				@change="onMultipleChange"
			/>
			<MuText size="small">
				When <code>multiple=true</code>, event emits all selected files.
				Files accumulate across selections and the drop zone stays visible so you can keep adding more.
				Each row has its own <em>replace</em> and <em>remove</em> controls.
			</MuText>
			<MuText size="small">
				Emitted count: <code>{{ multiple_files.length }}</code>
			</MuText>
			<MuLinearWrapper v-if="multiple_files.length" direction="column" :gap="4">
				<MuText v-for="file in multiple_files" :key="file.name + file.size" size="small" color="text-secondary">
					- {{ file.name }}
				</MuText>
			</MuLinearWrapper>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
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

		<MuHeading variant="6" weight="bold">Events</MuHeading>
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
