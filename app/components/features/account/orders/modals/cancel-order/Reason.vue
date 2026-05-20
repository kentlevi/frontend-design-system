<template>
	<MuLinearWrapper direction="column" :gap="16">
		<MuText color="text-secondary">
			Help us improve by letting us know the reason for your cancellation. You can provide additional feedback if necessary.
		</MuText>

		<MuRadioGroup v-model="local_reason" name="cancellation-reason">
			<MuLinearWrapper direction="column" :gap="12">
				<MuRadio
					v-for="option in reason_options"
					:key="option.value"
					:value="option.value"
				>
					<MuText>{{ option.label }}</MuText>
				</MuRadio>
			</MuLinearWrapper>
		</MuRadioGroup>

		<UiTextarea v-model="local_feedback" placeholder="Enter reason here..."/>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuRadio from '~/components/base/MuRadio.vue';
import MuRadioGroup from '~/components/base/MuRadioGroup.vue';
import MuText from '~/components/base/MuText.vue';

const local_reason = defineModel<string>('reason', { default: '' })
const local_feedback = defineModel<string>('feedback', { default: '' })

const reason_options: { label: string; value: string }[] = [
	{ label: 'Incorrect Order Details', value: 'incorrect_details' },
	{ label: 'Issues With Payment', value: 'payment_issues' },
	{ label: 'Shipping Concerns', value: 'shipping_concerns' },
	{ label: 'Others', value: 'others' },
]
</script>

<style lang="scss" scoped></style>
