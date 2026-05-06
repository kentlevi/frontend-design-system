<script setup lang="ts">
import { useAuthProfilePersonalDetails } from '~/composables/auth/profile/useAuthProfilePersonalDetails';
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';

const { t: translate } = useI18n();

const {
	visible_dynamic_fields,
	email,
	email_input_error,
	email_disabled,
	email_required,
	initials,
	display_avatar,
	photo_error,
	file_input,
	has_photo,
	is_delete_photo_modal_open,
	getFieldValue,
	updateField,
	updateEmail,
	openFilePicker,
	handlePhotoPicked,
	openDeletePhotoModal,
	closeDeletePhotoModal,
	confirmPhotoDelete,
} = useAuthProfilePersonalDetails();
</script>

<template>
	<div class="personal-details" data-testid="auth-profile-details-content">
		<div
			class="account-profile-photo-group"
			data-testid="auth-profile-photo-block"
		>
			<div class="account-profile-photo-head">
				<div class="account-profile-label">
					{{ translate('auth.profile.details.photoTitle') }}
				</div>
				<p
					v-if="photo_error"
					class="account-profile-photo-error"
					data-testid="auth-profile-photo-error"
				>
					{{ photo_error }}
				</p>
			</div>
			<div
				class="account-profile-photo-row"
				data-testid="auth-profile-photo-row"
			>
				<div
					:class="[
						'account-profile-avatar',
						{ 'account-profile-avatar--error': photo_error },
					]"
				>
					<img
						v-if="display_avatar"
						:src="display_avatar"
						:alt="translate('auth.profile.details.photoTitle')"
						class="account-profile-avatar-image"
					>
					<span v-else class="account-profile-avatar-text">{{
						initials
					}}</span>
				</div>
				<div class="account-profile-photo-copy">
					<p class="account-profile-muted">
						{{ translate('auth.profile.details.photoHint1') }}
					</p>
					<p class="account-profile-muted">
						{{ translate('auth.profile.details.photoHint2') }}
					</p>
					<div class="account-profile-photo-actions">
						<input
							ref="file_input"
							type="file"
							class="account-profile-file-input"
							accept=".jpg,.jpeg,.png"
							data-testid="auth-profile-photo-input"
							@change="handlePhotoPicked"
						>
						<UiButton
							variant="outline"
							tone="neutral"
							size="md"
							class="account-profile-outline-button"
							data-testid="auth-profile-photo-upload-button"
							@click="openFilePicker"
						>
							{{
								has_photo
									? translate(
										'account.profile.uploadNewPhoto'
									)
									: translate('account.profile.uploadPhoto')
							}}
						</UiButton>
						<UiButton
							v-if="has_photo"
							variant="ghost"
							tone="danger"
							size="md"
							class="account-profile-delete-button"
							data-testid="auth-profile-photo-delete-button"
							@click="openDeletePhotoModal"
						>
							{{ translate('auth.profile.details.delete') }}
						</UiButton>
					</div>
				</div>
			</div>
		</div>

		<div
			class="account-profile-grid"
			data-testid="auth-profile-details-form"
		>
			<div v-for="field in visible_dynamic_fields" :key="field.id">
				<UiFormField
					:label="field.field_label"
					:required="Boolean(field.is_required)"
				>
					<template v-if="!field.is_required" #label>
						<span class="ui-form-field-label-text">
							{{ field.field_label }}
						</span>
						<span class="account-profile-optional">
							({{ translate('auth.register.optional') }})
						</span>
					</template>
					<template #default="{ inputId, describedBy }">
						<UiInput
							:id="inputId"
							:model-value="getFieldValue(field.field_key)"
							type="text"
							:aria-describedby="describedBy || undefined"
							:data-testid="`auth-profile-${field.field_key}`"
							@update:model-value="
								updateField(field.field_key, $event)
							"
						/>
					</template>
				</UiFormField>
			</div>

			<UiFormField
				class="account-profile-grid-full"
				:label="translate('auth.profile.details.email')"
				:required="Boolean(email_required)"
			>
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						:model-value="email"
						type="email"
						size="md"
						:aria-describedby="describedBy || undefined"
						:disabled="email_disabled"
						:required="email_required"
						data-testid="auth-profile-email"
						@update:model-value="updateEmail"
					/>
					<p
						v-if="email_disabled"
						class="account-profile-email-helper-text"
					>
						{{
							translate('auth.profile.details.emailDisabledHint')
						}}
					</p>
					<p
						v-if="email_input_error"
						class="account-profile-email-helper-text account-profile-photo-error"
						data-testid="auth-profile-email-error"
					>
						{{ email_input_error }}
					</p>
				</template>
			</UiFormField>
		</div>
	</div>

	<DeleteConfirmModal
		:model-value="is_delete_photo_modal_open"
		:title="translate('account.profile.photoDeleteConfirm')"
		:description="translate('account.profile.photoDeleteDescription')"
		:cancel-label="translate('account.profile.cancel')"
		:confirm-label="translate('account.profile.delete')"
		modal-class="account-profile-delete-photo-modal-shell"
		test-id="account-profile-delete-photo-modal"
		@cancel="closeDeletePhotoModal"
		@confirm="confirmPhotoDelete"
	/>
</template>

<style scoped lang="scss">
.personal-details {
	display: flex;
	flex-direction: column;
	gap: 24px;

	.account-profile-label {
		display: block;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		margin-bottom: 10px;
	}

	.account-profile-photo-head {
		display: flex;
		justify-content: space-between;

		.account-profile-label {
			margin-bottom: 0;
		}

		.account-profile-photo-error {
			text-align: left;
			max-width: 100%;
		}
	}

	.account-profile-photo-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 427px;
	}

	.account-profile-photo-row {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 32px;
		align-items: center;

		.account-profile-avatar {
			width: 120px;
			height: 120px;
			border-radius: 50%;
			border: 1px solid transparent;
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

		.account-profile-avatar--error {
			border-color: var(--error);
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
	}

	.account-profile-photo-error {
		color: var(--error);
		font-size: var(--type-size-100);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-100);
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

	.account-profile-email-helper-text {
		margin: 0;
		color: var(--text-secondary);
	}
}

@media (max-width: 860px) {
	.personal-details {
		.account-profile-photo-row {
			grid-template-columns: 1fr;
		}

		.account-profile-grid {
			grid-template-columns: 1fr;

			.account-profile-grid-full {
				grid-column: auto;
			}
		}
	}
}
</style>