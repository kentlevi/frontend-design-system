<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import { useProfilePasswordChangeForm } from '~/composables/account/profile/useProfilePasswordChangeForm';
import { useProfilePasswordChangeFormUI } from '~/composables/account/profile/useProfilePasswordChangeFormUI';

const {
	current_password,
	new_password,
	new_password_confirmation,
	current_password_error,
	pair_password_error,
	current_password_visible,
	new_password_visible,
	new_password_confirmation_visible,
	is_change_password_enabled,

	onCurrentPasswordInput,
	onNewPasswordInput,
	onNewPasswordConfirmationInput,
	onChangePassword,
	sendForgotPasswordEmail,
} = useProfilePasswordChangeForm()

const { translate } = useProfilePasswordChangeFormUI()
</script>

<template>
	<MuLinearWrapper class="account-profile-stack" data-testid="account-profile-password-form" direction="column" :gap="16">
		<UiFormField :label="translate('account.profile.currentPassword')" :error="current_password_error" :required="true">
			<template #default="{ inputId, describedBy }">
				<UiInput
					:id="inputId"
					:model-value="current_password"
					:type="current_password_visible ? 'text' : 'password'"
					:aria-describedby="describedBy || undefined"
					:state="current_password_error ? 'error' : 'default'"
					:placeholder="translate('account.profile.currentPasswordPlaceholder')"
					data-testid="account-profile-current-password"
					@update:model-value="onCurrentPasswordInput"
				>
					<template #icon-right>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="24"
							:no-hover="true"
							class="account-profile-password-toggle"
							:aria-label="translate('auth.reset.togglePassword')"
							:sr-label="translate('auth.reset.togglePassword')"
							icon-only
							:icon="current_password_visible ? 'regular-eye' : 'regular-eye-slash'"
							:icon-size="24"
							@click="current_password_visible = !current_password_visible"
						/>
					</template>
				</UiInput>
			</template>
		</UiFormField>

		<UiFormField
			:label="translate('account.profile.newPassword')"
			:error="pair_password_error"
			:required="true"
			:hint="translate('account.profile.passwordHint')"
		>
			<template #default="{ inputId, describedBy }">
				<UiInput
					:id="inputId"
					:model-value="new_password"
					:type="new_password_visible ? 'text' : 'password'"
					:aria-describedby="describedBy || undefined"
					:state="pair_password_error ? 'error' : 'default'"
					:placeholder="translate('account.profile.newPasswordPlaceholder')"
					data-testid="account-profile-new-password"
					@update:model-value="onNewPasswordInput"
				>
					<template #icon-right>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="24"
							:no-hover="true"
							class="account-profile-password-toggle"
							:aria-label="translate('auth.reset.togglePassword')"
							:sr-label="translate('auth.reset.togglePassword')"
							icon-only
							:icon="new_password_visible ? 'regular-eye' : 'regular-eye-slash'"
							:icon-size="24"
							@click="new_password_visible = !new_password_visible"
						/>
					</template>
				</UiInput>
			</template>
		</UiFormField>

		<UiFormField :label="translate('account.profile.confirmNewPassword')" :required="true">
			<template #default="{ inputId, describedBy }">
				<UiInput
					:id="inputId"
					:model-value="new_password_confirmation"
					:type="new_password_confirmation_visible ? 'text' : 'password'"
					:aria-describedby="describedBy || undefined"
					:state="pair_password_error ? 'error' : 'default'"
					:placeholder="translate('account.profile.confirmNewPasswordPlaceholder')"
					data-testid="account-profile-confirm-password"
					@update:model-value="onNewPasswordConfirmationInput"
				>
					<template #icon-right>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="24"
							:no-hover="true"
							class="account-profile-password-toggle"
							:aria-label="translate('auth.reset.toggleConfirmPassword')"
							:sr-label="translate('auth.reset.toggleConfirmPassword')"
							icon-only
							:icon="new_password_confirmation_visible ? 'regular-eye' : 'regular-eye-slash'"
							:icon-size="24"
							@click="new_password_confirmation_visible = !new_password_confirmation_visible"
						/>
					</template>
				</UiInput>
			</template>
		</UiFormField>

		<MuLinearWrapper
			class="account-profile-inline-actions"
			data-testid="account-profile-password-actions"
			align="center"
			justify="flex-end"
			:gap="16"
		>
			<UiButton
				variant="filled"
				tone="neutral"
				size="md"
				:disabled="!is_change_password_enabled"
				data-testid="account-profile-change-password-button"
				@click="onChangePassword"
			>
				{{ translate('account.profile.changePassword') }}
			</UiButton>
			<UiButton
				variant="ghost"
				tone="neutral"
				size="md"
				class="account-profile-forgot-password-link"
				label-class="account-profile-forgot-password-link-label"
				data-testid="account-profile-forgot-password"
				@click="sendForgotPasswordEmail"
			>
				{{ translate('account.profile.forgotPassword') }}
			</UiButton>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-profile-stack {
	.account-profile-inline-actions {
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