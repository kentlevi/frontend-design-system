<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuRadioGroup</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Group wrapper for shared single-selection state. Set <code>v-model</code> and <code>name</code> once on the group.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic Group</MuHeading>
		<div class="guide-demo">
			<MuRadioGroup v-model="group_value" name="shipping-method">
				<div class="guide-demo-column">
					<MuRadio value="standard">Standard Shipping</MuRadio>
					<MuRadio value="express">Express Shipping</MuRadio>
					<MuRadio value="pickup">Store Pickup</MuRadio>
				</div>
			</MuRadioGroup>
			<MuText size="small">Selected: <code>{{ group_value }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Group-Level Props</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<MuText size="small" weight="semi-bold">Shared size = md</MuText>
				<MuRadioGroup v-model="group_size_value" name="size-group" size="md">
					<div class="guide-demo-column">
						<MuRadio value="email">Email</MuRadio>
						<MuRadio value="phone">Phone</MuRadio>
					</div>
				</MuRadioGroup>
			</div>

			<div class="guide-demo-column">
				<MuText size="small" weight="semi-bold">Disabled group</MuText>
				<MuRadioGroup v-model="group_disabled_value" name="disabled-group" disabled>
					<div class="guide-demo-column">
						<MuRadio value="yes">Yes</MuRadio>
						<MuRadio value="no">No</MuRadio>
					</div>
				</MuRadioGroup>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const group_value = ref('standard');
const group_size_value = ref('email');
const group_disabled_value = ref('yes');
</script>

<style scoped lang="scss">
.guide-demo-column {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>