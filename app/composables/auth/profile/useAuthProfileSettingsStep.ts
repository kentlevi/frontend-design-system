import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { completeOnboarding } from '~/services/auth/api.service';
import { useCountry } from '~/composables/app/country/useCountry';
import { accountProfileDefaults } from '~/data/account/profile';
import { isValidAuthEmail } from '~/helpers/auth/auth.helper';
import { useAuthOnboardingStore } from '~/stores/auth/onboarding.store';
import { useUsersStore } from '~/stores/users/users.store';
import { fetchAndStoreUser } from '~/services/auth/auth.service';

function getNameValue(
	fields: Record<string, string>,
	possible_keys: string[],
	fallback: string
) {
	for (const key of possible_keys) {
		const value = (fields[key] || '').trim();
		if (value) return value;
	}

	return fallback;
}

export function useAuthProfileSettingsStep() {
	const onboarding_store = useAuthOnboardingStore();
	const users_store = useUsersStore();
	const { withCountry } = useCountry();
	const { promotions, reviews, profile_details_fields, mock_user, email } =
		storeToRefs(onboarding_store);
	const { state: user_state } = storeToRefs(users_store);
	const email_required = computed(
		() => !Boolean((user_state.value.email || '').trim())
	);
	const first_name = computed(() =>
		getNameValue(
			profile_details_fields.value,
			['first_name', 'given_name'],
			mock_user.value?.firstName || accountProfileDefaults.firstName
		)
	);
	const last_name = computed(() =>
		getNameValue(
			profile_details_fields.value,
			['last_name', 'family_name'],
			mock_user.value?.lastName || accountProfileDefaults.lastName
		)
	);

	async function completeSetup() {
		if (email_required.value && !isValidAuthEmail(email.value.trim())) {
			onboarding_store.setStep(1);
			return false;
		}

		if (user_state.value.id) {
			try {
				const payload = {
					fields: { ...profile_details_fields.value },
					offers_emails: promotions.value,
					reviews_emails: reviews.value,
					...(email_required.value
						? { email: email.value.trim() }
						: {}),
				};

				const response = await completeOnboarding(payload);
				if (!response.success) {
					return false;
				}

				await fetchAndStoreUser();
				await navigateTo(withCountry('/'));

				onboarding_store.setStep(1);
				onboarding_store.clearOnboardingDraft();
				users_store.clearOnboardingProfile();
				return true;
			} catch (error) {
				console.warn('Failed to finalize onboarding.', error);
				return false;
			}
		}

		onboarding_store.setMockUser({
			firstName: first_name.value || accountProfileDefaults.firstName,
			lastName: last_name.value || accountProfileDefaults.lastName,
			email: email.value.trim() || accountProfileDefaults.email,
		});

		await navigateTo(withCountry('/'));
		onboarding_store.setStep(1);
		onboarding_store.clearOnboardingDraft();
		users_store.clearOnboardingProfile();
		return true;
	}

	return {
		promotions,
		reviews,
		updatePromotions: onboarding_store.setPromotions,
		updateReviews: onboarding_store.setReviews,
		goBack: () => onboarding_store.setStep(1),
		completeSetup,
	};
}