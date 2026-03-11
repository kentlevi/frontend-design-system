import { computed } from 'vue';
import {
	getProfileFieldValue,
	normalizeAccountName,
} from '~/utils/account/accountProfile';
import { useUserStore } from '~/stores/user';

type MockUserCookie = {
	firstName?: string;
	lastName?: string;
	email?: string;
};

export function useHomeWelcomePopover() {
	const { t } = useI18n();
	const user_store = useUserStore();
	const mock_user = useCookie<MockUserCookie | null>('mock_user', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});

	const store_first_name = computed(() =>
		getProfileFieldValue(user_store.profile?.user_field_values ?? [], 'first_name')
	);

	const email_local_part = computed(() => {
		const source = (user_store.email || mock_user.value?.email || '').trim();
		if (!source.includes('@')) return '';
		return source.split('@')[0] || '';
	});

	const greeting_name = computed(() => {
		const normalized_name = normalizeAccountName(
			store_first_name.value ||
				user_store.onboardingProfile?.firstName ||
				mock_user.value?.firstName ||
				email_local_part.value ||
				t('home.welcome.defaultName'),
			''
		);

		return normalized_name.firstName || t('home.welcome.defaultName');
	});

	return {
		greetingName: greeting_name,
	};
}