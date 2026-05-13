<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuTab</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Single tab item for <code>MuTabs</code>. Supports button mode and link mode via <code>to</code> or <code>href</code>.
		</MuText>

		<MuHeading variant="6" weight="bold">States</MuHeading>
		<div class="guide-demo">
			<MuTabs v-model="demo_tab" class="guide-tab-row">
				<MuTab value="active"><span class="m-tab-label">Active</span></MuTab>
				<MuTab value="disabled" disabled><span class="m-tab-label">Disabled</span></MuTab>
			</MuTabs>
		</div>

		<MuHeading variant="6" weight="bold">Navigation Props</MuHeading>
		<div class="guide-demo">
			<MuTabs v-model="nav_tab" class="guide-tab-row">
				<MuTab value="internal" to="/kr/account/orders">
					<span class="m-tab-label">Internal (to)</span>
				</MuTab>
				<MuTab value="external" href="https://musticker.com" target="_blank" rel="nofollow">
					<span class="m-tab-label">External (href)</span>
				</MuTab>
			</MuTabs>
			<MuText size="small">Selected: <code>{{ nav_tab }}</code></MuText>
		</div>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuTab from '~/components/core/tab/MuTab.vue';
import MuTabs from '~/components/core/tab/MuTabs.vue';
import MuText from '~/components/base/MuText.vue';

const demo_tab = ref('active');
const nav_tab = ref('internal');
</script>

<style scoped lang="scss">
.guide-tab-row {
	border-bottom: 0;
	padding: 0;
}
</style>