<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

definePageMeta({
    layout: 'home',
});

const route = useRoute();
const localePath = useLocalePath();
const mockUser = useCookie<{
    firstName: string;
    lastName: string;
    email: string;
} | null>('mock_user', {
    default: () => null,
    sameSite: 'lax',
    path: '/',
});

const step = ref<1 | 2>(1);
const showWelcomeToast = ref(route.query.onboarding === '1');

const firstName = ref(String(route.query.firstName || 'Joy'));
const lastName = ref(String(route.query.lastName || 'Love'));
const email = ref(String(route.query.email || 'joylove1990@gmail.com'));

const photoUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const promotions = ref(false);
const reviews = ref(false);
const confirmations = ref(false);
const useShippingAsBilling = ref(false);
const unit = ref<'millimeter' | 'inch'>('millimeter');

const initials = computed(() => {
    const first = firstName.value.trim().charAt(0).toUpperCase();
    const last = lastName.value.trim().charAt(0).toUpperCase();
    return `${first || 'J'}${last || 'L'}`;
});

function dismissToast() {
    showWelcomeToast.value = false;
}

function openFilePicker() {
    fileInput.value?.click();
}

function onFilePicked(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) return;

    if (photoUrl.value?.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl.value);
    }
    photoUrl.value = URL.createObjectURL(file);
}

function removePhoto() {
    if (photoUrl.value?.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl.value);
    }
    photoUrl.value = null;
}

function goNext() {
    step.value = 2;
}

function goBack() {
    step.value = 1;
}

async function completeSetup() {
    mockUser.value = {
        firstName: firstName.value.trim() || 'Joy',
        lastName: lastName.value.trim() || 'Love',
        email: email.value.trim() || 'joylove1990@gmail.com',
    };
    await navigateTo(localePath('/'));
}

onBeforeUnmount(() => {
    if (photoUrl.value?.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl.value);
    }
});
</script>

<template>
    <section class="auth-profile">
        <div class="auth-profile-shell">
            <aside class="auth-profile-sidebar">
                <UiLogo
                    name="musticker"
                    variant="full"
                    color="colored"
                    :size="54"
                />

                <div class="auth-profile-sidebar-head">
                    {{ $t('auth.profile.sidebar.title') }}
                </div>

                <div class="auth-profile-steps">
                    <div
                        class="auth-profile-step"
                        :class="{ 'is-active': step === 1 }"
                    >
                        <span class="auth-profile-step-icon">
                            <UiIcon
                                :name="
                                    step === 1
                                        ? 'strong-user-plus'
                                        : 'strong-check'
                                "
                                :size="18"
                            />
                        </span>
                        <div>
                            <p class="auth-profile-step-title">
                                {{ $t('auth.profile.sidebar.profile.title') }}
                            </p>
                            <p class="auth-profile-step-text">
                                {{ $t('auth.profile.sidebar.profile.text') }}
                            </p>
                        </div>
                    </div>

                    <div
                        class="auth-profile-step"
                        :class="{ 'is-active': step === 2 }"
                    >
                        <span class="auth-profile-step-icon">
                            <UiIcon name="strong-cog" :size="18" />
                        </span>
                        <div>
                            <p class="auth-profile-step-title">
                                {{ $t('auth.profile.sidebar.settings.title') }}
                            </p>
                            <p class="auth-profile-step-text">
                                {{ $t('auth.profile.sidebar.settings.text') }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="auth-profile-progress">
                    <span :class="{ 'is-on': step === 1 }" />
                    <span :class="{ 'is-on': step === 2 }" />
                </div>
            </aside>

            <main class="auth-profile-main">
                <template v-if="step === 1">
                    <header class="auth-profile-head">
                        <h1>
                            {{
                                $t('auth.profile.details.title', {
                                    name: firstName || 'Joy',
                                })
                            }}
                        </h1>
                        <p>{{ $t('auth.profile.details.subtitle') }}</p>
                    </header>

                    <div class="auth-profile-block">
                        <label class="auth-profile-label">
                            {{ $t('auth.profile.details.photoTitle') }}
                        </label>
                        <div class="auth-profile-photo-row">
                            <div class="auth-profile-avatar">
                                <img
                                    v-if="photoUrl"
                                    :src="photoUrl"
                                    alt="Profile photo"
                                />
                                <span v-else>{{ initials }}</span>
                            </div>

                            <div class="auth-profile-photo-meta">
                                <p>
                                    {{ $t('auth.profile.details.photoHint1') }}
                                </p>
                                <p>
                                    {{ $t('auth.profile.details.photoHint2') }}
                                </p>
                                <div class="auth-profile-photo-actions">
                                    <input
                                        ref="fileInput"
                                        type="file"
                                        class="auth-profile-file-input"
                                        accept=".jpg,.jpeg,.png"
                                        @change="onFilePicked"
                                    />
                                    <button
                                        type="button"
                                        class="auth-profile-outline-btn"
                                        @click="openFilePicker"
                                    >
                                        {{ $t('auth.profile.details.upload') }}
                                    </button>
                                    <button
                                        v-if="photoUrl"
                                        type="button"
                                        class="auth-profile-delete-btn"
                                        @click="removePhoto"
                                    >
                                        {{ $t('auth.profile.details.delete') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="auth-profile-form-grid">
                        <div class="auth-profile-field">
                            <label>{{
                                $t('auth.profile.details.firstName')
                            }}</label>
                            <input v-model="firstName" type="text" />
                        </div>
                        <div class="auth-profile-field">
                            <label>
                                {{ $t('auth.profile.details.lastName') }}
                                <span
                                    >({{ $t('auth.register.optional') }})</span
                                >
                            </label>
                            <input v-model="lastName" type="text" />
                        </div>
                        <div class="auth-profile-field auth-profile-field-full">
                            <label>{{
                                $t('auth.profile.details.email')
                            }}</label>
                            <input v-model="email" type="email" />
                        </div>
                    </div>

                    <div class="auth-profile-actions">
                        <button
                            type="button"
                            class="auth-profile-link-btn"
                            @click="goNext"
                        >
                            {{ $t('auth.profile.details.skip') }}
                        </button>
                        <UiButton
                            variant="filled"
                            tone="neutral"
                            size="lg"
                            @click="goNext"
                        >
                            <UiIcon name="strong-arrow-right" :size="16" />
                            {{ $t('auth.profile.details.continue') }}
                        </UiButton>
                    </div>
                </template>

                <template v-else>
                    <header class="auth-profile-head">
                        <h1>{{ $t('auth.profile.settings.title') }}</h1>
                        <p>{{ $t('auth.profile.settings.subtitle') }}</p>
                    </header>

                    <div class="auth-profile-setting-list">
                        <div class="auth-profile-setting-row">
                            <div>
                                <p class="auth-profile-setting-title">
                                    {{ $t('auth.profile.settings.promotions') }}
                                </p>
                                <p class="auth-profile-setting-text">
                                    {{
                                        $t(
                                            'auth.profile.settings.promotionsDesc'
                                        )
                                    }}
                                </p>
                            </div>
                            <label class="auth-profile-switch">
                                <input v-model="promotions" type="checkbox" />
                                <span />
                            </label>
                        </div>

                        <div class="auth-profile-setting-row">
                            <div>
                                <p class="auth-profile-setting-title">
                                    {{ $t('auth.profile.settings.reviews') }}
                                </p>
                                <p class="auth-profile-setting-text">
                                    {{
                                        $t('auth.profile.settings.reviewsDesc')
                                    }}
                                </p>
                            </div>
                            <label class="auth-profile-switch">
                                <input v-model="reviews" type="checkbox" />
                                <span />
                            </label>
                        </div>

                        <div class="auth-profile-setting-row">
                            <div>
                                <p class="auth-profile-setting-title">
                                    {{
                                        $t(
                                            'auth.profile.settings.confirmations'
                                        )
                                    }}
                                </p>
                                <p class="auth-profile-setting-text">
                                    {{
                                        $t(
                                            'auth.profile.settings.confirmationsDesc'
                                        )
                                    }}
                                </p>
                            </div>
                            <label class="auth-profile-switch">
                                <input
                                    v-model="confirmations"
                                    type="checkbox"
                                />
                                <span />
                            </label>
                        </div>
                    </div>

                    <div
                        class="auth-profile-setting-row auth-profile-setting-row-unit"
                    >
                        <div>
                            <p class="auth-profile-setting-title">
                                {{ $t('auth.profile.settings.unit') }}
                            </p>
                            <p class="auth-profile-setting-text">
                                {{ $t('auth.profile.settings.unitDesc') }}
                            </p>
                        </div>
                        <div class="auth-profile-segment">
                            <button
                                type="button"
                                :class="{ 'is-active': unit === 'millimeter' }"
                                @click="unit = 'millimeter'"
                            >
                                millimeter
                            </button>
                            <button
                                type="button"
                                :class="{ 'is-active': unit === 'inch' }"
                                @click="unit = 'inch'"
                            >
                                inch
                            </button>
                        </div>
                    </div>

                    <div class="auth-profile-setting-row">
                        <div>
                            <p class="auth-profile-setting-title">
                                {{ $t('auth.profile.settings.billing') }}
                            </p>
                            <p class="auth-profile-setting-text">
                                {{ $t('auth.profile.settings.billingDesc') }}
                            </p>
                        </div>
                        <label class="auth-profile-switch">
                            <input
                                v-model="useShippingAsBilling"
                                type="checkbox"
                            />
                            <span />
                        </label>
                    </div>

                    <div class="auth-profile-actions auth-profile-actions-end">
                        <UiButton
                            variant="outline"
                            tone="neutral"
                            size="lg"
                            @click="goBack"
                        >
                            {{ $t('auth.profile.settings.back') }}
                        </UiButton>
                        <UiButton
                            variant="filled"
                            tone="neutral"
                            size="lg"
                            @click="completeSetup"
                        >
                            <UiIcon name="strong-check" :size="16" />
                            {{ $t('auth.profile.settings.complete') }}
                        </UiButton>
                    </div>
                </template>
            </main>
        </div>

        <Transition name="profile-toast">
            <div v-if="showWelcomeToast" class="auth-profile-toast">
                <UiIcon name="strong-check-circle" :size="18" />
                <span>{{ $t('auth.profile.toast') }}</span>
                <button type="button" @click="dismissToast">
                    <UiIcon name="strong-times" :size="14" />
                </button>
            </div>
        </Transition>
    </section>
</template>

<style lang="scss">
.auth-profile {
    min-height: calc(100vh - 176px);
    background: var(--bg-page);
    position: relative;
    padding: 34px 24px 52px;
}

.auth-profile-shell {
    max-width: 1240px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 344px 1fr;
    gap: 60px;
}

.auth-profile-sidebar {
    background: var(--surface-subtle);
    border-radius: 16px;
    padding: 44px 50px;
    display: flex;
    flex-direction: column;
    gap: 42px;
    min-height: 850px;
}

.auth-profile-sidebar-head {
    font-size: 32px;
    line-height: 1.15;
    font-weight: 700;
    color: var(--text-primary);
}

.auth-profile-steps {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.auth-profile-step {
    display: grid;
    grid-template-columns: 42px 1fr;
    gap: 14px;
    opacity: 0.4;
}

.auth-profile-step.is-active {
    opacity: 1;
}

.auth-profile-step-icon {
    width: 36px;
    height: 36px;
    border: 1px solid var(--border-default);
    border-radius: 8px;
    display: grid;
    place-items: center;
    color: var(--text-primary);
    background: var(--contrast-light);
}

.auth-profile-step-title {
    margin: 0;
    font-size: 18px;
    line-height: 1.3;
    font-weight: 700;
    color: var(--text-primary);
}

.auth-profile-step-text {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.5;
}

.auth-profile-progress {
    margin-top: auto;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.auth-profile-progress span {
    width: 72px;
    height: 10px;
    border-radius: 999px;
    background: var(--border-default);
}

.auth-profile-progress span.is-on {
    background: var(--text-primary);
}

.auth-profile-main {
    padding: 30px 0 0;
}

.auth-profile-head h1 {
    margin: 0;
    font-size: 52px;
    line-height: 1.08;
    color: var(--text-primary);
}

.auth-profile-head p {
    margin: 10px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
}

.auth-profile-block {
    margin-top: 44px;
}

.auth-profile-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 14px;
}

.auth-profile-photo-row {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 26px;
    align-items: center;
}

.auth-profile-avatar {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: var(--border-default);
    display: grid;
    place-items: center;
    color: var(--text-primary);
    font-size: 40px;
    font-weight: 700;
    overflow: hidden;
}

.auth-profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.auth-profile-photo-meta p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.5;
}

.auth-profile-photo-actions {
    margin-top: 14px;
    display: flex;
    align-items: center;
    gap: 20px;
}

.auth-profile-file-input {
    display: none;
}

.auth-profile-outline-btn {
    height: 48px;
    padding: 0 22px;
    border-radius: 999px;
    border: 1px solid var(--text-primary);
    background: transparent;
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
}

.auth-profile-delete-btn {
    border: 0;
    background: transparent;
    color: var(--error);
    font-size: 16px;
    cursor: pointer;
}

.auth-profile-form-grid {
    margin-top: 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

.auth-profile-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.auth-profile-field-full {
    grid-column: 1 / -1;
}

.auth-profile-field label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.auth-profile-field label span {
    color: var(--text-muted);
    font-weight: 400;
}

.auth-profile-field input {
    width: 100%;
    height: 48px;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    background: var(--contrast-light);
    color: var(--text-primary);
    font-size: 14px;
    padding: 0 14px;
}

.auth-profile-actions {
    margin-top: 56px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 14px;
}

.auth-profile-link-btn {
    border: 0;
    background: transparent;
    color: var(--text-primary);
    font-size: 16px;
    cursor: pointer;
}

.auth-profile-actions .ui-button {
    min-width: 210px;
    border-radius: 16px;
    box-shadow: none;
    font-size: 18px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.auth-profile-setting-list {
    margin-top: 42px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.auth-profile-setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.auth-profile-setting-title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
}

.auth-profile-setting-text {
    margin: 4px 0 0;
    font-size: 14px;
    color: var(--text-secondary);
}

.auth-profile-switch {
    position: relative;
    width: 42px;
    height: 24px;
    display: inline-flex;
    flex-shrink: 0;
}

.auth-profile-switch input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.auth-profile-switch span {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    background: var(--text-primary);
    position: relative;
}

.auth-profile-switch span::after {
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--contrast-light);
    position: absolute;
    top: 4px;
    left: 4px;
    transition: transform 0.2s ease;
}

.auth-profile-switch input:checked + span::after {
    transform: translateX(18px);
}

.auth-profile-setting-row-unit {
    margin-top: 42px;
}

.auth-profile-segment {
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--text-primary);
    border-radius: 16px;
    overflow: hidden;
}

.auth-profile-segment button {
    min-width: 128px;
    height: 48px;
    border: 0;
    background: var(--contrast-light);
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
}

.auth-profile-segment button.is-active {
    background: var(--text-primary);
    color: var(--contrast-light);
}

.auth-profile-actions-end {
    justify-content: space-between;
}

.auth-profile-toast {
    position: fixed;
    left: 50%;
    bottom: 120px;
    transform: translateX(-50%);
    background: var(--brand-primary);
    color: var(--text-primary);
    border-radius: 8px;
    border: 1px solid
        color-mix(in srgb, var(--brand-primary) 72%, var(--text-primary));
    min-width: 460px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    z-index: 30;
}

.auth-profile-toast button {
    border: 0;
    background: transparent;
    color: inherit;
    display: grid;
    place-items: center;
    cursor: pointer;
}

.profile-toast-enter-active,
.profile-toast-leave-active {
    transition: opacity 0.2s ease;
}

.profile-toast-enter-from,
.profile-toast-leave-to {
    opacity: 0;
}

@media (max-width: 1180px) {
    .auth-profile-shell {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .auth-profile-sidebar {
        min-height: auto;
        padding: 28px 22px;
    }

    .auth-profile-main {
        padding-top: 0;
    }
}

@media (max-width: 860px) {
    .auth-profile {
        padding: 24px 14px 40px;
    }

    .auth-profile-head h1 {
        font-size: 34px;
    }

    .auth-profile-form-grid {
        grid-template-columns: 1fr;
    }

    .auth-profile-field-full {
        grid-column: auto;
    }

    .auth-profile-photo-row {
        grid-template-columns: 1fr;
    }

    .auth-profile-actions,
    .auth-profile-actions-end {
        margin-top: 34px;
        flex-direction: column;
        align-items: stretch;
    }

    .auth-profile-link-btn {
        order: 2;
        font-size: 18px;
        text-align: center;
    }

    .auth-profile-actions .ui-button {
        width: 100%;
        min-width: 0;
        font-size: 18px;
    }

    .auth-profile-toast {
        min-width: 0;
        width: calc(100vw - 24px);
        bottom: 84px;
    }
}
</style>
