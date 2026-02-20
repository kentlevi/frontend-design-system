import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { accountProfileDefaults, type AccountMockUser } from '@/data/account/profile';

type ProfileStep = 1 | 2;
type ProfileUnit = 'millimeter' | 'inch';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

export function useAuthProfileSetup() {
    const route = useRoute();
    const localePath = useLocalePath();
    const mockUser = useCookie<AccountMockUser | null>('mock_user', {
        default: () => null,
        sameSite: 'lax',
        path: '/',
    });

    const step = ref<ProfileStep>(1);
    const showWelcomeToast = ref(route.query.onboarding === '1');
    let toastTimeout: ReturnType<typeof setTimeout> | null = null;

    const firstName = ref(String(route.query.firstName || accountProfileDefaults.firstName));
    const lastName = ref(String(route.query.lastName || accountProfileDefaults.lastName));
    const email = ref(String(route.query.email || accountProfileDefaults.email));

    const photoUrl = ref<string | null>(null);

    const promotions = ref(false);
    const reviews = ref(false);
    const confirmations = ref(false);
    const useShippingAsBilling = ref(false);
    const unit = ref<ProfileUnit>('millimeter');

    const initials = computed(() => {
        const first = firstName.value.trim().charAt(0).toUpperCase();
        const last = lastName.value.trim().charAt(0).toUpperCase();
        return `${first || 'J'}${last || 'L'}`;
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
        mockUser.value = {
            firstName: firstName.value.trim() || accountProfileDefaults.firstName,
            lastName: lastName.value.trim() || accountProfileDefaults.lastName,
            email: email.value.trim() || accountProfileDefaults.email,
        };
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
