<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const props = defineProps<{
	modelValue: boolean;
	password: string;
	passwordConfirmation: string;
	passwordError?: string;
	passwordVisible: boolean;
	passwordConfirmationVisible: boolean;
	isSubmitEnabled: boolean;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: boolean];
	'update:password': [value: string];
	'update:passwordConfirmation': [value: string];
	'update:passwordVisible': [value: boolean];
	'update:passwordConfirmationVisible': [value: boolean];
	'clear-errors': [];
	submit: [];
	close: [];
}>();

const { t } = useI18n();

function closeModal() {
	emit('update:modelValue', false);
	emit('close');
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		align="center"
		padding="0"
		gap="0"
		modal-class="account-profile-setup-password-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
		@close="emit('close')"
	>
		<section class="account-profile-setup-password-modal" data-testid="account-profile-setup-password-modal">
			<button
				type="button"
				class="account-profile-setup-password-modal-close"
				:aria-label="t('account.profile.closeSetupPasswordModal')"
				data-testid="account-profile-setup-password-modal-close"
				@click="closeModal"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>

			<MuLinearWrapper
				class="account-profile-setup-password-modal-header"
				direction="column"
				align="flex-start"
				:gap="24"
			>
				<UiLogo
					name="musticker"
					variant="mark"
					color="colored"
					:size="40"
					class="account-profile-setup-password-modal-logo"
				/>
				<div class="account-profile-setup-password-modal-copy">
					<MuHeading variant="3" weight="semi-bold" color="text-primary" class="account-profile-setup-password-modal-title">{{ t('account.profile.setupPasswordTitle') }}</MuHeading>
					<MuText color="text-secondary" class="account-profile-setup-password-modal-description">{{ t('account.profile.passwordHint') }}</MuText>
				</div>
			</MuLinearWrapper>

			<div class="account-profile-setup-password-modal-form">
				<div class="account-profile-setup-password-modal-fields">
					<UiFormField
						:label="t('account.profile.passwordLabel')"
						:error="props.passwordError"
						:required="true"
					>
						<template #default="{ inputId, describedBy }">
							<UiInput
								:id="inputId"
								:model-value="props.password"
								:type="props.passwordVisible ? 'text' : 'password'"
								:aria-describedby="describedBy || undefined"
								:state="props.passwordError ? 'error' : 'default'"
								:placeholder="t('account.profile.enterPassword')"
								data-testid="account-profile-setup-password-input"
								@update:model-value="emit('update:password', $event); emit('clear-errors')"
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
										:icon="props.passwordVisible ? 'regular-eye' : 'regular-eye-slash'"
										:icon-size="24"
										@click="emit('update:passwordVisible', !props.passwordVisible)"
									/>
								</template>
							</UiInput>
						</template>
					</UiFormField>

					<UiFormField
						:label="t('account.profile.confirmPassword')"
						:required="true"
					>
						<template #default="{ inputId, describedBy }">
							<UiInput
								:id="inputId"
								:model-value="props.passwordConfirmation"
								:type="props.passwordConfirmationVisible ? 'text' : 'password'"
								:aria-describedby="describedBy || undefined"
								:state="props.passwordError ? 'error' : 'default'"
								:placeholder="t('account.profile.confirmPasswordPlaceholder')"
								data-testid="account-profile-setup-password-confirm-input"
								@update:model-value="emit('update:passwordConfirmation', $event); emit('clear-errors')"
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
										:icon="props.passwordConfirmationVisible ? 'regular-eye' : 'regular-eye-slash'"
										:icon-size="24"
										@click="emit('update:passwordConfirmationVisible', !props.passwordConfirmationVisible)"
									/>
								</template>
							</UiInput>
						</template>
					</UiFormField>
				</div>

				<div class="account-profile-setup-password-modal-actions">
					<UiButton
						variant="filled"
						tone="neutral"
						size="lg"
						class="account-profile-setup-password-modal-confirm"
						data-testid="account-profile-setup-password-modal-confirm"
						@click="emit('submit')"
					>
						{{ t('account.profile.confirmSetupPassword') }}
					</UiButton>
				</div>
			</div>
		</section>
	</UiModal>
</template>

<style lang="scss">
.account-profile-setup-password-modal-shell {
	border-radius: 16px;
	overflow: hidden;
	max-width: 504px;
	width: 100%;

	.ui-modal-body {
		padding: 0;
	}
}

.account-profile-setup-password-modal {
	position: relative;
	padding: 24px 32px 32px;
	background: var(--contrast-light);
	display: flex;
	flex-direction: column;
	gap: 40px;

	&-close {
		position: absolute;
		top: 20px;
		right: 20px;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--text-primary);
		cursor: pointer;
	}

	&-copy {
		display: grid;
		gap: 8px;
	}

	&-fields {
		display: grid;
		gap: 20px;
	}

	&-form {
		display: grid;
		gap: 24px;
	}

	&-actions {
		display: flex;
	}

	&-confirm {
		width: 100%;

		&:disabled {
			background: var(--text-primary);
			color: var(--contrast-light);
			border-color: transparent;
			box-shadow: none;
			opacity: 0.4;
		}
	}
}
</style>
