<script lang="ts" setup>
import MuInput from '~/components/base/MuInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import Checkbox from '~/components/ui/Checkbox.vue';
import { useResetPassword } from '~/composables/auth/useResetPassword';
import { useLoginCard } from '~/composables/features/account/orders/auth/login/useLoginCard';

const {
	translate,

	show_password,
	togglePassword,

	member_form,
    email_error,
    email_error_message,
    password_error,
    password_error_message
} = useLoginCard();

const { handleModalValueChange } = useResetPassword();
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
				id="email"
                :has-error="email_error"
				v-model="member_form.email"
			/>
		</MuLinearWrapper>

		<MuLinearWrapper direction="column" gap="8px" width="100%">
            <MuLinearWrapper justify="space-between">
				<MuText weight="semi-bold">
					{{ translate('auth.login.password') }}
				</MuText>
				<MuText size="small" color="error">
					{{ password_error_message }}
				</MuText>
			</MuLinearWrapper>
			<MuInput
				:placeholder="translate('auth.login.enterPassword')"
				:type="show_password ? 'text' : 'password'"
				name="password"
				id="password"
                :has-error="password_error"
				v-model="member_form.password"
			>
				<template #inner-right>
					<UiButton
						variant="ghost"
						tone="neutral"
						size="sm"
						class="auth-login-password-toggle"
						:aria-label="translate('auth.login.togglePassword')"
						data-testid="auth-login-member-password-toggle-button"
						:sr-label="translate('auth.login.togglePassword')"
						icon-only
						:icon="
							show_password ? 'regular-eye' : 'regular-eye-slash'
						"
						:icon-size="24"
						@click="togglePassword"
					/>
				</template>
			</MuInput>
		</MuLinearWrapper>

		<MuLinearWrapper justify="space-between">
			<MuLinearWrapper direction="row" gap="8px" width="100%">
				<Checkbox v-model="member_form.remember_me" />
				{{ translate('auth.login.keepSignedIn') }}
			</MuLinearWrapper>

			<UiButton
				variant="ghost"
				tone="neutral"
				size="sm"
				class="auth-login-link-button"
				label-class="auth-login-link-button-label"
				data-testid="auth-login-member-forgot-password-button"
				:no-hover="true"
				@click="handleModalValueChange(true)"
			>
				{{ translate('auth.login.forgotPassword') }}
			</UiButton>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style lang="scss">
.auth-login-input-error {
    border-color: var(--error) !important;
}
</style>