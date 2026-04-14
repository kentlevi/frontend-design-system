<script setup lang="ts">
const { t } = useI18n();

defineProps<{
	email: string;
	orderNumber: string;
	emailError?: string;
	emailHasError?: boolean;
	orderError?: string;
	hideOrderNumber?: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:email', value: string): void;
	(e: 'update:order-number', value: string): void;
}>();
</script>

<template>
	<div class="auth-login-form" data-testid="auth-login-non-member-form">
		<div class="auth-login-inputs">
			<UiFormField
				class="auth-login-field"
				:label="t('auth.login.email')"
				:error="emailError"
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
						:state="emailError || emailHasError ? 'error' : 'default'"
						:aria-invalid="emailError || emailHasError ? 'true' : 'false'"
						:aria-describedby="describedBy || undefined"
						:placeholder="t('auth.login.enterEmail')"
						:model-value="email"
						data-testid="auth-login-non-member-email-input"
						@update:model-value="emit('update:email', $event)"
					/>
				</template>
			</UiFormField>

			<UiFormField
				v-if="!hideOrderNumber"
				class="auth-login-field"
				:label="t('auth.login.orderNumber')"
				:error="orderError"
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
						:state="orderError ? 'error' : 'default'"
						:aria-invalid="orderError ? 'true' : 'false'"
						:aria-describedby="describedBy || undefined"
						:placeholder="t('auth.login.enterOrderNumber')"
						:model-value="orderNumber"
						data-testid="auth-login-non-member-order-number-input"
						@update:model-value="emit('update:order-number', $event)"
					/>
				</template>
			</UiFormField>
		</div>
	</div>
</template>