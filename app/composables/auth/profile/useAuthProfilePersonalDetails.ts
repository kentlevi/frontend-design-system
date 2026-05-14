import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { deleteAvatar, saveAvatar } from '~/services/profile/avatar.service';
import { accountProfileDefaults } from '~/data/account/profile';
import { useAuthOnboardingStore } from '~/stores/auth/onboarding.store';
import { useUsersStore } from '~/stores/users/users.store';
import { processAvatarFile } from '~/utils/avatar/processAvatar';
import {
	getAccountInitials,
	getProfileFieldValue,
} from '~/utils/account/accountProfile';
import { isValidImage } from '~/utils/file/file';
import { uploadFileToPresignedUrl } from '~/utils/file/presignedUrl';
import { useProfileFieldsStore } from '~/stores/users/profile_field.store';

function getNameFieldKey(
	dynamic_profile_fields: Array<{ field_key: string }>,
	possible_keys: string[]
) {
	const matched_field = dynamic_profile_fields.find((field) =>
		possible_keys.includes(field.field_key)
	);
	return matched_field?.field_key || '';
}

export function useAuthProfilePersonalDetails() {
	const { t: translate } = useI18n();
	const MAX_PROFILE_PHOTO_BYTES = 3 * 1024 * 1024;
	const onboarding_store = useAuthOnboardingStore();
	const users_store = useUsersStore();
	const profile_fields_store = useProfileFieldsStore();
	const loading_overlay_store = useLoadingOverlayStore();
	const toast_store = useToastStore();
	const config = useRuntimeConfig();

	const { email, email_input_error, mock_user, profile_details_fields } =
		storeToRefs(onboarding_store);
	const { state: user_state } = storeToRefs(users_store);
	const { dynamic_profile_fields: profile_fields } =
		storeToRefs(profile_fields_store);

	const file_input = ref<HTMLInputElement | null>(null);
	const is_delete_photo_modal_open = ref(false);
	const photo_error = ref('');

	const dynamic_profile_fields = computed(() =>
		Array.isArray(profile_fields.value) ? profile_fields.value : []
	);
	const visible_dynamic_fields = computed(() =>
		dynamic_profile_fields.value.filter((field) => Boolean(field.field_key))
	);
	const profile_field_values = computed(
		() => user_state.value.profile?.user_field_values ?? []
	);
	const first_name_field_key = computed(() =>
		getNameFieldKey(dynamic_profile_fields.value, [
			'first_name',
			'given_name',
		])
	);
	const last_name_field_key = computed(() =>
		getNameFieldKey(dynamic_profile_fields.value, [
			'last_name',
			'family_name',
		])
	);
	const first_name = computed(() => {
		const field_key = first_name_field_key.value;
		const source_value =
			getProfileFieldValue(
				profile_field_values.value,
				'first_name',
				dynamic_profile_fields.value
			) ||
			user_state.value.onboardingProfile?.firstName ||
			mock_user.value?.firstName ||
			accountProfileDefaults.firstName;

		if (!field_key) {
			return source_value.trim();
		}

		return (profile_details_fields.value[field_key] || '').trim();
	});
	const last_name = computed(() => {
		const field_key = last_name_field_key.value;
		const source_value =
			getProfileFieldValue(
				profile_field_values.value,
				'last_name',
				dynamic_profile_fields.value
			) ||
			user_state.value.onboardingProfile?.lastName ||
			mock_user.value?.lastName ||
			accountProfileDefaults.lastName;

		if (!field_key) {
			return source_value.trim();
		}

		return (profile_details_fields.value[field_key] || '').trim();
	});
	const email_disabled = computed(() =>
		Boolean((user_state.value.email || '').trim())
	);
	const email_required = computed(() => !email_disabled.value);
	const initials = computed(() =>
		getAccountInitials(first_name.value, last_name.value)
	);
	const display_avatar = computed(() => {
		const base_url = config.public.s3_file_url;
		const folder_path = user_state.value.profile?.file_path?.file_path;
		const file_name = user_state.value.profile?.file_name;

		if (!base_url || !folder_path || !file_name) {
			return '';
		}

		const normalized_base = base_url.endsWith('/')
			? base_url
			: `${base_url}/`;
		const normalized_path = folder_path.startsWith('/')
			? folder_path.slice(1)
			: folder_path;

		return `${normalized_base}${normalized_path}${file_name}`;
	});
	const has_photo = computed(() => Boolean(display_avatar.value));

	function resetPhotoInput() {
		if (file_input.value) {
			file_input.value.value = '';
		}
	}

	function openFilePicker() {
		resetPhotoInput();
		file_input.value?.click();
	}

	function openDeletePhotoModal() {
		is_delete_photo_modal_open.value = true;
	}

	function closeDeletePhotoModal() {
		is_delete_photo_modal_open.value = false;
	}

	function getFieldValue(field_key: string) {
		return profile_details_fields.value[field_key] || '';
	}

	function updateField(field_key: string, value: string) {
		onboarding_store.updateProfileDetailField(field_key, value);
	}

	function updateEmail(value: string) {
		onboarding_store.setEmail(value);
	}

	async function handlePhotoPicked(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		photo_error.value = '';
		if (!isValidImage(file)) {
			photo_error.value = translate('auth.profile.details.photoInvalidType');
			resetPhotoInput();
			return;
		}
		if (file.size > MAX_PROFILE_PHOTO_BYTES) {
			photo_error.value = translate('auth.profile.details.photoTooLarge');
			resetPhotoInput();
			return;
		}

		loading_overlay_store.startLoading('upload_avatar', {
			showCopy: true,
			testId: 'auth-profile-upload-avatar-overlay',
			position: 'fixed',
		});

		try {
			let processed_avatar;

			try {
				processed_avatar = await processAvatarFile(
					file,
					'image/webp',
					0.82
				);
			} catch {
				photo_error.value = translate(
					'auth.profile.details.photoProcessFailed'
				);
				return;
			}

			const { file_name } = await uploadFileToPresignedUrl({
				file_path_code: 'avatar',
				file: processed_avatar.file,
			});
			const response = await saveAvatar(
				processed_avatar.file.name,
				file_name
			);

			users_store.setProfileField('file_name', file_name);
			toast_store.handleApiResponse(response);
		} catch {
			toast_store.showUpdateError();
		} finally {
			resetPhotoInput();
			loading_overlay_store.stopLoading('upload_avatar');
		}
	}

	async function confirmPhotoDelete() {
		closeDeletePhotoModal();
		resetPhotoInput();

		if (!users_store.state.profile?.file_name) {
			return;
		}

		loading_overlay_store.startLoading('delete_avatar', {
			showCopy: true,
			testId: 'auth-profile-delete-avatar-overlay',
			position: 'fixed',
		});

		try {
			const response = await deleteAvatar();
			users_store.setProfileField('file_name', null);
			toast_store.handleApiResponse(response);
		} catch {
			toast_store.showUpdateError();
		} finally {
			loading_overlay_store.stopLoading('delete_avatar');
		}
	}

	return {
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
	};
}