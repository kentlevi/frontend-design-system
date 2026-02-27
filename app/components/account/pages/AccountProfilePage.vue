<script setup lang="ts">
import { useAccountProfile } from '~/composables/account/useAccountProfile';
import { useCountry } from '@/composables/app/useCountry';

const { t } = useI18n();
const route = useRoute();
const country = computed(() =>
    String(route.params.country || 'en').toLowerCase()
);
const {
    firstName,
    lastName,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
    promotions,
    reviews,
    confirmations,
    unit,
    photoUrl,
    fileInput,
    initials,
    openFilePicker,
    onFilePicked,
    removePhoto,
    saveProfile,
    signOut,
} = useAccountProfile();
</script>

<template>
    <section class="account-page" data-testid="account-profile-page">
        <AccountShell active-tab="profile">
            <div class="account-content account-profile" data-testid="account-profile-content">
                <h1 class="account-profile-title" data-testid="account-profile-title">{{ t('account.profile.title') }}</h1>

                <div class="account-profile-section" data-testid="account-profile-personal-section">
                    <div>
                        <h2 class="account-profile-section-title">{{ t('account.profile.personalDetails') }}</h2>
                        <p class="account-profile-section-description">
                            {{ t('account.profile.personalDetailsDesc') }}
                        </p>
                    </div>
                    <div>
                        <label class="account-profile-label">{{ t('account.profile.profilePhoto') }}</label>
                        <div class="account-profile-photo-row" data-testid="account-profile-photo-row">
                            <div class="account-profile-avatar">
                                <img
                                    v-if="photoUrl"
                                    :src="photoUrl"
                                    :alt="t('account.profile.profilePhoto')"
                                    class="account-profile-avatar-image"
                                >
                                <span v-else class="account-profile-avatar-text">{{ initials }}</span>
                            </div>
                            <div>
                                <p class="account-profile-muted">{{ t('account.profile.photoHint1') }}</p>
                                <p class="account-profile-muted">{{ t('account.profile.photoHint2') }}</p>
                                <div class="account-profile-photo-actions">
                                    <input
                                        ref="fileInput"
                                        type="file"
                                        class="account-profile-file-input"
                                        accept=".jpg,.jpeg,.png"
                                        data-testid="account-profile-photo-input"
                                        @change="onFilePicked"
                                    >
                                    <button
                                        type="button"
                                        class="account-profile-outline-button"
                                        data-testid="account-profile-photo-upload-button"
                                        @click="openFilePicker"
                                    >
                                        {{ t('account.profile.uploadNewPhoto') }}
                                    </button>
                                    <button
                                        v-if="photoUrl"
                                        type="button"
                                        class="account-profile-delete-button"
                                        data-testid="account-profile-photo-delete-button"
                                        @click="removePhoto"
                                    >
                                        {{ t('account.profile.delete') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="account-profile-grid" data-testid="account-profile-form">
                            <UiFormField :label="t('account.profile.firstName')" :required="true">
                                <template #default="{ inputId, describedBy }">
                                    <UiInput
                                        :id="inputId"
                                        v-model="firstName"
                                        type="text"
                                        :aria-describedby="describedBy || undefined"
                                        data-testid="account-profile-first-name"
                                    />
                                </template>
                            </UiFormField>
                            <UiFormField
                                :label="`${t('account.profile.lastName')} (${t('account.profile.optional')})`"
                            >
                                <template #default="{ inputId, describedBy }">
                                    <UiInput
                                        :id="inputId"
                                        v-model="lastName"
                                        type="text"
                                        :aria-describedby="describedBy || undefined"
                                        data-testid="account-profile-last-name"
                                    />
                                </template>
                            </UiFormField>
                            <UiFormField
                                class="account-profile-grid-full"
                                :label="t('account.profile.emailAddress')"
                                :required="true"
                            >
                                <template #default="{ inputId, describedBy }">
                                    <UiInput
                                        :id="inputId"
                                        v-model="email"
                                        type="email"
                                        :aria-describedby="describedBy || undefined"
                                        data-testid="account-profile-email"
                                    />
                                </template>
                            </UiFormField>
                        </div>
                        <div class="account-profile-actions-right" data-testid="account-profile-save-wrap">
                            <UiButton variant="filled" tone="neutral" size="md" data-testid="account-profile-save-button" @click="saveProfile">
                                {{ t('account.profile.saveChanges') }}
                            </UiButton>
                        </div>
                    </div>
                </div>

                <div class="account-profile-section" data-testid="account-profile-password-section">
                    <div>
                        <h2 class="account-profile-section-title">{{ t('account.profile.password') }}</h2>
                        <p class="account-profile-section-description">{{ t('account.profile.passwordDesc') }}</p>
                    </div>
                    <div class="account-profile-stack" data-testid="account-profile-password-form">
                        <UiFormField :label="t('account.profile.currentPassword')" :required="true">
                            <template #default="{ inputId, describedBy }">
                                <UiInput
                                    :id="inputId"
                                    v-model="currentPassword"
                                    type="password"
                                    :aria-describedby="describedBy || undefined"
                                    :placeholder="t('account.profile.currentPasswordPlaceholder')"
                                    data-testid="account-profile-current-password"
                                />
                            </template>
                        </UiFormField>
                        <p class="account-profile-muted">{{ t('account.profile.passwordHint') }}</p>
                        <UiFormField :label="t('account.profile.newPassword')" :required="true">
                            <template #default="{ inputId, describedBy }">
                                <UiInput
                                    :id="inputId"
                                    v-model="newPassword"
                                    type="password"
                                    :aria-describedby="describedBy || undefined"
                                    :placeholder="t('account.profile.newPasswordPlaceholder')"
                                    data-testid="account-profile-new-password"
                                />
                            </template>
                        </UiFormField>
                        <UiFormField :label="t('account.profile.confirmNewPassword')" :required="true">
                            <template #default="{ inputId, describedBy }">
                                <UiInput
                                    :id="inputId"
                                    v-model="confirmPassword"
                                    type="password"
                                    :aria-describedby="describedBy || undefined"
                                    :placeholder="t('account.profile.confirmNewPasswordPlaceholder')"
                                    data-testid="account-profile-confirm-password"
                                />
                            </template>
                        </UiFormField>
                        <div class="account-profile-inline-actions" data-testid="account-profile-password-actions">
                            <UiButton variant="filled" tone="neutral" size="md" disabled data-testid="account-profile-change-password-button">
                                {{ t('account.profile.changePassword') }}
                            </UiButton>
                            <NuxtLink :to="`/${country}/auth/login`" data-testid="account-profile-forgot-password">
                                {{ t('account.profile.forgotPassword') }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <div class="account-profile-section" data-testid="account-profile-settings-section">
                    <div>
                        <h2 class="account-profile-section-title">{{ t('account.profile.settings') }}</h2>
                        <p class="account-profile-section-description">{{ t('account.profile.settingsDesc') }}</p>
                    </div>
                    <div class="account-profile-settings" data-testid="account-profile-settings">
                        <div class="account-profile-setting-row" data-testid="account-profile-setting-promotions">
                            <div>
                                <h3 class="account-profile-setting-title">{{ t('account.profile.promotions') }}</h3>
                                <p class="account-profile-muted">{{ t('account.profile.promotionsDesc') }}</p>
                            </div>
                            <label class="account-profile-switch">
                                <input v-model="promotions" type="checkbox" data-testid="account-profile-toggle-promotions" >
                                <span />
                            </label>
                        </div>
                        <div class="account-profile-setting-row" data-testid="account-profile-setting-reviews">
                            <div>
                                <h3 class="account-profile-setting-title">{{ t('account.profile.reviews') }}</h3>
                                <p class="account-profile-muted">{{ t('account.profile.reviewsDesc') }}</p>
                            </div>
                            <label class="account-profile-switch">
                                <input v-model="reviews" type="checkbox" data-testid="account-profile-toggle-reviews" >
                                <span />
                            </label>
                        </div>
                        <div class="account-profile-setting-row" data-testid="account-profile-setting-confirmations">
                            <div>
                                <h3 class="account-profile-setting-title">{{ t('account.profile.confirmations') }}</h3>
                                <p class="account-profile-muted">{{ t('account.profile.confirmationsDesc') }}</p>
                            </div>
                            <label class="account-profile-switch">
                                <input v-model="confirmations" type="checkbox" data-testid="account-profile-toggle-confirmations" >
                                <span />
                            </label>
                        </div>
                        <div class="account-profile-setting-row" data-testid="account-profile-setting-unit">
                            <div>
                                <h3 class="account-profile-setting-title">{{ t('account.profile.unit') }}</h3>
                                <p class="account-profile-muted">{{ t('account.profile.unitDesc') }}</p>
                            </div>
                            <div class="account-profile-unit-segment">
                                <button
                                    type="button"
                                    :class="{ active: unit === 'millimeter' }"
                                    data-testid="account-profile-unit-millimeter-button"
                                    @click="unit = 'millimeter'"
                                >
                                    {{ t('account.profile.millimeter') }}
                                </button>
                                <button
                                    type="button"
                                    :class="{ active: unit === 'inch' }"
                                    data-testid="account-profile-unit-inch-button"
                                    @click="unit = 'inch'"
                                >
                                    {{ t('account.profile.inch') }}
                                </button>
                            </div>
                        </div>
                        <div class="account-profile-actions-right" data-testid="account-profile-signout-wrap">
                            <UiButton variant="outline" tone="neutral" size="md" data-testid="account-profile-signout-button" @click="signOut">
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

    .account-content {
        padding-top: 18px;

        .account-profile-title {
            margin: 0 0 26px;
            font-size: 28px;
            font-weight: 700;
            line-height: 40px;
            letter-spacing: -0.5px;
            color: var(--text-primary);
        }

        .account-profile-section {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 126px;
            padding: 26px 0;

            .account-profile-section-title {
                margin: 0 0 0px;
                font-size: 18px;
                font-weight: 600;
                line-height: 32px;
                letter-spacing: -0.5px;

            }

            .account-profile-section-description {
                margin: 0;
                color: var(--text-secondary);
                font-size: 14px;
                font-weight: 400;
                line-height: 24px;
                letter-spacing: -0.5px;
            }

            .account-profile-label {
                display: block;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 10px;
            }

            .account-profile-photo-row {
                display: grid;
                grid-template-columns: 98px 1fr;
                gap: 18px;
                align-items: center;
                margin-bottom: 16px;

                .account-profile-avatar {
                    width: 98px;
                    height: 98px;
                    border-radius: 50%;
                    background: var(--border-default);
                    display: grid;
                    place-items: center;
                    overflow: hidden;
                    font-size: 34px;
                    font-weight: 700;

                    .account-profile-avatar-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }

            .account-profile-muted {
                color: var(--text-secondary);
                font-size: 13px;
                line-height: 1.5;
                margin: 0;
            }

            .account-profile-file-input {
                display: none;
            }

            .account-profile-photo-actions {
                margin-top: 10px;
                display: flex;
                gap: 14px;
                align-items: center;

                .account-profile-outline-button {
                    height: 38px;
                    padding: 0 16px;
                    border-radius: 999px;
                    border: 1px solid var(--text-primary);
                    background: transparent;
                    font-size: 14px;
                    cursor: pointer;
                }

                .account-profile-delete-button {
                    border: 0;
                    background: transparent;
                    color: var(--error);
                    font-size: 14px;
                    cursor: pointer;
                }
            }

            .account-profile-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;

                .account-profile-grid-full {
                    grid-column: 1 / -1;
                }

                label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 6px;
                }

                input {
                    width: 100%;
                    height: 42px;
                    border: 1px solid var(--border-default);
                    border-radius: 10px;
                    background: var(--contrast-light);
                    padding: 0 12px;
                    font-size: 14px;
                }

                .account-profile-optional {
                    color: var(--text-muted);
                    font-weight: 400;
                }
            }

            .account-profile-stack {
                display: flex;
                flex-direction: column;
                gap: 10px;

                label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 6px;
                }

                input {
                    width: 100%;
                    height: 42px;
                    border: 1px solid var(--border-default);
                    border-radius: 10px;
                    background: var(--contrast-light);
                    padding: 0 12px;
                    font-size: 14px;
                }

                .account-profile-inline-actions {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    justify-content: flex-end;
                    margin-top: 6px;

                    a {
                        color: var(--text-primary);
                        font-size: 14px;
                        text-decoration: underline;
                    }
                }
            }

            .account-profile-settings {
                display: flex;
                flex-direction: column;
                gap: 12px;

                .account-profile-setting-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 16px;
                    align-items: center;

                    .account-profile-setting-title {
                        margin: 0 0 4px;
                        font-size: 16px;
                    }

                    .account-profile-switch {
                        position: relative;
                        width: 42px;
                        height: 24px;

                        input {
                            position: absolute;
                            opacity: 0;
                        }

                        span {
                            display: block;
                            width: 100%;
                            height: 100%;
                            background: var(--text-primary);
                            border-radius: 999px;
                            position: relative;
                        }

                        span::after {
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

                        input:checked + span::after {
                            transform: translateX(18px);
                        }
                    }

                    .account-profile-unit-segment {
                        display: inline-grid;
                        grid-template-columns: 1fr 1fr;
                        border: 1px solid var(--text-primary);
                        border-radius: 14px;
                        overflow: hidden;

                        button {
                            border: 0;
                            background: var(--contrast-light);
                            min-width: 112px;
                            height: 40px;
                            font-size: 13px;
                            font-weight: 700;
                            cursor: pointer;

                            &.active {
                                background: var(--text-primary);
                                color: var(--contrast-light);
                            }
                        }
                    }
                }
            }

            .account-profile-actions-right {
                margin-top: 12px;
                display: flex;
                justify-content: flex-end;
            }
        }
    }

    @media (max-width: 980px) {
        .account-content {
            .account-profile-section {
                grid-template-columns: 1fr;
                gap: 16px;
            }
        }
    }
}
</style>

