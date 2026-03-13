<script setup lang="ts">
const props = withDefaults(defineProps<{
	modelValue: boolean;
	email: string;
	password: string;
	passwordError?: string;
	passwordVisible?: boolean;
}>(), {
	passwordError: '',
	passwordVisible: false,
});

const emit = defineEmits<{
	'update:modelValue': [value: boolean];
	'update:password': [value: string];
	'update:passwordVisible': [value: boolean];
	continue: [];
	'forgotPassword': [];
}>();

function closeModal() {
	emit('update:modelValue', false);
}

function togglePasswordVisibility() {
	emit('update:passwordVisible', !props.passwordVisible);
}

function openForgotPassword() {
	emit('forgotPassword');
}
</script>

<template>
	<UiModal
		:model-value="modelValue"
		align="center"
		width="504px"
		padding="0"
		gap="0"
		modal-class="auth-email-registered-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<section class="auth-email-registered-modal" data-testid="auth-email-registered-modal">
			<button
				type="button"
				class="auth-email-registered-modal-close"
				aria-label="Close email already registered modal"
				data-testid="auth-email-registered-modal-close"
				@click="closeModal"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>

			<div class="auth-email-registered-modal-copy">
				<div class="auth-email-registered-modal-icon-wrap">
					<img
						src="/icons/custom/account/email-registered.svg"
						alt=""
						class="auth-email-registered-modal-icon"
					>
				</div>
				<div class="auth-email-registered-modal-text-wrap">
					<h3 class="auth-email-registered-modal-title">Email already registered.</h3>
					<p class="auth-email-registered-modal-text">
						The email address <strong class="change-strong">{{ email }}</strong> is already registered in our system. Please enter your password to continue.
					</p>
				</div>
			</div>

			<div class="auth-email-registered-modal-form">
				<div class="auth-email-registered-modal-body">
					<UiFormField
						class="auth-email-registered-field"
						head-class="auth-email-registered-field-head"
						label-class="auth-email-registered-field-label"
						label-text-class="auth-email-registered-field-label-text"
						error-class="auth-email-registered-field-error"
						label="Password"
						:error="passwordError"
					>
						<UiInput
							:model-value="password"
							:type="passwordVisible ? 'text' : 'password'"
							size="md"
							class="auth-email-registered-input"
							:state="passwordError ? 'error' : 'default'"
							placeholder="Enter Password"
							data-testid="auth-email-registered-password-input"
							@update:model-value="emit('update:password', $event)"
						>
							<template #icon-right>
								<UiButton
									variant="ghost"
									tone="neutral"
									size="sm"
									class="auth-email-registered-password-toggle"
									aria-label="Toggle password visibility"
									sr-label="Toggle password visibility"
									icon-only
									:no-hover="true"
									:icon="passwordVisible ? 'regular-eye' : 'regular-eye-slash'"
									:icon-size="24"
									@click="togglePasswordVisibility"
								/>
							</template>
						</UiInput>
					</UiFormField>

					<button
						type="button"
						class="auth-email-registered-forgot-link"
						data-testid="auth-email-registered-forgot-link"
						@click="openForgotPassword"
					>
						Forgot Password?
					</button>
				</div>

				<div class="auth-email-registered-modal-actions">
					<UiButton
						type="button"
						variant="filled"
						tone="neutral"
						size="md"
						class="auth-email-registered-modal-continue"
						data-testid="auth-email-registered-modal-continue"
						@click="emit('continue')"
					>
						Continue
					</UiButton>
				</div>
			</div>
		</section>
	</UiModal>
</template>

<style lang="scss">
.auth-email-registered-modal {
	position: relative;
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	gap: 32px;
	width: 100%;
	padding: 40px;

	.auth-email-registered-modal-close {
		position: absolute;
		top: 24px;
		right: 24px;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--text-primary);
		cursor: pointer;
	}

	.auth-email-registered-modal-copy {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		align-items: start;
		column-gap: 16px;

		.auth-email-registered-modal-icon-wrap {
			display: grid;
			place-items: center;
			width: 48px;
			height: 48px;

			.auth-email-registered-modal-icon {
				display: block;
				width: 48px;
				height: 48px;
			}
		}

		.auth-email-registered-modal-text-wrap {
			display: flex;
			flex-direction: column;
			gap: 4px;

			.auth-email-registered-modal-title {
				color: var(--text-primary);
				font-size: var(--type-size-400);
				line-height: var(--type-line-400);
				font-weight: var(--font-weight-bold);
			}

			.auth-email-registered-modal-text {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);

				.change-strong {
					color: var(--amber-60);
					font-weight: var(--font-weight-bold);
				}
			}
		}
	}

	.auth-email-registered-modal-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		.auth-email-registered-field {
			.auth-email-registered-field-head {
				.auth-email-registered-field-label {
					color: var(--text-primary);
					font-weight: var(--font-weight-semibold);
				}
			}
		}
	}

	.auth-email-registered-modal-form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.auth-email-registered-forgot-link {
		align-self: center;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--text-primary);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
	}

	.auth-email-registered-modal-actions {
		display: flex;
	}

	.auth-email-registered-modal-continue {
		width: 100%;
		min-height: 48px;
		border-radius: 18px;
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
	}
}

:global(.auth-email-registered-modal-shell) {
	border-radius: 16px;
	overflow: hidden;
	max-width: 504px;
}
</style>