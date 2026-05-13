<script lang="ts" setup>
import MuInput from '~/components/base/MuInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useAlreadyRegisteredModal } from '~/composables/features/auth/useAlreadyRegisteredModal';

const {
	translate,

	is_open,
	member_form,
	show_password,
	email_error,
	email_error_message,
	password_error,
	password_error_message,
	is_submitting,

	togglePassword,
	setModalOpen,
	closeModal,
	continueLogin,
	openForgotPassword
} = useAlreadyRegisteredModal();
</script>

<template>
	<UiModal
		:model-value="is_open"
		align="center"
		width="504px"
		modal-class="auth-already-registered-modal-shell"
		@update:model-value="setModalOpen"
	>
		<MuLinearWrapper
			class="auth-already-registered-modal"
			direction="column"
			gap="32px"
		>
			<UiButton
				variant="ghost"
				tone="neutral"
				size="sm"
				class="auth-already-registered-close"
				:aria-label="translate('auth.register.emailAlreadyRegistered.closeModal')"
				:sr-label="translate('auth.register.emailAlreadyRegistered.closeModal')"
				icon-only
				:no-hover="true"
				icon="regular-times"
				:icon-size="24"
				@click="closeModal"
			/>

			<MuLinearWrapper direction="row" gap="16px" align="flex-start">
				<img
					src="/icons/custom/account/email-registered.svg"
					alt=""
					class="auth-already-registered-icon"
				>
				<MuLinearWrapper direction="column" gap="4px">
					<MuText size="xlarge" weight="bold">
						{{ translate('auth.register.emailAlreadyRegistered.title') }}
					</MuText>
					<MuText size="small" color="var(--text-secondary)">
						{{ translate('auth.register.emailAlreadyRegistered.description.prefix') }}
						<strong class="auth-already-registered-email">{{ member_form.email }}</strong>
						{{ translate('auth.register.emailAlreadyRegistered.description.suffix') }}
					</MuText>
				</MuLinearWrapper>
			</MuLinearWrapper>

			<MuLinearWrapper direction="column" gap="8px">
				<MuLinearWrapper direction="column" gap="8px" width="100%">
					<MuLinearWrapper justify="space-between">
						<MuText weight="semi-bold">
							{{ translate('auth.register.emailAlreadyRegistered.password') }}
						</MuText>
						<MuText size="small" color="error">
							{{ email_error_message || password_error_message }}
						</MuText>
					</MuLinearWrapper>
					<MuInput
						id="already-registered-password"
						v-model="member_form.password"
						:placeholder="translate('auth.register.emailAlreadyRegistered.enterPassword')"
						:type="show_password ? 'text' : 'password'"
						name="already-registered-password"
						:has-error="email_error || password_error"
					>
						<template #inner-right>
							<UiButton
								variant="ghost"
								tone="neutral"
								size="sm"
								class="auth-already-registered-password-toggle"
								:aria-label="translate('auth.register.emailAlreadyRegistered.togglePassword')"
								:sr-label="translate('auth.register.emailAlreadyRegistered.togglePassword')"
								icon-only
								:no-hover="true"
								:icon="show_password ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="24"
								@click="togglePassword"
							/>
						</template>
					</MuInput>
				</MuLinearWrapper>

				<UiButton
					variant="ghost"
					tone="neutral"
					size="sm"
					class="auth-already-registered-forgot"
					:no-hover="true"
					@click="openForgotPassword"
				>
					{{ translate('auth.register.emailAlreadyRegistered.forgotPassword') }}
				</UiButton>
			</MuLinearWrapper>
		</MuLinearWrapper>

		<template #footer>
			<MuLinearWrapper width="100%">
				<UiButton
					tone="neutral"
					size="lg"
					width="100%"
					:disabled="is_submitting"
					@click="continueLogin"
				>
					{{ translate('auth.register.emailAlreadyRegistered.continue') }}
				</UiButton>
			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<style lang="scss">
.auth-already-registered-modal {
	position: relative;

	.auth-already-registered-close {
		position: absolute;
		top: 0;
		right: 0;
	}

	.auth-already-registered-icon {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
	}

	.auth-already-registered-email {
		color: var(--amber-60);
		font-weight: var(--font-weight-bold);
	}

	.auth-already-registered-forgot {
		align-self: center;
	}
}
</style>