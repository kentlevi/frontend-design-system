<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiIcon</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Full icon catalog from the current sprite map. Use search to check if an icon name exists.
		</UiText>

		<div class="guide-demo">
			<div class="guide-icon-toolbar">
				<UiInput
					v-model="search_query"
					type="search"
					placeholder="Search icon name (ex: regular-search, strong-user)"
					input-class="guide-icon-search-input"
				/>
				<UiText size="small" color="var(--text-secondary)">
					{{ filtered_icon_names.length }} / {{ icon_names.length }} icons
				</UiText>
			</div>

			<div v-if="filtered_icon_names.length" class="guide-icon-grid">
				<div
					v-for="name in filtered_icon_names"
					:key="name"
					class="guide-icon-item"
				>
					<UiIcon :name="name" :size="22" />
					<code class="guide-icon-name">{{ name }}</code>
				</div>
			</div>

			<UiText v-else size="small" color="var(--text-secondary)">
				No icons found for "{{ search_query }}".
			</UiText>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { icons } from '~/data/ui/icons';

const search_query = ref('');
const icon_names = Object.keys(icons).sort();

const filtered_icon_names = computed(() => {
	const keyword = search_query.value.trim().toLowerCase();
	if (!keyword) return icon_names;

	return icon_names.filter(name =>
		name.toLowerCase().includes(keyword),
	);
});
</script>

<style scoped lang="scss">
.guide-icon-toolbar {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.guide-icon-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 10px;
}

.guide-icon-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 10px;
	border: 1px solid var(--border-default, #e4e7ec);
	border-radius: 8px;
	background: var(--contrast-light, #fff);
	min-height: 42px;
}

.guide-icon-name {
	font-size: 12px;
	line-height: 1.35;
	word-break: break-word;
	white-space: normal;
}
</style>