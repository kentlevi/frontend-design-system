<script setup lang="ts">
import { computed } from 'vue';
import { useProfilePhoto } from '~/composables/account/profile/useProfilePhoto';
import { useUsersStore } from '~/stores/users/users.store';
import type { ProfileFieldDefinition } from '~/types/account/profile';
import { useProfilePhotoDisplay } from '~/utils/profile_photo/profile_photo';

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		fields?: Record<string, string>;
		dynamicFields?: ProfileFieldDefinition[];
		email?: string;
		emailError?: string;
		emailDisabled?: boolean;
		emailRequired?: boolean;
		initials?: string;
		photoUrl?: string | null;
		photoError?: string;
		canContinue?: boolean;
		canSkip?: boolean;
	}>(),
	{
		fields: () => ({}),
		dynamicFields: () => [],
		email: '',
		emailError: '',
		emailDisabled: true,
		emailRequired: false,
		initials: '',
		photoUrl: null,
		photoError: '',
		canContinue: false,
		canSkip: true,
	}
);

const emit = defineEmits<{
	(event: 'update:field', payload: { key: string; value: string }): void;
	(event: 'update:email', value: string): void;
	(event: 'next'): void;
	(event: 'skip'): void;
	(event: 'photo-file-picked', file: File): void;
	(event: 'photo-remove'): void;
}>();

const user_store = useUsersStore();
const { display_avatar } = useProfilePhotoDisplay();

const {
	file_input,
	error: upload_photo_error,
	openFilePicker,
	onFilePicked: uploadPhoto,
	deletePhoto,
} = useProfilePhoto();

const has_photo = computed(() => Boolean(props.photoUrl || display_avatar.value));
const displayed_photo_url = computed(() => props.photoUrl || display_avatar.value || null);
const displayed_photo_error = computed(() => upload_photo_error.value || props.photoError);
const visible_dynamic_fields = computed(() => props.dynamicFields.filter((field) => Boolean(field.field_key)));
const first_name_field_aliases = new Set(['first_name', 'given_name']);

const welcome_name = computed(() => {
	for (const field of visible_dynamic_fields.value) {
		if (!first_name_field_aliases.has(field.field_key)) continue;
		const value = props.fields[field.field_key]?.trim();
		if (value) return value;
	}

	for (const field of visible_dynamic_fields.value) {
		const value = props.fields[field.field_key]?.trim();
		if (value) return value;
	}

	return '';
});

function getFieldLabel(field: ProfileFieldDefinition) {
	const translation_key = `account.profile.${field.field_key}`;
	const translated_label = t(translation_key);
	return translated_label === translation_key
		? field.field_label
		: translated_label;
}

function updateEmail(value: string) {
	emit('update:email', value);
}

function updateField(field_key: string, value: string) {
	emit('update:field', {
		key: field_key,
		value,
	});
}

async function onPhotoPicked(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];

	if (!file) return;

	const previous_file_name = user_store.state.profile?.file_name || null;
	await uploadPhoto(event);

	if (upload_photo_error.value) return;

	if (!user_store.state.profile) {
		emit('photo-file-picked', file);
		return;
	}

	const current_file_name = user_store.state.profile.file_name || null;
	const has_new_store_avatar = Boolean(current_file_name)
		&& current_file_name !== previous_file_name;

	if (has_new_store_avatar) {
		emit('photo-file-picked', file);
	}
}

async function removePhoto() {
	const had_local_preview = Boolean(props.photoUrl);
	const had_store_avatar = Boolean(user_store.state.profile?.file_name);

	await deletePhoto();

	const has_store_avatar = Boolean(user_store.state.profile?.file_name);
	const removed_store_avatar = had_store_avatar && !has_store_avatar;
	const had_only_local_preview = had_local_preview && !had_store_avatar;
	const should_clear_local_preview = removed_store_avatar || had_only_local_preview;

	if (should_clear_local_preview) {
		emit('photo-remove');
	}
}
</script>

<template>
	<div class="auth-profile-details-step" data-testid="auth-profile-details-step">
		<div class="auth-profile-details-main" data-testid="auth-profile-details-main">
			<header class="auth-profile-head" data-testid="auth-profile-details-header">
				<h1 class="auth-profile-head-title">
					{{
						$t('auth.profile.details.title', {
							name: welcome_name || 'User',
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
						<div class="auth-profile-avatar">
							<img
								v-if="displayed_photo_url"
								:src="displayed_photo_url"
								alt="Profile photo"
								class="auth-profile-avatar-image"
							>
							<span v-else class="auth-profile-avatar-initials">{{ initials }}</span>
						</div>

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
									ref="file_input"
									type="file"
									class="auth-profile-file-input"
									accept=".jpg,.jpeg,.png"
									data-testid="auth-profile-photo-input"
									@change="onPhotoPicked"
								>
								<UiButton
									variant="outline"
									tone="neutral"
									size="md"
									class="auth-profile-outline-btn"
									data-testid="auth-profile-photo-upload-button"
									@click="openFilePicker"
								>
									{{ $t('auth.profile.details.upload') }}
								</UiButton>
								<UiButton
									v-if="has_photo"
									variant="ghost"
									tone="danger"
									size="md"
									class="auth-profile-delete-btn"
									data-testid="auth-profile-photo-delete-button"
									@click="removePhoto"
								>
									{{ $t('auth.profile.details.delete') }}
								</UiButton>
							</div>
							<p
								v-if="displayed_photo_error"
								class="auth-profile-photo-error"
								data-testid="auth-profile-photo-error"
							>
								{{ displayed_photo_error }}
							</p>
						</div>
					</div>
				</div>

				<div class="auth-profile-form-grid" data-testid="auth-profile-details-form">
					<div
						v-for="field in visible_dynamic_fields"
						:key="field.id"
						class="auth-profile-field"
					>
						<label class="auth-profile-field-label">
							{{ getFieldLabel(field) }}
							<span
								v-if="field.is_required"
								class="auth-profile-field-label-required"
								aria-hidden="true"
							>
								*
							</span>
							<span
								v-else
								class="auth-profile-field-label-optional"
							>
								({{ $t('auth.register.optional') }})
							</span>
						</label>
						<UiInput
							:model-value="props.fields[field.field_key] || ''"
							type="text"
							size="md"
							class="auth-profile-field-input"
							:data-testid="`auth-profile-${field.field_key}`"
							@update:model-value="updateField(field.field_key, $event)"
						/>
					</div>
					<div class="auth-profile-field auth-profile-field-full">
						<label class="auth-profile-field-label">
							{{ $t('auth.profile.details.email') }}
							<span
								v-if="props.emailRequired"
								class="auth-profile-field-label-required"
								aria-hidden="true"
							>
								*
							</span>
						</label>
						<UiInput
							:model-value="props.email"
							type="email"
							size="md"
							class="auth-profile-field-input"
							data-testid="auth-profile-email"
							:disabled="props.emailDisabled"
							:required="props.emailRequired"
							@update:model-value="updateEmail"
						/>
						<p v-if="props.emailDisabled" class="auth-profile-field-help">
							{{ $t('auth.profile.details.emailDisabledHint') }}
						</p>
						<p
							v-if="props.emailError"
							class="auth-profile-field-help auth-profile-field-help-error"
							data-testid="auth-profile-email-error"
						>
							{{ props.emailError }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="auth-profile-actions" data-testid="auth-profile-details-actions">
			<UiButton
				v-if="props.canSkip"
				variant="ghost"
				tone="neutral"
				size="md"
				class="auth-profile-link-btn"
				data-testid="auth-profile-skip-button"
				@click="emit('skip')"
			>
				{{ $t('auth.profile.details.skip') }}
			</UiButton>
			<UiButton
				variant="filled"
				tone="neutral"
				size="md"
				class="auth-profile-continue-btn"
				data-testid="auth-profile-continue-button"
				:disabled="!props.canContinue"
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

                font-size: var(--type-size-400);
                line-height: var(--type-line-400);
                font-weight: var(--font-weight-semibold);
                color: var(--text-primary);
            }

            .auth-profile-head-subtitle {
                color: var(--text-secondary);
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
            }
        }

        .auth-profile-content {

            .auth-profile-block {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .auth-profile-label {
                    display: block;
                    font-size: var(--type-size-100);
                    line-height: var(--type-line-100);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                }

                .auth-profile-photo-row {
                    display: grid;
                    grid-template-columns: 110px 1fr;
                    gap: 32px;
                    align-items: center;

                    .auth-profile-avatar {
                        width: 110px;
                        height: 110px;
                        border-radius: 50%;
                        background: var(--gray-40);
                        display: grid;
                        place-items: center;
                        color: var(--black-base);
                        font-size: var(--type-size-550);
                        line-height: var(--type-line-550);
                        font-weight: var(--font-weight-bold);
                        overflow: hidden;

                        .auth-profile-avatar-image {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
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

                            color: var(--text-secondary);
                            font-size: var(--type-size-100);
                            line-height: var(--type-line-100);
                        }

                        .auth-profile-photo-error {

                            color: var(--error);
                            font-size: var(--type-size-100);
                            line-height: var(--type-line-100);
                        }

                        .auth-profile-photo-actions {

                            .auth-profile-file-input {
                                display: none;
                            }

                            .auth-profile-outline-btn {
                                padding: 8px 24px;
                                border-radius: 16px;
                                border: 1px solid var(--text-primary);
                                background: transparent;
                                color: var(--text-primary);
                                font-size: var(--type-size-200);
                                font-weight: var(--font-weight-semibold);
                                line-height: var(--type-line-200);
                                cursor: pointer;
                            }

                            .auth-profile-delete-btn {
                                border: 0;
                                background: transparent;
                                color: var(--error);
                                font-size: var(--type-size-200);
                                line-height: var(--type-line-200);
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
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                        font-weight: var(--font-weight-semibold);
                        color: var(--text-primary);

                        .auth-profile-field-label-required {
                            color: var(--error);
                            margin-left: 2px;
                        }

                        .auth-profile-field-label-optional {
                            color: var(--text-secondary);
                            font-weight: var(--font-weight-regular);
                        }
                    }

                    .auth-profile-field-input {
                        width: 100%;
                        box-shadow: none;
                    }

                    .auth-profile-field-help {

                        color: var(--text-secondary);
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                    }

                    .auth-profile-field-help-error {
                        color: var(--error);
                        font-weight: var(--font-weight-semibold);
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
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
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
                    font-size: var(--type-size-550);
                    line-height: var(--type-line-550);
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
                font-size: var(--type-size-200);
                line-height: var(--type-line-200);
                text-align: center;
            }

            .ui-button {
                width: 100%;
                min-width: 0;
                font-size: var(--type-size-200);
                line-height: var(--type-line-200);
            }
        }
    }
}
</style>