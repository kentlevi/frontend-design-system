<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
    defineProps<{
        firstName?: string;
        lastName?: string;
        email?: string;
        initials?: string;
        photoUrl?: string | null;
    }>(),
    {
        firstName: '',
        lastName: '',
        email: '',
        initials: '',
        photoUrl: null,
    }
);

const emit = defineEmits<{
    (event: 'update:firstName', value: string): void;
    (event: 'update:lastName', value: string): void;
    (event: 'update:email', value: string): void;
    (event: 'next'): void;
    (event: 'photo-file-picked', file: File): void;
    (event: 'photo-remove'): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

function openFilePicker() {
    fileInput.value?.click();
}

function onFilePicked(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    emit('photo-file-picked', file);
    target.value = '';
}

function updateFirstName(value: string) {
    emit('update:firstName', value);
}

function updateLastName(value: string) {
    emit('update:lastName', value);
}

function updateEmail(value: string) {
    emit('update:email', value);
}
</script>

<template>
    <div class="auth-profile-details-step" data-testid="auth-profile-details-step">
        <div class="auth-profile-details-main" data-testid="auth-profile-details-main">
            <header class="auth-profile-head" data-testid="auth-profile-details-header">
                <h1 class="auth-profile-head-title">
                    {{
                        $t('auth.profile.details.title', {
                            name: firstName || 'User',
                        })
                    }}
                </h1>
                <p class="auth-profile-head-subtitle">{{ $t('auth.profile.details.subtitle') }}</p>
            </header>

            <div class="auth-profile-content" data-testid="auth-profile-details-content">
                <div class="auth-profile-block" data-testid="auth-profile-photo-block">
                    <label class="auth-profile-label">
                        {{ $t('auth.profile.details.photoTitle') }}
                    </label>
                    <div class="auth-profile-photo-row" data-testid="auth-profile-photo-row">
                        <button
                            type="button"
                            class="auth-profile-photo-picker"
                            data-testid="auth-profile-photo-upload-button"
                            @click="openFilePicker"
                        >
                            <div class="auth-profile-avatar">
                                <img
                                    v-if="photoUrl"
                                    :src="photoUrl"
                                    alt="Profile photo"
                                    class="auth-profile-avatar-image"
                                >
                                <span v-else class="auth-profile-avatar-initials">{{ initials }}</span>
                            </div>
                            <UiIcon
                                name="strong-angle-down"
                                :size="28"
                                class="auth-profile-photo-picker-icon"
                            />
                        </button>

                        <div class="auth-profile-photo-meta">
                            <div class="auth-profile-photo-meta-text-group">
                                <p class="auth-profile-photo-meta-text">
                                    {{ $t('auth.profile.details.photoHint1') }}
                                </p>
                                <p class="auth-profile-photo-meta-text">
                                    {{ $t('auth.profile.details.photoHint2') }}
                                </p>
                            </div>
                            <div class="auth-profile-photo-actions">
                                <input
                                    ref="fileInput"
                                    type="file"
                                    class="auth-profile-file-input"
                                    accept=".jpg,.jpeg,.png"
                                    data-testid="auth-profile-photo-input"
                                    @change="onFilePicked"
                                >
                                <UiButton
                                    v-if="photoUrl"
                                    variant="ghost"
                                    tone="danger"
                                    size="md"
                                    class="auth-profile-delete-btn"
                                    data-testid="auth-profile-photo-delete-button"
                                    @click="emit('photo-remove')"
                                >
                                    {{ $t('auth.profile.details.delete') }}
                                </UiButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="auth-profile-form-grid" data-testid="auth-profile-details-form">
                    <div class="auth-profile-field">
                        <label class="auth-profile-field-label">{{
                            $t('auth.profile.details.firstName')
                        }}</label>
                        <UiInput
                            :model-value="props.firstName"
                            type="text"
                            size="md"
                            class="auth-profile-field-input"
                            data-testid="auth-profile-first-name"
                            @update:model-value="updateFirstName"
                        />
                    </div>
                    <div class="auth-profile-field">
                        <label class="auth-profile-field-label">
                            {{ $t('auth.profile.details.lastName') }}
                            <span class="auth-profile-field-label-optional">({{ $t('auth.register.optional') }})</span>
                        </label>
                        <UiInput
                            :model-value="props.lastName"
                            type="text"
                            size="md"
                            class="auth-profile-field-input"
                            data-testid="auth-profile-last-name"
                            @update:model-value="updateLastName"
                        />
                    </div>
                    <div class="auth-profile-field auth-profile-field-full">
                        <label class="auth-profile-field-label">{{
                            $t('auth.profile.details.email')
                        }}</label>
                        <UiInput
                            :model-value="props.email"
                            type="email"
                            size="md"
                            class="auth-profile-field-input"
                            data-testid="auth-profile-email"
                            @update:model-value="updateEmail"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="auth-profile-actions" data-testid="auth-profile-details-actions">
            <UiButton
                variant="ghost"
                tone="neutral"
                size="md"
                class="auth-profile-link-btn"
                data-testid="auth-profile-skip-button"
                @click="emit('next')"
            >
                {{ $t('auth.profile.details.skip') }}
            </UiButton>
            <UiButton
                variant="filled"
                tone="neutral"
                size="md"
                class="auth-profile-continue-btn"
                data-testid="auth-profile-continue-button"
                @click="emit('next')"
            >
                <UiIcon name="regular-long-arrow-right" :size="24" />
                {{ $t('auth.profile.details.continue') }}
            </UiButton>
        </div>
    </div>
</template>

<style lang="scss">
.auth-profile-details-step {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    max-height: 773px;

    .auth-profile-details-main {
        display: flex;
        flex-direction: column;
        gap: 40px;

        .auth-profile-head {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .auth-profile-head-title {
                margin: 0;
                font-size: 24px;
                line-height: 36px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .auth-profile-head-subtitle {
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 24px;
            }
        }

        .auth-profile-content {

            .auth-profile-block {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .auth-profile-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .auth-profile-photo-row {
                    display: grid;
                    grid-template-columns: minmax(280px, 1fr) 1fr;
                    gap: 32px;
                    align-items: center;

                    .auth-profile-photo-picker {
                        position: relative;
                        width: 100%;
                        min-height: 188px;
                        border-radius: 999px;
                        border: 6px solid var(--brand-primary);
                        background: color-mix(in srgb, var(--contrast-light) 92%, var(--brand-primary) 8%);
                        box-shadow:
                            0 0 0 14px color-mix(in srgb, var(--brand-primary) 20%, transparent);
                        padding: 18px 56px 18px 66px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        cursor: pointer;
                        transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

                        &::before {
                            content: '';
                            position: absolute;
                            inset: -18px;
                            border-radius: inherit;
                            border: 1px solid color-mix(in srgb, var(--brand-primary) 36%, transparent);
                            background: color-mix(in srgb, var(--brand-primary) 16%, transparent);
                            z-index: -1;
                        }

                        &:hover {
                            border-color: color-mix(in srgb, var(--brand-primary) 86%, #f6cc00);
                            box-shadow:
                                0 0 0 16px color-mix(in srgb, var(--brand-primary) 24%, transparent);
                        }

                        &:focus-visible {
                            outline: 2px solid var(--text-primary);
                            outline-offset: 4px;
                        }

                        .auth-profile-avatar {
                            width: 168px;
                            height: 168px;
                            border-radius: 50%;
                            background: var(--border-default);
                            display: grid;
                            place-items: center;
                            color: var(--text-primary);
                            font-size: 40px;
                            font-weight: 700;
                            overflow: hidden;

                            .auth-profile-avatar-image {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }

                        .auth-profile-photo-picker-icon {
                            color: var(--text-primary);
                            flex-shrink: 0;
                        }
                    }

                    .auth-profile-photo-meta {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        padding: 6px 0;

                        .auth-profile-photo-meta-text-group {
                            display: flex;
                            flex-direction: column;
                            gap: 0;
                        }

                        .auth-profile-photo-meta-text {
                            margin: 0;
                            color: var(--text-secondary);
                            font-size: 14px;
                            line-height: 1.5;
                        }

                        .auth-profile-photo-actions {

                            .auth-profile-file-input {
                                display: none;
                            }

                            .auth-profile-delete-btn {
                                border: 0;
                                background: transparent;
                                color: var(--error);
                                font-size: 16px;
                                line-height: 28px;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }

            .auth-profile-form-grid {
                margin-top: 32px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 14px;

                .auth-profile-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .auth-profile-field-label {
                        font-size: 14px;
                        line-height: 24px;
                        font-weight: 600;
                        color: var(--text-primary);

                        .auth-profile-field-label-optional {
                            color: var(--text-secondary);
                            font-weight: 400;
                        }
                    }

                    .auth-profile-field-input {
                        width: 100%;
                        box-shadow: none;
                    }
                }

                .auth-profile-field-full {
                    grid-column: 1 / -1;
                }
            }
        }
    }

    .auth-profile-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 16px;

        .auth-profile-link-btn {
            font-size: 14px;
            line-height: 24px;
            cursor: pointer;
            padding: 8px 24px;
        }
        .auth-profile-continue-btn {
            padding: 8px 16px;
            border-radius: 16px;
        }
    }
}

@media (max-width: 860px) {
    .auth-profile-details-step {
        min-height: auto;

        .auth-profile-details-main {
            .auth-profile-head {
                .auth-profile-head-title {
                    font-size: 34px;
                }
            }

            .auth-profile-content {
                .auth-profile-block {
                    .auth-profile-photo-row {
                        grid-template-columns: 1fr;
                    }
                }

                .auth-profile-form-grid {
                    grid-template-columns: 1fr;

                    .auth-profile-field-full {
                        grid-column: auto;
                    }
                }
            }
        }

        .auth-profile-actions {
            margin-top: 34px;
            flex-direction: column;
            align-items: stretch;

            .auth-profile-link-btn {
                order: 2;
                font-size: 16px;
                line-height: 28px;
                text-align: center;
            }

            .ui-button {
                width: 100%;
                min-width: 0;
                font-size: 16px;
                line-height: 28px;
            }
        }
    }
}
</style>
