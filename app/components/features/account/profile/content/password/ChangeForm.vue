<script setup lang="ts">
defineProps<{
	currentPassword: string
	newPassword: string
	newPasswordConfirmation: string
	currentPasswordVisible: boolean
	newPasswordVisible: boolean
	newPasswordConfirmationVisible: boolean
	currentPasswordError: string
	pairPasswordError: string
	isChangePasswordEnabled: boolean
}>()

const emit = defineEmits<{
	(e: 'update:currentPassword', value: string): void
	(e: 'update:newPassword', value: string): void
	(e: 'update:newPasswordConfirmation', value: string): void
	(e: 'update:currentPasswordVisible', value: boolean): void
	(e: 'update:newPasswordVisible', value: boolean): void
	(e: 'update:newPasswordConfirmationVisible', value: boolean): void
	(e: 'update:currentPasswordError', value: string): void
	(e: 'clear-pair-errors'): void
	(e: 'change-password'): void
	(e: 'forgot-password'): void
}>()

const { t } = useI18n();
</script>

<template>
	<div class="account-profile-stack" data-testid="account-profile-password-form">
		<UiFormField :label="t('account.profile.currentPassword')" :error="currentPasswordError" :required="true">
			<template #default="{ inputId, describedBy }">
				<UiInput
					:id="inputId"
					:model-value="currentPassword"
					:type="currentPasswordVisible ? 'text' : 'password'"
					:aria-describedby="describedBy || undefined"
					:state="currentPasswordError ? 'error' : 'default'"
					:placeholder="t('account.profile.currentPasswordPlaceholder')"
					data-testid="account-profile-current-password"
					@update:model-value="emit('update:currentPassword', $event); emit('update:currentPasswordError', '')"
				>
					<template #icon-right>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="24"
							:no-hover="true"
							class="account-profile-password-toggle"
							:aria-label="t('auth.reset.togglePassword')"
							:sr-label="t('auth.reset.togglePassword')"
							icon-only
							:icon="currentPasswordVisible ? 'regular-eye' : 'regular-eye-slash'"
							:icon-size="24"
							@click="emit('update:currentPasswordVisible', !currentPasswordVisible)"
						/>
					</template>
				</UiInput>
			</template>
		</UiFormField>

		<UiFormField
			:label="t('account.profile.newPassword')"
			:error="pairPasswordError"
			:required="true"
			:hint="t('account.profile.passwordHint')"
		>
			<template #default="{ inputId, describedBy }">
				<UiInput
					:id="inputId"
					:model-value="newPassword"
					:type="newPasswordVisible ? 'text' : 'password'"
					:aria-describedby="describedBy || undefined"
					:state="pairPasswordError ? 'error' : 'default'"
					:placeholder="t('account.profile.newPasswordPlaceholder')"
					data-testid="account-profile-new-password"
					@update:model-value="emit('update:newPassword', $event); emit('clear-pair-errors')"
				>
					<template #icon-right>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="24"
							:no-hover="true"
							class="account-profile-password-toggle"
							:aria-label="t('auth.reset.togglePassword')"
							:sr-label="t('auth.reset.togglePassword')"
							icon-only
							:icon="newPasswordVisible ? 'regular-eye' : 'regular-eye-slash'"
							:icon-size="24"
							@click="emit('update:newPasswordVisible', !newPasswordVisible)"
						/>
					</template>
				</UiInput>
			</template>
		</UiFormField>

		<UiFormField :label="t('account.profile.confirmNewPassword')" :required="true">
			<template #default="{ inputId, describedBy }">
				<UiInput
					:id="inputId"
					:model-value="newPasswordConfirmation"
					:type="newPasswordConfirmationVisible ? 'text' : 'password'"
					:aria-describedby="describedBy || undefined"
					:state="pairPasswordError ? 'error' : 'default'"
					:placeholder="t('account.profile.confirmNewPasswordPlaceholder')"
					data-testid="account-profile-confirm-password"
					@update:model-value="emit('update:newPasswordConfirmation', $event); emit('clear-pair-errors')"
				>
					<template #icon-right>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="24"
							:no-hover="true"
							class="account-profile-password-toggle"
							:aria-label="t('auth.reset.toggleConfirmPassword')"
							:sr-label="t('auth.reset.toggleConfirmPassword')"
							icon-only
							:icon="newPasswordConfirmationVisible ? 'regular-eye' : 'regular-eye-slash'"
							:icon-size="24"
							@click="emit('update:newPasswordConfirmationVisible', !newPasswordConfirmationVisible)"
						/>
					</template>
				</UiInput>
			</template>
		</UiFormField>

		<div class="account-profile-inline-actions" data-testid="account-profile-password-actions">
			<UiButton
				variant="filled"
				tone="neutral"
				size="md"
				:disabled="!isChangePasswordEnabled"
				data-testid="account-profile-change-password-button"
				@click="emit('change-password')"
			>
				{{ t('account.profile.changePassword') }}
			</UiButton>
			<UiButton
				variant="ghost"
				tone="neutral"
				size="md"
				class="account-profile-forgot-password-link"
				label-class="account-profile-forgot-password-link-label"
				data-testid="account-profile-forgot-password"
				@click="emit('forgot-password')"
			>
				{{ t('account.profile.forgotPassword') }}
			</UiButton>
		</div>
	</div>
</template>

<style scoped lang="scss">
.account-profile-stack {
	display: flex;
	flex-direction: column;
	gap: 16px;

	.account-profile-inline-actions {
		display: flex;
		gap: 16px;
		align-items: center;
		justify-content: flex-end;

		.account-profile-forgot-password-link {
			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			text-decoration: none;
				&:hover {
					--btn-soft: var(--gray-20);
				}
			:deep(.account-profile-forgot-password-link-label) {
				color: inherit;
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
			}
		}
	}
}

.account-profile-muted {
	color: var(--text-secondary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
}
</style>
