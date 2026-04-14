<script setup lang="ts">
import { useAuthLoginNonMemberForm } from '@/composables/auth/login/useAuthLoginNonMemberForm'

const {
	translate,
	non_member_email,
	non_member_order_number,
	non_member_email_error,
	non_member_email_has_error,
	non_member_order_error,
	hide_order_number,
	setNonMemberEmail,
	setNonMemberOrderNumber,
} = useAuthLoginNonMemberForm()
</script>

<template>
	<div class="auth-login-form" data-testid="auth-login-non-member-form">
		<div class="auth-login-inputs">
			<UiFormField
				class="auth-login-field"
				:label="translate('auth.login.email')"
				:error="non_member_email_error"
				error-test-id="auth-login-non-member-email-error"
				:required="true"
				head-class="auth-login-field-head"
				label-class="auth-login-field-label"
				label-text-class="auth-login-field-label-text"
				error-class="auth-login-field-error"
			>
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						class="auth-login-input"
						type="email"
						size="md"
						:state="
							non_member_email_error || non_member_email_has_error
								? 'error'
								: 'default'
						"
						:aria-invalid="
							non_member_email_error || non_member_email_has_error
								? 'true'
								: 'false'
						"
						:aria-describedby="describedBy || undefined"
						:placeholder="translate('auth.login.enterEmail')"
						:model-value="non_member_email"
						data-testid="auth-login-non-member-email-input"
						@update:model-value="setNonMemberEmail"
					/>
				</template>
			</UiFormField>

			<UiFormField
				v-if="!hide_order_number"
				class="auth-login-field"
				:label="translate('auth.login.orderNumber')"
				:error="non_member_order_error"
				error-test-id="auth-login-non-member-order-number-error"
				:required="true"
				head-class="auth-login-field-head"
				label-class="auth-login-field-label"
				label-text-class="auth-login-field-label-text"
				error-class="auth-login-field-error"
			>
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						class="auth-login-input"
						type="text"
						size="md"
						:state="non_member_order_error ? 'error' : 'default'"
						:aria-invalid="non_member_order_error ? 'true' : 'false'"
						:aria-describedby="describedBy || undefined"
						:placeholder="translate('auth.login.enterOrderNumber')"
						:model-value="non_member_order_number"
						data-testid="auth-login-non-member-order-number-input"
						@update:model-value="setNonMemberOrderNumber"
					/>
				</template>
			</UiFormField>
		</div>
	</div>
</template>