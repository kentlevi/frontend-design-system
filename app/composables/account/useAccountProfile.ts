import { computed, onBeforeUnmount, ref } from 'vue';
import {
    accountProfileDefaults,
    type AccountMockUser,
    type AccountUnit,
} from '~/data/account/profile';
import { useCountry } from '~/composables/app/useCountry';
import type { UserFieldValue } from '~/stores/user';

export function useAccountProfile() {
    const { withCountry, apiCountry } = useCountry();
    const api = useApi();
    const userStore = useUserStore();
    const mockUser = useCookie<AccountMockUser | null>('mock_user');
    const authToken = useCookie<string | null>('auth_token');

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

        // Fallback for environments where field keys are not returned in API payload.
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

    function normalizeName(first: string, last: string) {
        const firstTrimmed = first.trim();
        const lastTrimmed = last.trim();
        if (lastTrimmed || !firstTrimmed.includes(' ')) {
            return { firstName: firstTrimmed, lastName: lastTrimmed };
        }
        const parts = firstTrimmed.split(/\s+/).filter(Boolean);
        if (parts.length < 2) {
            return { firstName: firstTrimmed, lastName: lastTrimmed };
        }
        return {
            firstName: parts.slice(0, -1).join(' '),
            lastName: parts[parts.length - 1] || '',
        };
    }

    const rawFirstName =
        storeFirstName.value ||
        userStore.onboardingProfile?.firstName ||
        mockUser.value?.firstName ||
        accountProfileDefaults.firstName;
    const rawLastName =
        storeLastName.value ||
        userStore.onboardingProfile?.lastName ||
        mockUser.value?.lastName ||
        accountProfileDefaults.lastName;
    const normalizedName = normalizeName(rawFirstName, rawLastName);

    const firstName = ref(normalizedName.firstName || accountProfileDefaults.firstName);
    const lastName = ref(normalizedName.lastName || accountProfileDefaults.lastName);
    const email = ref(userStore.email || mockUser.value?.email || accountProfileDefaults.email);
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');

    const promotions = ref(false);
    const reviews = ref(false);
    const confirmations = ref(false);
    const unit = ref<AccountUnit>('millimeter');

    const photoUrl = ref<string | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);

    const initials = computed(() => {
        const firstInitial = (firstName.value?.charAt(0) || 'U').toUpperCase();
        const lastInitial = (lastName.value?.charAt(0) || '').toUpperCase();
        return `${firstInitial}${lastInitial}`;
    });

    function openFilePicker() {
        fileInput.value?.click();
    }

    function onFilePicked(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png'].includes(file.type)) return;

        if (photoUrl.value?.startsWith('blob:')) {
            URL.revokeObjectURL(photoUrl.value);
        }

        photoUrl.value = URL.createObjectURL(file);
    }

    function removePhoto() {
        if (photoUrl.value?.startsWith('blob:')) {
            URL.revokeObjectURL(photoUrl.value);
        }

        photoUrl.value = null;
    }

    function saveProfile() {
        mockUser.value = {
            firstName: firstName.value.trim() || accountProfileDefaults.firstName,
            lastName: lastName.value.trim() || accountProfileDefaults.lastName,
            email: email.value.trim() || accountProfileDefaults.email,
        };
    }

    async function signOut() {
        try {
            await api(`/${apiCountry.value}/auth/logout`, {
                method: 'POST',
            });
        } catch {
            // Continue with local sign-out cleanup even if API logout fails.
        } finally {
            mockUser.value = null;
            authToken.value = null;
            userStore.clearUser();
            userStore.clearOnboardingProfile();
            await navigateTo(withCountry('/'));
        }
    }

    onBeforeUnmount(() => {
        if (photoUrl.value?.startsWith('blob:')) {
            URL.revokeObjectURL(photoUrl.value);
        }
    });

    return {
        firstName,
        lastName,
        email,
        currentPassword,
        newPassword,
        confirmPassword,
        promotions,
        reviews,
        confirmations,
        unit,
        photoUrl,
        fileInput,
        initials,
        openFilePicker,
        onFilePicked,
        removePhoto,
        saveProfile,
        signOut,
    };
}
