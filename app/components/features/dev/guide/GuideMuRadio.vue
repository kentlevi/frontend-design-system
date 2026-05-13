<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuRadio</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Base radio option component. Use with standalone <code>v-model</code> or inside <code>MuRadioGroup</code>.
		</MuText>

		<MuHeading variant="6" weight="bold">Standalone</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<MuRadio v-model="standalone_value" name="standalone-plan" value="starter">
					Starter
				</MuRadio>
				<MuRadio v-model="standalone_value" name="standalone-plan" value="pro">
					Pro
				</MuRadio>
				<MuRadio v-model="standalone_value" name="standalone-plan" value="enterprise">
					Enterprise
				</MuRadio>
			</div>
			<MuText size="small">Selected: <code>{{ standalone_value }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Check Variant</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<MuRadio v-model="check_variant_value" name="check-plan" value="basic" variant="check">
					Basic
				</MuRadio>
				<MuRadio v-model="check_variant_value" name="check-plan" value="premium" variant="check">
					Premium
				</MuRadio>
				<MuRadio v-model="check_variant_value" name="check-plan" value="vip" variant="check" disabled>
					VIP (disabled)
				</MuRadio>
			</div>
			<MuText size="small">Selected: <code>{{ check_variant_value }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Sizes</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<MuRadio v-model="size_value_sm" name="size-sm" value="sms" size="sm">
					Small (sm)
				</MuRadio>
				<MuRadio v-model="size_value_md" name="size-md" value="sms" size="md">
					Medium (md)
				</MuRadio>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const standalone_value = ref('starter');
const check_variant_value = ref('basic');
const size_value_sm = ref('sms');
const size_value_md = ref('sms');
</script>

<style scoped lang="scss">
.guide-demo-column {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>