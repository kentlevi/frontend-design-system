<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import UiTooltip from '@/components/ui/Tooltip.vue';
import AuthEmailAlreadyRegisteredModal from '@/components/auth/shared/AuthEmailAlreadyRegisteredModal.vue';
import AuthLoginForgotPasswordModal from '@/components/auth/login/AuthLoginForgotPasswordModal.vue';
import { useRegisterForm } from '~/composables/auth/register/useRegisterForm';
import { useAuthRegisterCard } from '~/composables/auth/register/useAuthRegisterCard';
import { useCountry } from '~/composables/app/country/useCountry';
import { registerRewardPoints } from '~/data/auth/register';
import { resolvePostLoginRedirect } from '~/utils/auth/redirect';
import { useRoute } from 'vue-router';
import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding';
import { loginMemberUser } from '~/services/auth/auth.service';

const route = useRoute();
const { t: translate } = useI18n();
const { withCountry } = useCountry();

const props = withDefaults(defineProps<{
	showCloseButton?: boolean;
	loginAsAction?: boolean;
}>(), {
	showCloseButton: false,
	loginAsAction: false,
});

const emit = defineEmits<{
	(e: 'close'): void;
	(e: 'open-login'): void;
}>();

const {
	first_name,
	last_name,
	email,
	password,
	show_password,
	agree_terms,
	opt_in_promos,
	first_name_error,
	email_error,
	password_error,
	terms_error,
	is_submitting,
	verification_email,
	verification_code,
	verification_error,
	resend_limit_reached,
	resend_cooldown_remaining,
	is_verifying,
	is_verification_modal_open,
	submitRegister,
	submitVerification,
	resendVerification,
} = useRegisterForm();

const {
	terms_error_popover_open,
	terms_error_icon_strong,
	terms_error_ref,
	toggleTermsErrorPopover,
	onTermsErrorHoverStart,
	onTermsErrorHoverEnd,
} = useAuthRegisterCard({
	terms_error,
	agree_terms,
});

const post_login_redirect = computed(() =>
	resolvePostLoginRedirect(getRedirectCandidate(), withCountry)
);

const is_email_already_registered_modal_open = ref(false);
const is_registered_email_forgot_password_modal_open = ref(false);
const should_restore_registered_email_modal = ref(false);
const registered_email_password = ref('');
const registered_email_password_error = ref('');
const registered_email_password_visible = ref(false);

const email_taken_message = computed(() => translate('auth.register.validation.emailTaken'));
const registered_email_credentials_mismatch_message = computed(() => translate('auth.login.validation.credentialsMismatch'));
const is_email_taken_error = computed(() => email_error.value === email_taken_message.value);
const visible_email_error = computed(() => (is_email_taken_error.value ? '' : email_error.value));

function getRedirectCandidate() {
	const query_redirect = Array.isArray(route.query.redirect)
		? route.query.redirect[0]
		: route.query.redirect;
	if (query_redirect) return query_redirect;
	if (!import.meta.client) return null;
	return window.history.state?.back ?? null;
}

function closeEmailAlreadyRegisteredModal() {
	is_email_already_registered_modal_open.value = false;
	registered_email_password.value = '';
	registered_email_password_error.value = '';
	registered_email_password_visible.value = false;
}

async function continueWithRegisteredEmail() {
	if (!registered_email_password.value.trim()) {
		registered_email_password_error.value = translate('auth.register.validation.fieldBlank');
		return;
	}

	const response = await loginMemberUser({
		email: email.value,
		password: registered_email_password.value,
		remember_me: false,
	});

	if (!response.success) {
		registered_email_password_error.value = registered_email_credentials_mismatch_message.value;
		return;
	}

	if (import.meta.client) {
		window.localStorage.setItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY, '1');
		window.localStorage.removeItem(GUEST_LOGIN_TOAST_PENDING_KEY);
		window.dispatchEvent(new CustomEvent(LOGIN_SUCCESS_TOAST_TRIGGER_EVENT));
	}

	return await navigateTo(post_login_redirect.value);
}

async function handleSubmitVerification() {
	const response = await submitVerification();
	if (!response?.success) return;

	if (props.loginAsAction) {
		emit('close');
	}
}

function onRegisteredEmailPasswordInput(value: string) {
	registered_email_password.value = value;
	registered_email_password_error.value = '';
}

function openRegisteredEmailForgotPasswordModal() {
	should_restore_registered_email_modal.value = true;
	is_email_already_registered_modal_open.value = false;
	is_registered_email_forgot_password_modal_open.value = true;
}

function onRegisteredEmailForgotPasswordModalChange(value: boolean) {
	is_registered_email_forgot_password_modal_open.value = value;

	if (!value && should_restore_registered_email_modal.value) {
		void restoreRegisteredEmailModal();
	}
}

async function restoreRegisteredEmailModal() {
	is_registered_email_forgot_password_modal_open.value = false;
	should_restore_registered_email_modal.value = false;
	await nextTick();
	is_email_already_registered_modal_open.value = true;
}

watch(is_email_taken_error, (is_taken) => {
	if (is_taken && email.value.trim()) {
		is_email_already_registered_modal_open.value = true;
		registered_email_password.value = '';
		registered_email_password_error.value = '';
		registered_email_password_visible.value = false;
	}

	if (!is_taken && is_email_already_registered_modal_open.value) {
		closeEmailAlreadyRegisteredModal();
	}
});
</script>

<template>
	<div class="auth-register-card-shell">
		<UiLoadingOverlay
			:visible="is_submitting"
			:label="translate('auth.register.createAccount')"
			test-id="auth-register-loading-overlay"
			variant="modal"
			position="absolute"
		/>

		<div class="auth-register-card" data-testid="auth-register-card">
			<div v-if="props.showCloseButton" class="auth-register-card-close-wrap">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="auth-register-card-close"
					:aria-label="translate('auth.register.closeModal')"
					@click="emit('close')"
				>
					<UiIcon
						name="regular-times"
						:size="24"
						color="#000000"
					/>
				</UiButton>
			</div>

			<div class="auth-register-head">
				<UiLogo
					name="musticker"
					variant="mark"
					color="colored"
					:size="40"
					class="auth-register-head-logo"
				/>
				<h1 class="auth-register-title">
					{{ translate('auth.register.title') }}
				</h1>
				<p class="auth-register-subtitle">
					{{ translate('auth.register.subtitle', { points: registerRewardPoints }) }}
				</p>
			</div>

			<div class="auth-register-grid">
				<UiFormField
					class="auth-register-field"
					:label="translate('auth.register.firstName')"
					:error="first_name_error"
					head-class="auth-register-field-head"
					label-class="auth-register-field-label"
					label-text-class="auth-register-field-label-text"
					error-class="auth-register-field-error"
				>
					<UiInput
						v-model="first_name"
						type="text"
						size="md"
						class="auth-register-input"
						:state="first_name_error ? 'error' : 'default'"
						:placeholder="translate('auth.register.enterFirstName')"
						data-testid="auth-register-first-name-input"
					/>
				</UiFormField>

				<UiFormField
					class="auth-register-field"
					:label="translate('auth.register.lastNameOptionalLabel')"
					head-class="auth-register-field-head"
					label-class="auth-register-field-label"
					label-text-class="auth-register-field-label-text"
					error-class="auth-register-field-error"
				>
					<UiInput
						v-model="last_name"
						type="text"
						size="md"
						class="auth-register-input"
						:placeholder="translate('auth.register.enterLastName')"
						data-testid="auth-register-last-name-input"
					/>
				</UiFormField>
			</div>

			<UiFormField
				class="auth-register-field"
				:label="translate('auth.register.email')"
				:error="visible_email_error"
				head-class="auth-register-field-head"
				label-class="auth-register-field-label"
				label-text-class="auth-register-field-label-text"
				error-class="auth-register-field-error"
			>
				<UiInput
					v-model="email"
					type="email"
					size="md"
					class="auth-register-input"
					:state="visible_email_error ? 'error' : 'default'"
					:placeholder="translate('auth.register.enterEmail')"
					data-testid="auth-register-email-input"
				/>
			</UiFormField>

			<UiFormField
				class="auth-register-field"
				:label="translate('auth.register.password')"
				:error="password_error"
				head-class="auth-register-field-head"
				label-class="auth-register-field-label"
				label-text-class="auth-register-field-label-text"
				error-class="auth-register-field-error"
			>
				<div class="auth-register-password-wrap">
					<UiInput
						v-model="password"
						:type="show_password ? 'text' : 'password'"
						size="md"
						class="auth-register-input"
						:state="password_error ? 'error' : 'default'"
						:placeholder="translate('auth.register.enterPassword')"
						data-testid="auth-register-password-input"
					>
						<template #icon-right>
							<UiButton
								variant="ghost"
								tone="neutral"
								size="sm"
								class="auth-register-password-toggle"
								:aria-label="translate('auth.login.togglePassword')"
								data-testid="auth-register-password-toggle"
								:sr-label="translate('auth.login.togglePassword')"
								icon-only
								:icon="show_password ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="24"
								@click="show_password = !show_password"
							/>
						</template>
					</UiInput>
				</div>
				<template #hint>
					<p class="auth-register-hint">
						{{ translate('auth.register.passwordHint') }}
					</p>
				</template>
			</UiFormField>

			<div class="auth-register-check-row">
				<UiCheckbox
					v-model="agree_terms"
					class="auth-register-check"
					:state="terms_error && !agree_terms ? 'error' : 'default'"
					data-testid="auth-register-agree-terms"
				>
					<span class="auth-register-check-text">
						{{ translate('auth.register.agreePrefix') }}
						<NuxtLink :to="withCountry('/terms-of-use')" class="auth-register-check-link" data-testid="auth-register-terms-link">{{ translate('auth.register.terms') }}</NuxtLink>
						{{ translate('auth.register.and') }}
						<NuxtLink :to="withCountry('/privacy-policy')" class="auth-register-check-link" data-testid="auth-register-privacy-link">{{ translate('auth.register.privacy') }}</NuxtLink>
						.
					</span>
				</UiCheckbox>
				<div
					v-if="terms_error && !agree_terms"
					ref="terms_error_ref"
					class="auth-register-terms-error"
					data-testid="auth-register-terms-error"
					@mouseenter="onTermsErrorHoverStart"
					@mouseleave="onTermsErrorHoverEnd"
				>
					<UiTooltip
						:open="terms_error_popover_open"
						side="right"
						mobile-side="left"
						tone="danger"
						:offset="10"
						:slide-distance="36"
						content-testid="auth-register-terms-error-popover"
						class="auth-register-terms-error-tooltip"
						content-class="auth-register-terms-error-tooltip-content"
						content-width="max-content"
						content-max-width="min(320px, calc(100vw - 32px))"
					>
						<template #trigger>
							<UiButton
								variant="ghost"
								tone="danger"
								size="sm"
								class="auth-register-terms-error-button"
								:aria-expanded="terms_error_popover_open"
								aria-haspopup="dialog"
								data-testid="auth-register-terms-error-button"
								:sr-label="translate('auth.register.termsErrorInfo')"
								icon-only
								:icon="terms_error_icon_strong ? 'strong-info-circle' : 'regular-info-circle'"
								:icon-size="24"
								@click="toggleTermsErrorPopover"
								@focus="onTermsErrorHoverStart"
							/>
						</template>

						<UiIcon
							name="strong-exclamation-triangle"
							:size="24"
							color="var(--contrast-light)"
							class="auth-register-terms-error-popover-icon"
						/>
						<span>{{ terms_error }}</span>
					</UiTooltip>
				</div>
			</div>

			<UiCheckbox v-model="opt_in_promos" class="auth-register-check" data-testid="auth-register-opt-in-promos">
				<span class="auth-register-check-text">{{ translate('auth.register.promoOptIn') }}</span>
			</UiCheckbox>

			<UiButton
				variant="filled"
				tone="neutral"
				size="lg"
				class="auth-register-submit"
				data-testid="auth-register-submit"
				@click="submitRegister"
			>
				{{ translate('auth.register.createAccount') }}
			</UiButton>

			<p class="auth-register-login">
				{{ translate('auth.register.alreadyMember') }}
				<NuxtLink
					v-if="!props.loginAsAction"
					:to="withCountry('/auth/login')"
					class="auth-register-login-link"
					data-testid="auth-register-login-link"
				>
					{{ translate('auth.register.signInHere') }}
				</NuxtLink>
				<button
					v-else
					type="button"
					class="auth-register-login-link"
					data-testid="auth-register-login-link"
					@click="emit('open-login')"
				>
					{{ translate('auth.register.signInHere') }}
				</button>
			</p>
		</div>

		<AuthRegisterVerificationModal
			v-model="is_verification_modal_open"
			:email="verification_email"
			:code="verification_code"
			:error="verification_error"
			:resend-limit-reached="resend_limit_reached"
			:verifying="is_verifying"
			:resend-cooldown-remaining="resend_cooldown_remaining"
			@update:code="verification_code = $event"
			@verify="handleSubmitVerification"
			@resend="resendVerification"
		/>

		<AuthEmailAlreadyRegisteredModal
			:model-value="is_email_already_registered_modal_open"
			:email="email"
			:password="registered_email_password"
			:password-error="registered_email_password_error"
			:password-visible="registered_email_password_visible"
			@update:model-value="is_email_already_registered_modal_open = $event"
			@update:password="onRegisteredEmailPasswordInput"
			@update:password-visible="registered_email_password_visible = $event"
			@continue="continueWithRegisteredEmail"
			@forgot-password="openRegisteredEmailForgotPasswordModal"
		/>

		<AuthLoginForgotPasswordModal
			:model-value="is_registered_email_forgot_password_modal_open"
			:email="email"
			@update:model-value="onRegisteredEmailForgotPasswordModalChange"
			@return-to-login="restoreRegisteredEmailModal"
		/>
	</div>
</template>

<style lang="scss">
.auth-register-card-shell {
	.auth-register-card {
		.auth-register-head {
			display: flex;
			flex-direction: column;
			gap: 14px;

			.auth-register-head-logo {
				align-self: start;
			}

			.auth-register-title {
				font-size: var(--type-size-500);
				line-height: var(--type-line-500);
				color: var(--text-primary);
			}

			.auth-register-subtitle {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
			}
		}

		.auth-register-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 24px;

			.auth-register-field {
				display: flex;
				flex-direction: column;
				gap: 8px;
			}
		}

		.auth-register-field {
			display: flex;
			flex-direction: column;
			gap: 8px;

			.auth-register-field-head {
				min-height: 24px;
				align-items: center;
			}

			.auth-register-field-label-text,
			.auth-register-label {
				font-size: var(--type-size-100);
				font-weight: var(--font-weight-semibold);
				line-height: var(--type-line-100);
				color: var(--text-primary);

				.auth-register-optional {
					color: var(--text-muted);
					font-weight: var(--font-weight-regular);
				}
			}

			.auth-register-field-error {
				color: var(--error);
				font-size: var(--type-size-100);
				font-weight: var(--font-weight-semibold);
				line-height: var(--type-line-100);
			}

			.auth-register-input {
				width: 100%;
			}

			.auth-register-password-wrap {
				position: relative;

				.auth-register-password-toggle {
					--btn-soft: transparent;
					--btn-border: transparent;
					padding: 0;
					min-height: auto;
					width: 24px;
					height: 24px;
					border-radius: 0;
					box-shadow: none;
				}
			}

			.auth-register-hint {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				font-weight: var(--font-weight-regular);
				line-height: var(--type-line-100);
			}
		}

		.auth-register-check {
			display: inline-flex;
			align-items: center;
			gap: 10px;
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);

			.auth-register-check-link {
				color: var(--text-primary);
				font-weight: var(--font-weight-bold);
			}
		}

		.auth-register-check-row {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 12px;

			.auth-register-check {
				flex: 1;
			}
		}

		.auth-register-terms-error {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			color: var(--error);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			text-align: right;
			max-width: 220px;
			position: relative;

			.auth-register-terms-error-button {
				--btn-soft: transparent;
				--btn-border: transparent;
				padding: 0;
				min-height: auto;
				width: 24px;
				height: 24px;
				border-radius: 0;
				box-shadow: none;
				color: var(--error);
			}

			.auth-register-terms-error-popover-icon {
				flex-shrink: 0;
			}
		}

		.auth-register-submit {
			margin-top: 8px;
		}

		.auth-register-login {
			text-align: center;
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);

			.auth-register-login-link {
				color: var(--text-primary);
				font-weight: var(--font-weight-bold);
				text-decoration: underline;
				background: transparent;
				border: 0;
				padding: 0;
				cursor: pointer;
			}
		}

		@media (max-width: 760px) {
			padding: 26px 18px;
			gap: 14px;

			.auth-register-head {
				.auth-register-title {
					font-size: var(--type-size-500);
					line-height: var(--type-line-500);
				}
			}

			.auth-register-grid {
				grid-template-columns: 1fr;
			}

			.auth-register-check-row {
				flex-direction: column;
				align-items: stretch;
				gap: 8px;
			}

			.auth-register-terms-error {
				justify-content: flex-start;
				text-align: left;
				max-width: none;

			}
		}
	}
}

:deep(.auth-register-terms-error-tooltip-content) {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	min-height: 40px;
	padding: 8px 16px 8px 12px;
}
</style>