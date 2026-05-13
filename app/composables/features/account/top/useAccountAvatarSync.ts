const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';

export const useAccountAvatarSync = () => {
	const local_avatar_data_url = ref<string | null>(null);

	const sync_from_storage = () => {
		if (!import.meta.client) return;
		local_avatar_data_url.value = window.localStorage.getItem(ACCOUNT_LOCAL_AVATAR_KEY);
	};

	const handle_avatar_updated = (event: Event) => {
		const custom_event = event as CustomEvent<string | null>;
		const next_value = custom_event.detail;
		if (typeof next_value === 'string' || next_value === null) {
			local_avatar_data_url.value = next_value;
			return;
		}
		sync_from_storage();
	};

	onMounted(() => {
		sync_from_storage();
		window.addEventListener('storage', sync_from_storage);
		window.addEventListener(ACCOUNT_AVATAR_UPDATED_EVENT, handle_avatar_updated as EventListener);
	});

	onBeforeUnmount(() => {
		window.removeEventListener('storage', sync_from_storage);
		window.removeEventListener(ACCOUNT_AVATAR_UPDATED_EVENT, handle_avatar_updated as EventListener);
	});

	return {
		local_avatar_data_url,
	};
};
