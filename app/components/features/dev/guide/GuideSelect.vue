<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiSelect</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Custom select menu with optional search and pinned option behavior.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<div class="guide-select-wrap">
				<UiSelect v-model="value" :options="options" placeholder="Choose a country" />
			</div>
			<MuText size="small">Selected: <code>{{ value }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Searchable</MuHeading>
		<div class="guide-demo">
			<div class="guide-select-wrap">
				<UiSelect
					v-model="search_value"
					:options="options"
					searchable
					placeholder="Search countries"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const value = ref<string | number | null>(null);
const search_value = ref<string | number | null>('jp');

const options = [
	{ label: 'United States', value: 'us' },
	{ label: 'Japan', value: 'jp' },
	{ label: 'Philippines', value: 'ph' },
	{ label: 'Canada', value: 'ca' },
];
</script>

<style scoped lang="scss">
.guide-select-wrap {
	max-width: 360px;
}
</style>