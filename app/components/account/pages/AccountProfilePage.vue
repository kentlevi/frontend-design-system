<script setup lang="ts">
import { useAccountProfile } from '~/composables/account/useAccountProfile';
import { useCountry } from '~/composables/app/country/useCountry';
import { usePersonalForm } from '~/composables/account/profile/usePersonalForm';

const { t } = useI18n();
const { withCountry } = useCountry();
const {
	email,
	currentPassword,
	newPassword,
	confirmPassword,
	promotions,
	reviews,
	confirmations,
	unit,
	photoUrl,
	avatarDisplayUrl,
	photoError,
	fileInput,
	initials,
	openFilePicker,
	onFilePicked,
	removePhoto,
	signOut,
} = useAccountProfile();

const {
	field_definitions,
	form_state,
	is_submitting,
	api_response,
	loadPersonalForm,
	submitPersonalForm
} = usePersonalForm();

onMounted(() => {
	loadPersonalForm()
})

const profileToastVisible = ref(false);
let profile_toast_timer: ReturnType<typeof setTimeout> | null = null;

function clear_profile_toast_timer() {
	if (!profile_toast_timer) return;
	clearTimeout(profile_toast_timer);
	profile_toast_timer = null;
}

function show_profile_saved_toast() {
	clear_profile_toast_timer();
	profileToastVisible.value = true;
	profile_toast_timer = setTimeout(() => {
		profileToastVisible.value = false;
		profile_toast_timer = null;
	}, 2400);
}

async function onSaveProfile() {
	await submitPersonalForm();

	if (!api_response.value) return;
	show_profile_saved_toast();
}

onBeforeUnmount(() => {
	clear_profile_toast_timer();
});
</script>

<template>
	<section class="account-page" data-testid="account-profile-page">
		<UiLoadingOverlay
			:visible="is_submitting"
			:label="t('account.profile.saveChanges')"
			test-id="account-profile-saving-overlay"
			position="fixed"
		/>
		<UiToast
			:visible="profileToastVisible"
			:message=api_response?.message
			tone="primary"
			variant="outlined"
			data-testid="account-profile-save-toast"
			@close="profileToastVisible = false"
		/>
		<AccountShell active-tab="profile">
			<div class="account-content account-profile" data-testid="account-profile-content">
				<h1 class="account-profile-title" data-testid="account-profile-title">{{ t('account.profile.title') }}</h1>

				<div class="account-profile-section" data-testid="account-profile-personal-section">
					<div class="account-profile-section-copy">
						<h2 class="account-profile-section-title">{{ t('account.profile.personalDetails') }}</h2>
						<p class="account-profile-section-description">
							{{ t('account.profile.personalDetailsDesc') }}
						</p>
					</div>
					<div class="account-profile-section-main">
						<div class="account-profile-label">{{ t('account.profile.profilePhoto') }}</div>
						<div class="account-profile-photo-row" data-testid="account-profile-photo-row">
							<div class="account-profile-avatar">
								<img
									v-if="avatarDisplayUrl"
									:src="avatarDisplayUrl"
									:alt="t('account.profile.profilePhoto')"
									class="account-profile-avatar-image"
								>
								<span v-else class="account-profile-avatar-text">{{ initials }}</span>
							</div>
							<div class="account-profile-photo-copy">
								<p class="account-profile-muted">{{ t('account.profile.photoHint1') }}</p>
								<p class="account-profile-muted">{{ t('account.profile.photoHint2') }}</p>
								<p v-if="photoError" class="account-profile-photo-error">{{ photoError }}</p>
								<div class="account-profile-photo-actions">
									<input
										ref="fileInput"
										type="file"
										class="account-profile-file-input"
										accept=".jpg,.jpeg,.png"
										data-testid="account-profile-photo-input"
										@change="onFilePicked"
									>
									<UiButton
										variant="outline"
										tone="neutral"
										size="md"
										class="account-profile-outline-button"
										data-testid="account-profile-photo-upload-button"
										@click="openFilePicker"
									>
										{{ t('account.profile.uploadNewPhoto') }}
									</UiButton>
									<UiButton
										v-if="photoUrl"
										variant="ghost"
										tone="danger"
										size="md"
										class="account-profile-delete-button"
										data-testid="account-profile-photo-delete-button"
										@click="removePhoto"
									>
										{{ t('account.profile.delete') }}
									</UiButton>
								</div>
							</div>
						</div>

						<div class="account-profile-grid" data-testid="account-profile-form">

							<!-- START OF DYNAMIC PROFILE FIELDS -->
							<div v-for="field in field_definitions" :key="field.id">
								<UiFormField
									:label="field.is_required
										? t(`account.profile.${field.field_key}`)
										: `${t(`account.profile.${field.field_key}`)} (${t('account.profile.optional')})`"
									:required="field.is_required"
								>
									<template #default="{ inputId, describedBy }">
										<UiInput
											:id="inputId"
											v-model="form_state.fields[field.field_key]"
											type="text"
											:aria-describedby="describedBy || undefined"
											:data-testid="`account-profile-${field.field_key}`"
										/>
									</template>
								</UiFormField>
							</div>
							<!-- END OF DYNAMIC PROFILE FIELDS -->

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
							<UiButton variant="filled" tone="neutral" size="md" data-testid="account-profile-save-button" @click="onSaveProfile">
								{{ t('account.profile.saveChanges') }}
							</UiButton>
						</div>
					</div>
				</div>

				<div class="account-profile-section" data-testid="account-profile-password-section">
					<div class="account-profile-section-copy">
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
							<NuxtLink :to="withCountry('/auth/login')" class="account-profile-forgot-password-link" data-testid="account-profile-forgot-password">
								{{ t('account.profile.forgotPassword') }}
							</NuxtLink>
						</div>
					</div>
				</div>

				<div class="account-profile-section" data-testid="account-profile-settings-section">
					<div class="account-profile-section-copy">
						<h2 class="account-profile-section-title">{{ t('account.profile.settings') }}</h2>
						<p class="account-profile-section-description">{{ t('account.profile.settingsDesc') }}</p>
					</div>
					<div class="account-profile-settings" data-testid="account-profile-settings">
						<div class="account-profile-setting-row" data-testid="account-profile-setting-promotions">
							<div class="account-profile-setting-copy">
								<h3 class="account-profile-setting-title">{{ t('account.profile.promotions') }}</h3>
								<p class="account-profile-muted">{{ t('account.profile.promotionsDesc') }}</p>
							</div>
							<label class="account-profile-switch">
								<input v-model="promotions" type="checkbox" class="account-profile-switch-input" data-testid="account-profile-toggle-promotions" >
								<span class="account-profile-switch-track" />
							</label>
						</div>
						<div class="account-profile-setting-row" data-testid="account-profile-setting-reviews">
							<div class="account-profile-setting-copy">
								<h3 class="account-profile-setting-title">{{ t('account.profile.reviews') }}</h3>
								<p class="account-profile-muted">{{ t('account.profile.reviewsDesc') }}</p>
							</div>
							<label class="account-profile-switch">
								<input v-model="reviews" type="checkbox" class="account-profile-switch-input" data-testid="account-profile-toggle-reviews" >
								<span class="account-profile-switch-track" />
							</label>
						</div>
						<div class="account-profile-setting-row" data-testid="account-profile-setting-confirmations">
							<div class="account-profile-setting-copy">
								<h3 class="account-profile-setting-title">{{ t('account.profile.confirmations') }}</h3>
								<p class="account-profile-muted">{{ t('account.profile.confirmationsDesc') }}</p>
							</div>
							<label class="account-profile-switch">
								<input v-model="confirmations" type="checkbox" class="account-profile-switch-input" data-testid="account-profile-toggle-confirmations" >
								<span class="account-profile-switch-track" />
							</label>
						</div>
						<div class="account-profile-setting-row" data-testid="account-profile-setting-unit">
							<div class="account-profile-setting-copy">
								<h3 class="account-profile-setting-title">{{ t('account.profile.unit') }}</h3>
								<p class="account-profile-muted">{{ t('account.profile.unitDesc') }}</p>
							</div>
							<div class="account-profile-unit-segment">
								<UiButton
									variant="ghost"
									tone="neutral"
									size="md"
									class="account-profile-unit-button"
									:class="{ active: unit === 'millimeter' }"
									data-testid="account-profile-unit-millimeter-button"
									@click="unit = 'millimeter'"
								>
									{{ t('account.profile.millimeter') }}
								</UiButton>
								<UiButton
									variant="ghost"
									tone="neutral"
									size="md"
									class="account-profile-unit-button"
									:class="{ active: unit === 'inch' }"
									data-testid="account-profile-unit-inch-button"
									@click="unit = 'inch'"
								>
									{{ t('account.profile.inch') }}
								</UiButton>
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
    position: relative;

    .account-content {
        padding-top: 18px;
        min-height: 100%;

        .account-profile-title {
            margin: 0 0 26px;
            font-size: var(--type-size-500);
            font-weight: var(--font-weight-bold);
            line-height: var(--type-line-500);

            color: var(--text-primary);
        }

        .account-profile-section {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 126px;
            padding: 26px 0;

            .account-profile-section-copy,
            .account-profile-section-main {
                display: flex;
                flex-direction: column;
            }

            .account-profile-section-title {
                margin: 0 0 0px;
                font-size: var(--type-size-300);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-300);


            }

            .account-profile-section-description {
                margin: 0;
                color: var(--text-secondary);
                font-size: var(--type-size-100);
                font-weight: var(--font-weight-regular);
                line-height: var(--type-line-100);

            }

            .account-profile-label {
                display: block;
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                font-weight: var(--font-weight-semibold);
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
                    background: var(--gray-40);
                    color: var(--black-base);
                    display: grid;
                    place-items: center;
                    overflow: hidden;
                    font-size: var(--type-size-550);
                    line-height: var(--type-line-550);
                    font-weight: var(--font-weight-bold);

                    .account-profile-avatar-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }

            .account-profile-photo-copy {
                display: flex;
                flex-direction: column;
            }

            .account-profile-muted {
                color: var(--text-secondary);
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                margin: 0;
            }

            .account-profile-photo-error {
                color: var(--error);
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                margin: 8px 0 0;
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
                    min-height: 38px;
                }

                .account-profile-delete-button {
                    color: var(--error);
                }
            }

            .account-profile-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;

                .account-profile-grid-full {
                    grid-column: 1 / -1;
                }

                .account-profile-optional {
                    color: var(--text-muted);
                    font-weight: var(--font-weight-regular);
                }
            }

            .account-profile-stack {
                display: flex;
                flex-direction: column;
                gap: 10px;

                .account-profile-inline-actions {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    justify-content: flex-end;
                    margin-top: 6px;

                    .account-profile-forgot-password-link {
                        color: var(--text-primary);
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
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

                    .account-profile-setting-copy {
                        display: flex;
                        flex-direction: column;
                    }

                    .account-profile-setting-title {
                        margin: 0 0 4px;
                        font-size: var(--type-size-200);
                        line-height: var(--type-line-200);
                    }

                    .account-profile-switch {
                        position: relative;
                        width: 42px;
                        height: 24px;

                        .account-profile-switch-input {
                            position: absolute;
                            opacity: 0;
                        }

                        .account-profile-switch-track {
                            display: block;
                            width: 100%;
                            height: 100%;
                            background: var(--text-primary);
                            border-radius: 999px;
                            position: relative;
                        }

                        .account-profile-switch-track::after {
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

                        .account-profile-switch-input:checked + .account-profile-switch-track::after {
                            transform: translateX(18px);
                        }
                    }

                    .account-profile-unit-segment {
                        display: inline-grid;
                        grid-template-columns: 1fr 1fr;
                        border: 1px solid var(--text-primary);
                        border-radius: 14px;
                        overflow: hidden;

                        .account-profile-unit-button {
                            min-width: 112px;
                            height: 40px;
                            font-size: var(--type-size-100);
                            line-height: var(--type-line-100);
                            font-weight: var(--font-weight-bold);

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