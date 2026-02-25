import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { accountProfileDefaults, type AccountMockUser } from '@/data/account/profile';
import { useUserStore } from '@/stores/user';

type ProfileStep = 1 | 2;
type ProfileUnit = 'millimeter' | 'inch';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

export function useAuthProfileSetup() {
    const localePath = useLocalePath();
    const userStore = useUserStore();
    const mockUser = useCookie<AccountMockUser | null>('mock_user', {
        default: () => null,
        sameSite: 'lax',
        path: '/',
    });

    const step = ref<ProfileStep>(1);
    const showWelcomeToast = ref(Boolean(userStore.onboardingProfile?.onboarding));
    let toastTimeout: ReturnType<typeof setTimeout> | null = null;

    const firstName = ref(
        userStore.onboardingProfile?.firstName || accountProfileDefaults.firstName
    );
    const lastName = ref(
        userStore.onboardingProfile?.lastName || accountProfileDefaults.lastName
    );
    const email = ref(userStore.onboardingProfile?.email || accountProfileDefaults.email);

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
        await navigateTo(localePath('/'));
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
