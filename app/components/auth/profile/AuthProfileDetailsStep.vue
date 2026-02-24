<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
    defineProps<{
        firstName: string;
        lastName: string;
        email: string;
        initials: string;
        photoUrl: string | null;
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

        <div class="auth-profile-block" data-testid="auth-profile-photo-block">
            <label class="auth-profile-label">
                {{ $t('auth.profile.details.photoTitle') }}
            </label>
            <div class="auth-profile-photo-row" data-testid="auth-profile-photo-row">
                <div class="auth-profile-avatar">
                    <img
                        v-if="photoUrl"
                        :src="photoUrl"
                        alt="Profile photo"
                        class="auth-profile-avatar-image"
                    />
                    <span v-else class="auth-profile-avatar-initials">{{ initials }}</span>
                </div>

                <div class="auth-profile-photo-meta">
                    <p class="auth-profile-photo-meta-text">
                        {{ $t('auth.profile.details.photoHint1') }}
                    </p>
                    <p class="auth-profile-photo-meta-text">
                        {{ $t('auth.profile.details.photoHint2') }}
                    </p>
                    <div class="auth-profile-photo-actions">
                        <input
                            ref="fileInput"
                            type="file"
                            class="auth-profile-file-input"
                            accept=".jpg,.jpeg,.png"
                            @change="onFilePicked"
                            data-testid="auth-profile-photo-input"
                        />
                        <button
                            type="button"
                            class="auth-profile-outline-btn"
                            @click="openFilePicker"
                            data-testid="auth-profile-photo-upload-button"
                        >
                            {{ $t('auth.profile.details.upload') }}
                        </button>
                        <button
                            v-if="photoUrl"
                            type="button"
                            class="auth-profile-delete-btn"
                            @click="emit('photo-remove')"
                            data-testid="auth-profile-photo-delete-button"
                        >
                            {{ $t('auth.profile.details.delete') }}
                        </button>
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
                    size="lg"
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
                    size="lg"
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
                    size="lg"
                    class="auth-profile-field-input"
                    data-testid="auth-profile-email"
                    @update:model-value="updateEmail"
                />
            </div>
        </div>

        <div class="auth-profile-actions" data-testid="auth-profile-details-actions">
            <button
                type="button"
                class="auth-profile-link-btn"
                @click="emit('next')"
                data-testid="auth-profile-skip-button"
            >
                {{ $t('auth.profile.details.skip') }}
            </button>
            <UiButton
                variant="filled"
                tone="neutral"
                size="lg"
                data-testid="auth-profile-continue-button"
                @click="emit('next')"
            >
                <UiIcon name="strong-arrow-right" :size="16" />
                {{ $t('auth.profile.details.continue') }}
            </UiButton>
        </div>
    </div>
</template>

<style lang="scss">
.auth-profile-details-step {
    .auth-profile-head {
        .auth-profile-head-title {
            margin: 0;
            font-size: 52px;
            line-height: 1.08;
            color: var(--text-primary);
        }

        .auth-profile-head-subtitle {
            margin: 10px 0 0;
            color: var(--text-secondary);
            font-size: 14px;
        }
    }

    .auth-profile-block {
        margin-top: 44px;

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

                .auth-profile-avatar-image,
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .auth-profile-photo-meta {
                .auth-profile-photo-meta-text,
                p {
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

            .auth-profile-field-label,
            label {
                font-size: 14px;
                font-weight: 600;
                color: var(--text-primary);

                .auth-profile-field-label-optional,
                span {
                    color: var(--text-muted);
                    font-weight: 400;
                }
            }

            .auth-profile-field-input {
                width: 100%;
            }
        }

        .auth-profile-field-full {
            grid-column: 1 / -1;
        }
    }

    .auth-profile-actions {
        margin-top: 56px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 14px;

        .auth-profile-link-btn {
            border: 0;
            background: transparent;
            color: var(--text-primary);
            font-size: 16px;
            cursor: pointer;
        }

        .ui-button {
            min-width: 210px;
            border-radius: 16px;
            box-shadow: none;
            font-size: 18px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
    }
}

@media (max-width: 860px) {
    .auth-profile-details-step {
        .auth-profile-head {
            .auth-profile-head-title {
                font-size: 34px;
            }
        }

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

        .auth-profile-actions {
            margin-top: 34px;
            flex-direction: column;
            align-items: stretch;

            .auth-profile-link-btn {
                order: 2;
                font-size: 18px;
                text-align: center;
            }

            .ui-button {
                width: 100%;
                min-width: 0;
                font-size: 18px;
            }
        }
    }
}
</style>
