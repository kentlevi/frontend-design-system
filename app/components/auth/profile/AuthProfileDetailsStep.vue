<script setup lang="ts">
import { computed } from 'vue';
import PersonalDetails from '~/components/profile/PersonalDetails.vue';
import type { ProfileFieldDefinition } from '~/types/account/profile';

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

			<PersonalDetails
				mode="auth"
				:fields="props.fields"
				:dynamic-fields="props.dynamicFields"
				:email="props.email"
				:email-error="props.emailError"
				:email-disabled="props.emailDisabled"
				:email-required="props.emailRequired"
				:initials="props.initials"
				:photo-url="props.photoUrl"
				:photo-error="props.photoError"
				@update:field="emit('update:field', $event)"
				@update:email="emit('update:email', $event)"
				@photo-file-picked="emit('photo-file-picked', $event)"
				@photo-remove="emit('photo-remove')"
			/>
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