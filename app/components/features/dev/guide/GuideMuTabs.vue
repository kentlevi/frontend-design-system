<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuTabs</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Container component for tab selection. Pair with <code>MuTab</code> items and bind with <code>v-model</code>.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<MuTabs v-model="selected_tab" class="guide-tabs">
				<MuTab value="orders">
					<UiIcon name="regular-package-open" :size="24" />
					<span class="m-tab-label">Orders</span>
				</MuTab>
				<MuTab value="coupons">
					<UiIcon name="regular-ticket" :size="24" />
					<span class="m-tab-label">Coupons</span>
				</MuTab>
				<MuTab value="points">
					<UiIcon name="regular-coin" :size="24" />
					<span class="m-tab-label">Points</span>
				</MuTab>
			</MuTabs>
			<MuText size="small">Selected: <code>{{ selected_tab }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Vertical</MuHeading>
		<div class="guide-demo">
			<MuTabs v-model="vertical_tab" direction="column" :gap="8" class="guide-tabs guide-tabs--vertical">
				<MuTab value="profile"><span class="m-tab-label">Profile</span></MuTab>
				<MuTab value="security"><span class="m-tab-label">Security</span></MuTab>
				<MuTab value="notifications"><span class="m-tab-label">Notifications</span></MuTab>
			</MuTabs>
			<MuText size="small">Selected: <code>{{ vertical_tab }}</code></MuText>
		</div>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuTab from '~/components/core/tab/MuTab.vue';
import MuTabs from '~/components/core/tab/MuTabs.vue';
import MuText from '~/components/base/MuText.vue';
import UiIcon from '~/components/ui/Icon.vue';

const selected_tab = ref('orders');
const vertical_tab = ref('profile');
</script>

<style scoped lang="scss">
.guide-tabs {
	border-bottom: 0;
	padding: 0;
}

.guide-tabs--vertical {
	max-width: 280px;
}
</style>