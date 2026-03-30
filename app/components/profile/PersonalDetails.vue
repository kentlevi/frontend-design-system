<script setup lang="ts">
import { computed } from 'vue';
import { useChangeEmailForm } from '~/composables/account/profile/useChangeEmailForm';
import { usePersonalForm } from '~/composables/account/profile/usePersonalForm';
import { useProfilePhoto } from '~/composables/account/profile/useProfilePhoto';
import { useProfilePhotoDisplay } from '~/utils/profile_photo/profile_photo';
import { useSocialAccount } from '~/composables/account/profile/useSocialAccount';
import { useUsersStore } from '~/stores/users/users.store';
import type { ProfileFieldDefinition } from '~/types/account/profile';

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		mode?: 'account' | 'auth';
		fields?: Record<string, string>;
		dynamicFields?: ProfileFieldDefinition[];
		email?: string;
		emailError?: string;
		emailDisabled?: boolean;
		emailRequired?: boolean;
		initials?: string;
		photoUrl?: string | null;
		photoError?: string;
	}>(),
	{
		mode: 'account',
		fields: () => ({}),
		dynamicFields: () => [],
		email: '',
		emailError: '',
		emailDisabled: true,
		emailRequired: false,
		initials: '',
		photoUrl: null,
		photoError: '',
	}
);

const emit = defineEmits<{
	(event: 'update:field', payload: { key: string; value: string }): void;
	(event: 'update:email', value: string): void;
	(event: 'photo-file-picked', file: File): void;
	(event: 'photo-remove'): void;
}>();

const is_auth_mode = computed(() => props.mode === 'auth');
const user_store = useUsersStore();
const { display_avatar, user_initial } = useProfilePhotoDisplay();
const { social } = useSocialAccount();

const {
	file_input,
	error: photo_inline_error,
	openFilePicker,
	onFilePicked: uploadPhoto,
	openDeletePhotoModal,
	deletePhoto,
} = useProfilePhoto();

const {
	form_state: personal_form_state,
	has_changes,
	field_errors,
	is_updating: name_is_submitting,
	dynamic_profile_fields,
	loadPersonalForm,
	submitPersonalForm,
} = usePersonalForm();

const { email: account_email, openEmailChangeModal } = useChangeEmailForm();

onMounted(() => {
	if (!is_auth_mode.value) {
		loadPersonalForm();
	}
});

const visible_dynamic_fields_auth = computed(() =>
	props.dynamicFields.filter((field) => Boolean(field.field_key))
);

const active_dynamic_fields = computed(() =>
	is_auth_mode.value ? visible_dynamic_fields_auth.value : dynamic_profile_fields.value
);

const avatar_src = computed(() => {
	if (is_auth_mode.value) {
		return props.photoUrl || display_avatar.value || '';
	}

	return display_avatar.value || '';
});

const avatar_text = computed(() =>
	is_auth_mode.value ? props.initials : user_initial.value
);

const has_photo = computed(() => Boolean(avatar_src.value));

const photo_error_message = computed(() => {
	if (is_auth_mode.value) {
		return photo_inline_error.value || props.photoError;
	}

	return photo_inline_error.value;
});

const photo_title_key = computed(() =>
	is_auth_mode.value ? 'auth.profile.details.photoTitle' : 'account.profile.profilePhoto'
);
const photo_hint_1_key = computed(() =>
	is_auth_mode.value ? 'auth.profile.details.photoHint1' : 'account.profile.photoHint1'
);
const photo_hint_2_key = computed(() =>
	is_auth_mode.value ? 'auth.profile.details.photoHint2' : 'account.profile.photoHint2'
);
const optional_label = computed(() =>
	is_auth_mode.value ? t('auth.register.optional') : t('account.profile.optional')
);
const upload_label = computed(() => {
	if (is_auth_mode.value) {
		return t('auth.profile.details.upload');
	}

	return has_photo.value
		? t('account.profile.uploadNewPhoto')
		: t('account.profile.uploadPhoto');
});
const delete_label = computed(() =>
	is_auth_mode.value ? t('auth.profile.details.delete') : t('account.profile.delete')
);

const form_testid = computed(() =>
	is_auth_mode.value ? 'auth-profile-details-form' : 'account-profile-form'
);
const photo_row_testid = computed(() =>
	is_auth_mode.value ? 'auth-profile-photo-row' : 'account-profile-photo-row'
);
const photo_input_testid = computed(() =>
	is_auth_mode.value ? 'auth-profile-photo-input' : 'account-profile-photo-input'
);
const photo_upload_button_testid = computed(() =>
	is_auth_mode.value
		? 'auth-profile-photo-upload-button'
		: 'account-profile-photo-upload-button'
);
const photo_delete_button_testid = computed(() =>
	is_auth_mode.value
		? 'auth-profile-photo-delete-button'
		: 'account-profile-photo-delete-button'
);
const email_testid = computed(() =>
	is_auth_mode.value ? 'auth-profile-email' : 'account-profile-email'
);
const field_testid_prefix = computed(() =>
	is_auth_mode.value ? 'auth-profile-' : 'account-profile-'
);
const photo_error_testid = computed(() =>
	is_auth_mode.value ? 'auth-profile-photo-error' : undefined
);
const email_error_testid = computed(() =>
	is_auth_mode.value ? 'auth-profile-email-error' : undefined
);

const email_label = computed(() =>
	is_auth_mode.value ? t('auth.profile.details.email') : t('account.profile.emailAddress')
);
const email_required = computed(() =>
	is_auth_mode.value ? Boolean(props.emailRequired) : true
);

function getFieldValue(field_key: string) {
	if (is_auth_mode.value) {
		return props.fields[field_key] || '';
	}

	return personal_form_state.fields[field_key] || '';
}

function getFieldError(field_key: string) {
	if (is_auth_mode.value) return '';
	return field_errors.value[field_key] || '';
}

function updateField(field_key: string, value: string) {
	if (is_auth_mode.value) {
		emit('update:field', {
			key: field_key,
			value,
		});
		return;
	}

	personal_form_state.fields[field_key] = value;
}

function updateEmail(value: string) {
	if (is_auth_mode.value) {
		emit('update:email', value);
	}
}

async function onAuthPhotoPicked(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];

	if (!file) return;

	const previous_file_name = user_store.state.profile?.file_name || null;
	await uploadPhoto(event);

	if (photo_inline_error.value) return;

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

async function removeAuthPhoto() {
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

async function handlePhotoPicked(event: Event) {
	if (is_auth_mode.value) {
		await onAuthPhotoPicked(event);
		return;
	}

	await uploadPhoto(event);
}

function handlePhotoDelete() {
	if (is_auth_mode.value) {
		void removeAuthPhoto();
		return;
	}

	openDeletePhotoModal();
}
</script>

<template>
	<div
		class="personal-details"
		:data-testid="is_auth_mode ? 'auth-profile-details-content' : undefined"
	>
		<div
			class="account-profile-photo-group"
			:data-testid="is_auth_mode ? 'auth-profile-photo-block' : undefined"
		>
			<div class="account-profile-photo-head">
				<div class="account-profile-label">
					{{ t(photo_title_key) }}
				</div>
				<p
					v-if="photo_error_message"
					class="account-profile-photo-error"
					:data-testid="photo_error_testid"
				>
					{{ photo_error_message }}
				</p>
			</div>
			<div
				class="account-profile-photo-row"
				:data-testid="photo_row_testid"
			>
				<div
					:class="[
						'account-profile-avatar',
						{ 'account-profile-avatar--error': photo_error_message },
					]"
				>
					<img
						v-if="avatar_src"
						:src="avatar_src"
						:alt="t(photo_title_key)"
						class="account-profile-avatar-image"
					>
					<span v-else class="account-profile-avatar-text">{{ avatar_text }}</span>
				</div>
				<div class="account-profile-photo-copy">
					<p class="account-profile-muted">
						{{ t(photo_hint_1_key) }}
					</p>
					<p class="account-profile-muted">
						{{ t(photo_hint_2_key) }}
					</p>
					<div class="account-profile-photo-actions">
						<input
							ref="file_input"
							type="file"
							class="account-profile-file-input"
							accept=".jpg,.jpeg,.png"
							:data-testid="photo_input_testid"
							@change="handlePhotoPicked"
						>
						<UiButton
							variant="outline"
							tone="neutral"
							size="md"
							class="account-profile-outline-button"
							:data-testid="photo_upload_button_testid"
							@click="openFilePicker"
						>
							{{ upload_label }}
						</UiButton>
						<UiButton
							v-if="has_photo"
							variant="ghost"
							tone="danger"
							size="md"
							class="account-profile-delete-button"
							:data-testid="photo_delete_button_testid"
							@click="handlePhotoDelete"
						>
							{{ delete_label }}
						</UiButton>
					</div>
				</div>
			</div>
		</div>

		<div class="account-profile-grid" :data-testid="form_testid">
			<div v-for="field in active_dynamic_fields" :key="field.id">
				<UiFormField
					:error="getFieldError(field.field_key)"
					:label="
						field.is_required
							? field.field_label
							: `${field.field_label} (${optional_label})`
					"
					:required="Boolean(field.is_required)"
				>
					<template v-if="!field.is_required" #label>
						<span class="ui-form-field-label-text">
							{{ field.field_label }}
						</span>
						<span class="account-profile-optional">
							({{ optional_label }})
						</span>
					</template>
					<template #default="{ inputId, describedBy }">
						<UiInput
							:id="inputId"
							:model-value="getFieldValue(field.field_key)"
							:state="getFieldError(field.field_key) ? 'error' : 'default'"
							type="text"
							:aria-describedby="describedBy || undefined"
							:data-testid="`${field_testid_prefix}${field.field_key}`"
							@update:model-value="updateField(field.field_key, $event)"
						/>
					</template>
				</UiFormField>
			</div>

			<UiFormField
				class="account-profile-grid-full"
				:label="email_label"
				:required="email_required"
			>
				<template #default="{ inputId, describedBy }">
					<template v-if="is_auth_mode">
						<UiInput
							:id="inputId"
							:model-value="props.email"
							type="email"
							size="md"
							:aria-describedby="describedBy || undefined"
							:disabled="props.emailDisabled"
							:required="props.emailRequired"
							:data-testid="email_testid"
							@update:model-value="updateEmail"
						/>
						<p v-if="props.emailDisabled" class="account-profile-email-helper-text">
							{{ t('auth.profile.details.emailDisabledHint') }}
						</p>
						<p
							v-if="props.emailError"
							class="account-profile-email-helper-text account-profile-photo-error"
							:data-testid="email_error_testid"
						>
							{{ props.emailError }}
						</p>
					</template>
					<template v-else>
						<div class="account-profile-email-input-wrap">
							<UiInput
								:id="inputId"
								:model-value="account_email"
								type="email"
								:aria-describedby="describedBy || undefined"
								:disabled="true"
								input-class="account-profile-email-input-field--locked"
								:data-testid="email_testid"
							/>
							<UiButton
								type="button"
								variant="ghost"
								tone="neutral"
								size="sm"
								:no-hover="true"
								class="account-profile-email-change-button"
								data-testid="account-profile-email-change-button"
								@click="openEmailChangeModal"
							>
								Change
							</UiButton>
						</div>
						<p v-if="social" class="account-profile-email-helper-text">
							This account is linked to your
							<span class="account-profile-social-text">{{
								capitalizeFirst(social)
							}}</span>
							login.
						</p>
					</template>
				</template>
			</UiFormField>
		</div>

		<div
			v-if="!is_auth_mode"
			class="account-profile-actions-right"
			data-testid="account-profile-save-wrap"
		>
			<UiButton
				variant="filled"
				tone="neutral"
				size="md"
				:disabled="!has_changes || name_is_submitting"
				data-testid="account-profile-save-button"
				@click="submitPersonalForm"
			>
				{{ t('account.profile.saveChanges') }}
			</UiButton>
		</div>
	</div>
</template>

<style scoped lang="scss">
.personal-details {
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

	.account-profile-social-text {
		color: var(--azure-base);
		font-weight: var(--font-weight-semibold);
	}

	.account-profile-email-input-wrap {
		position: relative;
	}

	.account-profile-email-change-button {
		position: absolute;
		top: 50%;
		right: 12px;
		transform: translateY(-50%);
		z-index: 1;
		min-height: 32px;
		padding: 0 8px;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		--btn-border: transparent;
	}

	:deep(
		.ui-input[data-disabled='true']
			.ui-input-field.account-profile-email-input-field--locked
	) {
		padding-right: 92px;
		color: var(--text-primary);
	}

	.account-profile-actions-right {
		display: flex;
		justify-content: flex-end;
	}
}
</style>