import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { accountProfileDefaults, type AccountMockUser } from '~/data/account/profile';
import { useCountry } from '~/composables/app/useCountry';
import { useUserStore, type UserFieldValue } from '~/stores/user';

type ProfileStep = 1 | 2;
type ProfileUnit = 'millimeter' | 'inch';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

export function useAuthProfileSetup() {
    const { withCountry } = useCountry();
    const userStore = useUserStore();
    const mockUser = useCookie<AccountMockUser | null>('mock_user', {
        default: () => null,
        sameSite: 'lax',
        path: '/',
    });

    const step = ref<ProfileStep>(1);
    const showWelcomeToast = ref(Boolean(userStore.onboardingProfile?.onboarding));
    let toastTimeout: ReturnType<typeof setTimeout> | null = null;

    const profileFieldValues = computed(
        () => userStore.profile?.user_field_values ?? []
    );
    function getFieldValueByKey(key: 'first_name' | 'last_name') {
        const legacyId = key === 'first_name' ? 1 : 2;
        const directMatch =
            profileFieldValues.value.find(
                (field) =>
                    field.country_field?.field_key === key ||
                    (field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) === legacyId
            )?.value?.trim() || '';
        if (directMatch) return directMatch;

        const fallbackRows = [...profileFieldValues.value]
            .filter((field) => typeof field.value === 'string' && field.value.trim())
            .sort(
                (a, b) =>
                    (a.country_field_id ?? a.country_field_ids ?? a.country_fields_id ?? Number.MAX_SAFE_INTEGER) -
                    (b.country_field_id ?? b.country_field_ids ?? b.country_fields_id ?? Number.MAX_SAFE_INTEGER)
            )
            .slice(0, 2);
        if (fallbackRows.length < 2) return '';
        return key === 'first_name'
            ? (fallbackRows[0]?.value?.trim() || '')
            : (fallbackRows[1]?.value?.trim() || '');
    }
    const storeFirstName = computed(
        () => getFieldValueByKey('first_name')
    );
    const storeLastName = computed(
        () => getFieldValueByKey('last_name')
    );

    const firstName = ref(
        storeFirstName.value ||
            userStore.onboardingProfile?.firstName ||
            mockUser.value?.firstName ||
            accountProfileDefaults.firstName
    );
    const lastName = ref(
        storeLastName.value ||
            userStore.onboardingProfile?.lastName ||
            mockUser.value?.lastName ||
            accountProfileDefaults.lastName
    );
    const email = ref(
        userStore.email ||
            userStore.onboardingProfile?.email ||
            mockUser.value?.email ||
            accountProfileDefaults.email
    );

    const photoUrl = ref<string | null>(null);

    const promotions = ref(true);
    const reviews = ref(true);
    const confirmations = ref(true);
    const useShippingAsBilling = ref(true);
    const unit = ref<ProfileUnit>('millimeter');

    const initials = computed(() => {
        const first = firstName.value.trim().charAt(0).toUpperCase();
        const last = lastName.value.trim().charAt(0).toUpperCase();
        return `${first || 'U'}${last || ''}`;
    });

    function dismissToast() {
        showWelcomeToast.value = false;
    }

    function clearToastTimeout() {
        if (!toastTimeout) return;
        clearTimeout(toastTimeout);
        toastTimeout = null;
    }

    function startToastTimeout() {
        clearToastTimeout();
        toastTimeout = setTimeout(() => {
            showWelcomeToast.value = false;
        }, 3500);
    }

    function revokePhotoUrl() {
        if (photoUrl.value?.startsWith('blob:')) {
            URL.revokeObjectURL(photoUrl.value);
        }
    }

    function onPhotoFilePicked(file: File | null) {
        if (!file || !IMAGE_MIME_TYPES.includes(file.type)) return;

        revokePhotoUrl();
        photoUrl.value = URL.createObjectURL(file);
    }

    function removePhoto() {
        revokePhotoUrl();
        photoUrl.value = null;
    }

    function goNext() {
        step.value = 2;
    }

    function goBack() {
        step.value = 1;
    }

    async function completeSetup() {
        const authToken = useCookie<string | null>('auth_token');
        if (!authToken.value) {
            mockUser.value = {
                firstName: firstName.value.trim() || accountProfileDefaults.firstName,
                lastName: lastName.value.trim() || accountProfileDefaults.lastName,
                email: email.value.trim() || accountProfileDefaults.email,
            };
        }
        await navigateTo(withCountry('/'));
    }

    watch(
        showWelcomeToast,
        (isVisible) => {
            if (isVisible) {
                startToastTimeout();
            } else {
                clearToastTimeout();
            }
        },
        { immediate: true }
    );

    onBeforeUnmount(() => {
        clearToastTimeout();
        revokePhotoUrl();
    });

    userStore.clearOnboardingProfile();

    return {
        step,
        showWelcomeToast,
        firstName,
        lastName,
        email,
        photoUrl,
        promotions,
        reviews,
        confirmations,
        useShippingAsBilling,
        unit,
        initials,
        dismissToast,
        onPhotoFilePicked,
        removePhoto,
        goNext,
        goBack,
        completeSetup,
    };
}
