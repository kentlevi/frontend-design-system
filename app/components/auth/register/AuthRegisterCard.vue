<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UiTooltip from '@/components/ui/Tooltip.vue';
import { useRegisterForm } from '~/composables/auth/useRegisterForm';
import { useCountry } from '~/composables/app/useCountry';
import { registerRewardPoints } from '~/data/auth/register';

const { t } = useI18n();
const { withCountry } = useCountry();
const termsErrorPopoverPinned = ref(false);
const termsErrorPopoverHovered = ref(false);
const termsErrorHoverCloseTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const termsErrorPopoverOpen = computed(
	() => termsErrorPopoverPinned.value || termsErrorPopoverHovered.value
);
const termsErrorIconStrong = computed(() => termsErrorPopoverOpen.value);
const termsErrorRef = ref<HTMLElement | null>(null);

const {
	firstName,
	lastName,
	email,
	password,
	showPassword,
	agreeTerms,
	optInPromos,
	firstNameError,
	emailError,
	passwordError,
	termsError,
	isSubmitting,
	verificationEmail,
	verificationCode,
	verificationError,
	resendCooldownRemaining,
	isVerifying,
	isVerificationModalOpen,
	submitRegister,
	submitVerification,
	resendVerification,
} = useRegisterForm();

watch(
	() => Boolean(termsError.value && !agreeTerms.value),
	(hasTermsError) => {
		if (!hasTermsError) {
			clearTermsErrorHoverCloseTimer();
			termsErrorPopoverPinned.value = false;
			termsErrorPopoverHovered.value = false;
		}
	}
);

function clearTermsErrorHoverCloseTimer() {
	if (!termsErrorHoverCloseTimer.value) return;
	clearTimeout(termsErrorHoverCloseTimer.value);
	termsErrorHoverCloseTimer.value = null;
}

function toggleTermsErrorPopover() {
	termsErrorPopoverPinned.value = !termsErrorPopoverPinned.value;
}

function onTermsErrorHoverStart() {
	clearTermsErrorHoverCloseTimer();
	termsErrorPopoverHovered.value = true;
}

function onTermsErrorHoverEnd() {
	clearTermsErrorHoverCloseTimer();
	termsErrorHoverCloseTimer.value = setTimeout(() => {
		termsErrorPopoverHovered.value = false;
		termsErrorHoverCloseTimer.value = null;
	}, 90);
}

function onDocumentClick(event: MouseEvent) {
	const target = event.target as Node | null;
	if (!target) return;
	if (!termsErrorRef.value?.contains(target)) {
		clearTermsErrorHoverCloseTimer();
		termsErrorPopoverPinned.value = false;
		termsErrorPopoverHovered.value = false;
	}
}

onMounted(() => {
	document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
	clearTermsErrorHoverCloseTimer();
	document.removeEventListener('click', onDocumentClick);
});
</script>

<template>
	<UiLoadingOverlay
		:visible="isSubmitting"
		:label="t('auth.register.createAccount')"
		test-id="auth-register-loading-overlay"
		position="fixed"
		background="rgba(246, 246, 248, 0.72)"
		:z-index="400"
		loader-width="74px"
		loader-height="74px"
	/>

	<div class="auth-register-card" data-testid="auth-register-card">
		<div class="auth-register-head">
			<UiLogo
				name="musticker"
				variant="mark"
				color="colored"
				:size="40"
				class="auth-register-head-logo"
			/>
			<h1 class="auth-register-title">
				{{ t('auth.register.title') }}
			</h1>
			<p class="auth-register-subtitle">
				{{ t('auth.register.subtitle', { points: registerRewardPoints }) }}
			</p>
		</div>

		<div class="auth-register-grid">
			<UiFormField
				class="auth-register-field"
				:label="t('auth.register.firstName')"
				:error="firstNameError"
				head-class="auth-register-field-head"
				label-class="auth-register-field-label"
				label-text-class="auth-register-field-label-text"
				error-class="auth-register-field-error"
			>
				<UiInput
					v-model="firstName"
					type="text"
					size="md"
					class="auth-register-input"
					:state="firstNameError ? 'error' : 'default'"
					:placeholder="t('auth.register.enterFirstName')"
					data-testid="auth-register-first-name-input"
				/>
			</UiFormField>

			<UiFormField
				class="auth-register-field"
				:label="t('auth.register.lastName')"
				head-class="auth-register-field-head"
				label-class="auth-register-field-label"
				label-text-class="auth-register-field-label-text"
				error-class="auth-register-field-error"
			>
				<template #label>
					<span class="auth-register-label">
						{{ t('auth.register.lastName') }}
						<span class="auth-register-optional">
							({{ t('auth.register.optional') }})
						</span>
					</span>
				</template>
				<UiInput
					v-model="lastName"
					type="text"
					size="md"
					class="auth-register-input"
					:placeholder="t('auth.register.enterLastName')"
					data-testid="auth-register-last-name-input"
				/>
			</UiFormField>
		</div>

		<UiFormField
			class="auth-register-field"
			:label="t('auth.register.email')"
			:error="emailError"
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
				:state="emailError ? 'error' : 'default'"
				:placeholder="t('auth.register.enterEmail')"
				data-testid="auth-register-email-input"
			/>
		</UiFormField>

		<UiFormField
			class="auth-register-field"
			:label="t('auth.register.password')"
			:error="passwordError"
			head-class="auth-register-field-head"
			label-class="auth-register-field-label"
			label-text-class="auth-register-field-label-text"
			error-class="auth-register-field-error"
		>
			<div class="auth-register-password-wrap">
				<UiInput
					v-model="password"
					:type="showPassword ? 'text' : 'password'"
					size="md"
					class="auth-register-input"
					:state="passwordError ? 'error' : 'default'"
					:placeholder="t('auth.register.enterPassword')"
					data-testid="auth-register-password-input"
				>
					<template #icon-right>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="sm"
							class="auth-register-password-toggle"
							:aria-label="t('auth.login.togglePassword')"
							data-testid="auth-register-password-toggle"
							:sr-label="t('auth.login.togglePassword')"
							icon-only
							:icon="showPassword ? 'regular-eye' : 'regular-eye-slash'"
							:icon-size="24"
							@click="showPassword = !showPassword"
						/>
					</template>
				</UiInput>
			</div>
			<template #hint>
				<p class="auth-register-hint">
					{{ t('auth.register.passwordHint') }}
				</p>
			</template>
		</UiFormField>

		<div class="auth-register-check-row">
			<UiCheckbox
				v-model="agreeTerms"
				class="auth-register-check"
				:state="termsError && !agreeTerms ? 'error' : 'default'"
				data-testid="auth-register-agree-terms"
			>
				<span class="auth-register-check-text">
					{{ t('auth.register.agreePrefix') }}
					<NuxtLink :to="withCountry('/terms-of-use')" class="auth-register-check-link" data-testid="auth-register-terms-link">{{ t('auth.register.terms') }}</NuxtLink>
					{{ t('auth.register.and') }}
					<NuxtLink :to="withCountry('/privacy-policy')" class="auth-register-check-link" data-testid="auth-register-privacy-link">{{ t('auth.register.privacy') }}</NuxtLink>
					.
				</span>
			</UiCheckbox>
			<div
				v-if="termsError && !agreeTerms"
				ref="termsErrorRef"
				class="auth-register-terms-error"
				data-testid="auth-register-terms-error"
				@mouseenter="onTermsErrorHoverStart"
				@mouseleave="onTermsErrorHoverEnd"
			>
				<UiTooltip
					:open="termsErrorPopoverOpen"
					side="right"
					mobile-side="left"
					tone="danger"
					:offset="10"
					:slide-distance="36"
					content-testid="auth-register-terms-error-popover"
					class="auth-register-terms-error-tooltip"
					content-class="auth-register-terms-error-tooltip-content"
				>
					<template #trigger>
						<UiButton
							variant="ghost"
							tone="danger"
							size="sm"
							class="auth-register-terms-error-button"
							:aria-expanded="termsErrorPopoverOpen"
							aria-haspopup="dialog"
							data-testid="auth-register-terms-error-button"
							sr-label="Terms error information"
							icon-only
							@click="toggleTermsErrorPopover"
							@focus="onTermsErrorHoverStart"
						>
							<span class="auth-register-terms-error-icon-stack" aria-hidden="true">
								<UiIcon
									name="regular-info-circle"
									:size="24"
									color="var(--error)"
									class="auth-register-terms-error-icon auth-register-terms-error-icon-regular"
									:class="{ 'is-hidden': termsErrorIconStrong }"
								/>
								<UiIcon
									name="strong-info-circle"
									:size="24"
									color="var(--error)"
									class="auth-register-terms-error-icon auth-register-terms-error-icon-strong"
									:class="{ 'is-visible': termsErrorIconStrong }"
								/>
							</span>
						</UiButton>
					</template>

					<UiIcon
						name="strong-exclamation-triangle"
						:size="24"
						color="var(--contrast-light)"
						class="auth-register-terms-error-popover-icon"
					/>
					<span>{{ termsError }}</span>
				</UiTooltip>
			</div>
		</div>

		<UiCheckbox v-model="optInPromos" class="auth-register-check" data-testid="auth-register-opt-in-promos">
			<span class="auth-register-check-text">{{ t('auth.register.promoOptIn') }}</span>
		</UiCheckbox>

		<UiButton
			variant="filled"
			tone="neutral"
			size="lg"
			class="auth-register-submit"
			data-testid="auth-register-submit"
			@click="submitRegister"
		>
			{{ t('auth.register.createAccount') }}
		</UiButton>

		<p class="auth-register-login">
			{{ t('auth.register.alreadyMember') }}
			<NuxtLink
				:to="withCountry('/auth/login')"
				class="auth-register-login-link"
				data-testid="auth-register-login-link"
			>
				{{ t('auth.register.signInHere') }}
			</NuxtLink>
		</p>

		<AuthRegisterVerificationModal
			v-model="isVerificationModalOpen"
			:email="verificationEmail"
			:code="verificationCode"
			:error="verificationError"
			:verifying="isVerifying"
			:resend-cooldown-remaining="resendCooldownRemaining"
			@update:code="verificationCode = $event"
			@verify="submitVerification"
			@resend="resendVerification"
		/>
	</div>
</template>

<style lang="scss">
.auth-register-card {
    width: 100%;
    max-width: 588px;
    border: 1px solid var(--border-default);
    background: var(--contrast-light);
    border-radius: 22px;
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.08);
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: relative;

    .auth-register-head {
        display: flex;
        flex-direction: column;
        gap: 14px;

        .auth-register-head-logo {
            align-self: start;
        }

        .auth-register-title {
            margin: 0;
            font-size: var(--type-size-500);
            line-height: var(--type-line-500);
            color: var(--text-primary);
        }

        .auth-register-subtitle {
            margin: 0;
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
            margin: 0;
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

        .auth-register-terms-error-icon {
            flex-shrink: 0;
            transition: opacity 0.2s ease;
            transform-origin: center;
            color: var(--error);
        }

        .auth-register-terms-error-icon-stack {
            position: relative;
            width: 24px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;

            .auth-register-terms-error-icon {
                position: absolute;
                inset: 0;
                margin: auto;
            }
        }

        .auth-register-terms-error-icon-regular {
            opacity: 1;

            &.is-hidden {
                opacity: 0;
            }
        }

        .auth-register-terms-error-icon-strong {
            opacity: 0;

            &.is-visible {
                opacity: 1;
            }
        }

        .auth-register-terms-error-button {
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

        .auth-register-terms-error-tooltip-content {
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
        }
    }

    .auth-register-submit {
        margin-top: 8px;
        width: 100%;
        border-radius: 16px;
        box-shadow: none;
        font-size: var(--type-size-200);
        line-height: var(--type-line-200);
    }

    .auth-register-login {
        margin: 0;
        text-align: center;
        color: var(--text-secondary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);

        .auth-register-login-link {
            color: var(--text-primary);
            font-weight: var(--font-weight-bold);
            text-decoration: underline;
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

            .auth-register-terms-error-tooltip-content {
                min-width: 220px;
            }
        }

    }
}

@media (prefers-reduced-motion: reduce) {
    .auth-register-card {
        .auth-register-terms-error {
            .auth-register-terms-error-icon {
                transition: none;
            }
        }
    }
}

</style>