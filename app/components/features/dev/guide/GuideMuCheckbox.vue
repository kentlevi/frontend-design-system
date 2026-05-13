<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuCheckbox</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Frontend Mu checkbox based on the admin API. It keeps the <code>variant</code> behavior
			and uses the same color tokens/visual styling as frontend <code>UiCheckbox</code>.
		</MuText>

		<MuHeading variant="6" weight="bold">Examples</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<MuCheckbox v-model="checked">Accept terms</MuCheckbox>
				<MuCheckbox v-model="checked_sm" size="sm">Small checkbox</MuCheckbox>
				<MuCheckbox v-model="checked_minus" variant="minus">Indeterminate style (minus)</MuCheckbox>
				<MuCheckbox :model-value="true" state="success" disabled>
					Disabled success
				</MuCheckbox>
				<MuCheckbox :model-value="false" state="error">Error state</MuCheckbox>
			</div>
			<MuText size="small">
				Checked value: <code>{{ checked }}</code>
			</MuText>
		</div>
	</div>
</template>

<script setup lang="ts">
import MuCheckbox from '~/components/base/MuCheckbox.vue';

const checked = ref(false);
const checked_sm = ref(true);
const checked_minus = ref(true);
</script>

<style scoped lang="scss">
.guide-demo-column {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>