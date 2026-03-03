<script setup lang="ts">
const email = ref('');
const password = ref('');
const showVerification = ref(false);
const submitted = ref(false);

const emailValid = computed(() => /\S+@\S+\.\S+/.test(email.value));
const passwordValid = computed(() => password.value.length >= 8);
const canSubmit = computed(() => emailValid.value && passwordValid.value);

function submitDemo() {
    submitted.value = true;
    if (canSubmit.value) {
        showVerification.value = true;
    }
}
</script>

<template>
    <section class="guide-wrapper guide-auth-flow">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">Auth Flow</h1>
            <p class="guide-description">
                Patterns for login, register, verification, and profile setup
                progression in the current implementation.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Flow Stages</h2>
            <div class="auth-flow-stage-grid">
                <article class="auth-flow-card">
                    <h3 class="auth-flow-card-title">Login</h3>
                    <ul class="auth-flow-list">
                        <li>Member and non-member paths are clearly separated.</li>
                        <li>Forgot-password pathway stays one click away.</li>
                        <li>Error feedback appears inline near each field.</li>
                    </ul>
                </article>

                <article class="auth-flow-card">
                    <h3 class="auth-flow-card-title">Verification</h3>
                    <ul class="auth-flow-list">
                        <li>OTP modal opens after valid submit intent.</li>
                        <li>Resend requests a fresh token and clears entered code.</li>
                        <li>Close behavior keeps user progress when safe.</li>
                    </ul>
                </article>

                <article class="auth-flow-card">
                    <h3 class="auth-flow-card-title">Profile Setup</h3>
                    <ul class="auth-flow-list">
                        <li>Step order and completion state are explicit.</li>
                        <li>Profile fields prefill from onboarding/store or mock-user fallback.</li>
                        <li>Success toast confirms completion and next action.</li>
                    </ul>
                </article>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Validation + Verification Demo</h2>
            <article class="auth-flow-card">
                <div class="auth-flow-form-grid">
                    <div class="auth-flow-field">
                        <UiInput
                            v-model="email"
                            placeholder="Work email"
                            :state="submitted && !emailValid ? 'error' : 'default'"
                        />
                        <p
                            v-if="submitted && !emailValid"
                            class="auth-flow-helper is-error"
                        >
                            Enter a valid email address.
                        </p>
                    </div>

                    <div class="auth-flow-field">
                        <UiInput
                            v-model="password"
                            type="password"
                            placeholder="Password"
                            :state="
                                submitted && !passwordValid ? 'error' : 'default'
                            "
                        />
                        <p
                            v-if="submitted && !passwordValid"
                            class="auth-flow-helper is-error"
                        >
                            Use at least 8 characters.
                        </p>
                    </div>
                </div>

                <div class="auth-flow-actions">
                    <UiButton tone="neutral" variant="outline">
                        Forgot Password
                    </UiButton>
                    <UiButton
                        tone="neutral"
                        variant="filled"
                        :disabled="submitted && !canSubmit"
                        @click="submitDemo"
                    >
                        Continue
                    </UiButton>
                </div>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Implementation Checklist</h2>
            <article class="auth-flow-card">
                <ul class="auth-flow-list">
                    <li>All auth controls expose proper labels and focus states.</li>
                    <li>Validation errors appear inline after submit attempts for invalid fields.</li>
                    <li>Verification modal supports keyboard close and focus return.</li>
                    <li>Auth errors are field-specific and localized via i18n keys.</li>
                    <li>Profile completion hands off to country home with onboarding welcome state.</li>
                </ul>
            </article>
        </section>

        <UiModal
            v-model="showVerification"
            title="Verification required"
            width="460px"
        >
            <p class="auth-flow-modal-copy">
                Enter the one-time code sent to your email to continue.
            </p>
            <template #footer>
                <div class="auth-flow-modal-actions">
                    <UiButton tone="neutral" variant="outline" @click="showVerification = false">
                        Cancel
                    </UiButton>
                    <UiButton tone="neutral" variant="filled" @click="showVerification = false">
                        Verify
                    </UiButton>
                </div>
            </template>
        </UiModal>
    </section>
</template>

<style scoped lang="scss">
.guide-auth-flow {
    .auth-flow-stage-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
    }

    .auth-flow-card {
        border: 1px solid var(--border-default);
        border-radius: 14px;
        background: var(--contrast-light);
        padding: 16px;
        display: grid;
        gap: 12px;
    }

    .auth-flow-card-title {
        margin: 0;
        color: var(--text-primary);
        font-size: var(--type-size-200);
        line-height: var(--type-line-200);
    }

    .auth-flow-list {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: 6px;
        color: var(--text-secondary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
    }

    .auth-flow-form-grid {
        display: grid;
        gap: 10px;
    }

    .auth-flow-field {
        display: grid;
        gap: 4px;
    }

    .auth-flow-helper {
        margin: 0;
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--text-secondary);

        &.is-error {
            color: var(--error);
        }
    }

    .auth-flow-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 10px;
    }

    .auth-flow-modal-copy {
        margin: 0;
        color: var(--text-secondary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
    }

    .auth-flow-modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    @media (max-width: 980px) {
        .auth-flow-stage-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
