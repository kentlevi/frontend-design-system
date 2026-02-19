import { computed, onBeforeUnmount, ref } from 'vue';
import {
    accountProfileDefaults,
    type AccountMockUser,
    type AccountUnit,
} from '~/data/account/profile';

export function useAccountProfile() {
    const localePath = useLocalePath();
    const mockUser = useCookie<AccountMockUser | null>('mock_user');

    const firstName = ref(mockUser.value?.firstName || accountProfileDefaults.firstName);
    const lastName = ref(mockUser.value?.lastName || accountProfileDefaults.lastName);
    const email = ref(mockUser.value?.email || accountProfileDefaults.email);
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
        const firstInitial = (firstName.value?.charAt(0) || 'J').toUpperCase();
        const lastInitial = (lastName.value?.charAt(0) || 'L').toUpperCase();
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

    function signOut() {
        mockUser.value = null;
        navigateTo(localePath('/'));
    }

    onBeforeUnmount(() => {
        if (photoUrl.value?.startsWith('blob:')) {
            URL.revokeObjectURL(photoUrl.value);
        }
    });

    return {
        localePath,
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
