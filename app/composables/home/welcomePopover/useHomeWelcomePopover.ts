import { computed } from 'vue';
import {
	getProfileFieldValue,
	normalizeAccountName,
} from '~/utils/account/accountProfile';
import { useUsersStore } from '~/stores/users/users.store';

type MockUserCookie = {
	firstName?: string;
	lastName?: string;
	email?: string;
};

export function useHomeWelcomePopover() {
	const { t } = useI18n();
	const { state } = storeToRefs(useUsersStore());
	const mock_user = useCookie<MockUserCookie | null>('mock_user', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});

	const store_first_name = computed(() =>
		getProfileFieldValue(state.value.profile?.user_field_values ?? [], 'first_name')
	);

	const email_local_part = computed(() => {
		const source = (state.value.email || mock_user.value?.email || '').trim();
		if (!source.includes('@')) return '';
		return source.split('@')[0] || '';
	});

	const greeting_name = computed(() => {
		const normalized_name = normalizeAccountName(
			store_first_name.value ||
			state.value.onboardingProfile?.firstName ||
			mock_user.value?.firstName ||
			email_local_part.value ||
			t('home.welcome.defaultName'),
			''
		);

		return normalized_name.firstName || t('home.welcome.defaultName');
	});

	return {
		greeting_name,
	};
}