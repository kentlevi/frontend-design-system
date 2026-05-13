<script lang="ts" setup>
import MuInput from '~/components/base/MuInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useLoginCard } from '~/composables/features/account/orders/auth/login/useLoginCard';

const {
	translate,

	non_member_form,
	email_error,
	email_error_message,
	order_number_error,
	order_number_error_message
} = useLoginCard();
</script>

<template>
	<MuLinearWrapper direction="column" gap="16px">
		<MuLinearWrapper direction="column" gap="8px" width="100%">
			<MuLinearWrapper justify="space-between">
				<MuText weight="semi-bold">
					{{ translate('auth.login.email') }}
				</MuText>
				<MuText size="small" color="error">
					{{ email_error_message }}
				</MuText>
			</MuLinearWrapper>
			<MuInput
				:placeholder="translate('auth.login.enterEmail')"
				type="email"
				name="email"
				id="non-member-email"
				:has-error="email_error"
				v-model="non_member_form.email"
			/>
		</MuLinearWrapper>

		<MuLinearWrapper direction="column" gap="8px" width="100%">
			<MuLinearWrapper justify="space-between">
				<MuText weight="semi-bold">
					{{ translate('auth.login.orderNumber') }}
				</MuText>
				<MuText size="small" color="error">
					{{ order_number_error_message }}
				</MuText>
			</MuLinearWrapper>
			<MuInput
				:placeholder="translate('auth.login.enterOrderNumber')"
				type="text"
				name="order_number"
				id="non-member-order-number"
				:has-error="order_number_error"
				v-model="non_member_form.order_number"
			/>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>
