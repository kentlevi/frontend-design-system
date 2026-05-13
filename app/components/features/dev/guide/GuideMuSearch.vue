<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuSearch</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Search field component based on admin MuSearch API, implemented with frontend MuInput styling.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<MuSearch
					v-model="search_keyword"
					placeholder="Search orders..."
					class="guide-search"
				>
					<template #left>
						<UiIcon
							name="regular-search"
							:size="24"
							color="var(--text-primary)"
						/>
					</template>
				</MuSearch>
				<MuText size="small">Value: <code>{{ search_keyword || '(empty)' }}</code></MuText>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Clearable</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<MuSearch
					v-model="search_clearable"
					placeholder="Try typing then clear"
					clearable
					class="guide-search"
				>
					<template #left>
						<UiIcon
							name="regular-search"
							:size="24"
							color="var(--text-primary)"
						/>
					</template>
				</MuSearch>
				<MuText size="small">Value: <code>{{ search_clearable || '(empty)' }}</code></MuText>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuSearch from '~/components/core/search/MuSearch.vue';
import MuText from '~/components/base/MuText.vue';
import UiIcon from '~/components/ui/Icon.vue';

const search_keyword = ref('');
const search_clearable = ref('');
</script>

<style scoped lang="scss">
.guide-demo-inputs {
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-width: 400px;
}

.guide-search {
	border-radius: 14px;

	:deep(.mu-input) {
		border-radius: 14px;
	}
}
</style>