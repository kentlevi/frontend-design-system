<script setup lang="ts">
definePageMeta({
    layout: 'home',
});

const { t } = useI18n();
const localePath = useLocalePath();
const mockUser = useCookie<{
    firstName: string;
    lastName: string;
    email: string;
} | null>('mock_user');

const firstName = ref(mockUser.value?.firstName || 'Joy');
const lastName = ref(mockUser.value?.lastName || 'Love');
const email = ref(mockUser.value?.email || 'joylove1990@gmail.com');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const promotions = ref(false);
const reviews = ref(false);
const confirmations = ref(false);
const unit = ref<'millimeter' | 'inch'>('millimeter');

const photoUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const initials = computed(
    () =>
        `${(firstName.value?.charAt(0) || 'J').toUpperCase()}${(lastName.value?.charAt(0) || 'L').toUpperCase()}`
);

function openFilePicker() {
    fileInput.value?.click();
}

function onFilePicked(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) return;
    if (photoUrl.value?.startsWith('blob:'))
        URL.revokeObjectURL(photoUrl.value);
    photoUrl.value = URL.createObjectURL(file);
}

function removePhoto() {
    if (photoUrl.value?.startsWith('blob:'))
        URL.revokeObjectURL(photoUrl.value);
    photoUrl.value = null;
}

function saveProfile() {
    mockUser.value = {
        firstName: firstName.value.trim() || 'Joy',
        lastName: lastName.value.trim() || 'Love',
        email: email.value.trim() || 'joylove1990@gmail.com',
    };
}

function signOut() {
    mockUser.value = null;
    navigateTo(localePath('/'));
}
</script>

<template>
    <section class="account-page">
        <AccountShell active-tab="profile">
            <div class="account-content account-profile">
                <h1 class="account-title">{{ t('account.profile.title') }}</h1>

                <div class="account-section-grid">
                    <div>
                        <h2>{{ t('account.profile.personalDetails') }}</h2>
                        <p>
                            {{ t('account.profile.personalDetailsDesc') }}
                        </p>
                    </div>
                    <div>
                        <label class="account-label">{{
                            t('account.profile.profilePhoto')
                        }}</label>
                        <div class="account-photo-row">
                            <div class="account-avatar-large">
                                <img
                                    v-if="photoUrl"
                                    :src="photoUrl"
                                    :alt="t('account.profile.profilePhoto')"
                                />
                                <span v-else>{{ initials }}</span>
                            </div>
                            <div>
                                <p class="account-muted">
                                    {{ t('account.profile.photoHint1') }}
                                </p>
                                <p class="account-muted">
                                    {{ t('account.profile.photoHint2') }}
                                </p>
                                <div class="account-photo-actions">
                                    <input
                                        ref="fileInput"
                                        type="file"
                                        class="hidden-file"
                                        accept=".jpg,.jpeg,.png"
                                        @change="onFilePicked"
                                    />
                                    <button
                                        type="button"
                                        class="outline-btn"
                                        @click="openFilePicker"
                                    >
                                        {{
                                            t('account.profile.uploadNewPhoto')
                                        }}
                                    </button>
                                    <button
                                        v-if="photoUrl"
                                        type="button"
                                        class="delete-btn"
                                        @click="removePhoto"
                                    >
                                        {{ t('account.profile.delete') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="account-grid">
                            <div>
                                <label>{{
                                    t('account.profile.firstName')
                                }}</label>
                                <input v-model="firstName" type="text" />
                            </div>
                            <div>
                                <label
                                    >{{ t('account.profile.lastName') }}
                                    <span
                                        >({{
                                            t('account.profile.optional')
                                        }})</span
                                    ></label
                                >
                                <input v-model="lastName" type="text" />
                            </div>
                            <div class="full">
                                <label>{{
                                    t('account.profile.emailAddress')
                                }}</label>
                                <input v-model="email" type="email" />
                            </div>
                        </div>
                        <div class="account-actions-right">
                            <UiButton
                                variant="filled"
                                tone="neutral"
                                size="md"
                                @click="saveProfile"
                            >
                                {{ t('account.profile.saveChanges') }}
                            </UiButton>
                        </div>
                    </div>
                </div>

                <div class="account-section-grid">
                    <div>
                        <h2>{{ t('account.profile.password') }}</h2>
                        <p>
                            {{ t('account.profile.passwordDesc') }}
                        </p>
                    </div>
                    <div class="account-stack">
                        <div>
                            <label>{{
                                t('account.profile.currentPassword')
                            }}</label>
                            <input
                                v-model="currentPassword"
                                type="password"
                                :placeholder="
                                    t(
                                        'account.profile.currentPasswordPlaceholder'
                                    )
                                "
                            />
                        </div>
                        <p class="account-muted">
                            {{ t('account.profile.passwordHint') }}
                        </p>
                        <div>
                            <label>{{
                                t('account.profile.newPassword')
                            }}</label>
                            <input
                                v-model="newPassword"
                                type="password"
                                :placeholder="
                                    t('account.profile.newPasswordPlaceholder')
                                "
                            />
                        </div>
                        <div>
                            <label>{{
                                t('account.profile.confirmNewPassword')
                            }}</label>
                            <input
                                v-model="confirmPassword"
                                type="password"
                                :placeholder="
                                    t(
                                        'account.profile.confirmNewPasswordPlaceholder'
                                    )
                                "
                            />
                        </div>
                        <div class="account-actions-inline">
                            <UiButton
                                variant="filled"
                                tone="neutral"
                                size="md"
                                disabled
                            >
                                {{ t('account.profile.changePassword') }}
                            </UiButton>
                            <NuxtLink :to="localePath('/auth/login')">{{
                                t('account.profile.forgotPassword')
                            }}</NuxtLink>
                        </div>
                    </div>
                </div>

                <div class="account-section-grid">
                    <div>
                        <h2>{{ t('account.profile.settings') }}</h2>
                        <p>
                            {{ t('account.profile.settingsDesc') }}
                        </p>
                    </div>
                    <div class="account-settings">
                        <div class="setting-row">
                            <div>
                                <h3>{{ t('account.profile.promotions') }}</h3>
                                <p class="account-muted">
                                    {{ t('account.profile.promotionsDesc') }}
                                </p>
                            </div>
                            <label class="switch"
                                ><input
                                    v-model="promotions"
                                    type="checkbox" /><span
                            /></label>
                        </div>
                        <div class="setting-row">
                            <div>
                                <h3>{{ t('account.profile.reviews') }}</h3>
                                <p class="account-muted">
                                    {{ t('account.profile.reviewsDesc') }}
                                </p>
                            </div>
                            <label class="switch"
                                ><input
                                    v-model="reviews"
                                    type="checkbox" /><span
                            /></label>
                        </div>
                        <div class="setting-row">
                            <div>
                                <h3>
                                    {{ t('account.profile.confirmations') }}
                                </h3>
                                <p class="account-muted">
                                    {{ t('account.profile.confirmationsDesc') }}
                                </p>
                            </div>
                            <label class="switch"
                                ><input
                                    v-model="confirmations"
                                    type="checkbox" /><span
                            /></label>
                        </div>
                        <div class="setting-row">
                            <div>
                                <h3>{{ t('account.profile.unit') }}</h3>
                                <p class="account-muted">
                                    {{ t('account.profile.unitDesc') }}
                                </p>
                            </div>
                            <div class="unit-segment">
                                <button
                                    type="button"
                                    :class="{ active: unit === 'millimeter' }"
                                    @click="unit = 'millimeter'"
                                >
                                    {{ t('account.profile.millimeter') }}
                                </button>
                                <button
                                    type="button"
                                    :class="{ active: unit === 'inch' }"
                                    @click="unit = 'inch'"
                                >
                                    {{ t('account.profile.inch') }}
                                </button>
                            </div>
                        </div>
                        <div class="account-actions-right">
                            <UiButton
                                variant="outline"
                                tone="neutral"
                                size="md"
                                @click="signOut"
                            >
                                {{ t('account.profile.signOut') }}
                            </UiButton>
                        </div>
                    </div>
                </div>
            </div>
        </AccountShell>
    </section>
</template>

<style scoped lang="scss">
.account-page {
    background: var(--bg-page);
    min-height: calc(100vh - 176px);
}
.account-content {
    padding-top: 18px;
}
.account-title {
    margin: 0 0 26px;
    font-size: 52px;
    line-height: 1.05;
    color: var(--text-primary);
}
.account-section-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 42px;
    padding: 26px 0;
}
.account-section-grid h2 {
    margin: 0 0 8px;
    font-size: 34px;
}
.account-section-grid p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.5;
}
.account-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
}
.account-photo-row {
    display: grid;
    grid-template-columns: 98px 1fr;
    gap: 18px;
    align-items: center;
    margin-bottom: 16px;
}
.account-avatar-large {
    width: 98px;
    height: 98px;
    border-radius: 50%;
    background: var(--border-default);
    display: grid;
    place-items: center;
    overflow: hidden;
    font-size: 34px;
    font-weight: 700;
}
.account-avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.account-muted {
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
}
.hidden-file {
    display: none;
}
.account-photo-actions {
    margin-top: 10px;
    display: flex;
    gap: 14px;
    align-items: center;
}
.outline-btn {
    height: 38px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid var(--text-primary);
    background: transparent;
    font-size: 14px;
    cursor: pointer;
}
.delete-btn {
    border: 0;
    background: transparent;
    color: var(--error);
    font-size: 14px;
    cursor: pointer;
}
.account-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}
.account-grid .full {
    grid-column: 1 / -1;
}
.account-grid label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
}
.account-grid label span {
    color: var(--text-muted);
    font-weight: 400;
}
.account-grid input,
.account-stack input {
    width: 100%;
    height: 42px;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    background: var(--contrast-light);
    padding: 0 12px;
    font-size: 14px;
}
.account-actions-right {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
}
.account-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.account-stack label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
}
.account-actions-inline {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: flex-end;
    margin-top: 6px;
}
.account-actions-inline a {
    color: var(--text-primary);
    font-size: 14px;
    text-decoration: underline;
}
.account-settings {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.setting-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
}
.setting-row h3 {
    margin: 0 0 4px;
    font-size: 16px;
}
.switch {
    position: relative;
    width: 42px;
    height: 24px;
}
.switch input {
    position: absolute;
    opacity: 0;
}
.switch span {
    display: block;
    width: 100%;
    height: 100%;
    background: var(--text-primary);
    border-radius: 999px;
    position: relative;
}
.switch span::after {
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--contrast-light);
    position: absolute;
    left: 4px;
    top: 4px;
    transition: transform 0.2s;
}
.switch input:checked + span::after {
    transform: translateX(18px);
}
.unit-segment {
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--text-primary);
    border-radius: 14px;
    overflow: hidden;
}
.unit-segment button {
    border: 0;
    background: var(--contrast-light);
    min-width: 112px;
    height: 40px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
}
.unit-segment button.active {
    background: var(--text-primary);
    color: var(--contrast-light);
}
@media (max-width: 980px) {
    .account-section-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}
</style>
