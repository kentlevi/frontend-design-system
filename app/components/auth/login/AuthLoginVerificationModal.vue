<script setup lang="ts">
import { authVerificationConfig } from '@/data/auth/verification';

const { t } = useI18n();
const api = useApi();
const router = useRouter();
const route = useRoute();
const country = computed(() =>
    String(route.params.country || 'en').toLowerCase()
);
const apiCountry = computed(() =>
    country.value === 'en' ? 'ph' : country.value
);

const props = defineProps<{
    modelValue: boolean;
    email: string;
    orderNumber: string;
    token: string;
    code: string;
    error?: string;
    verifying?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'update:code', value: string): void;
    (e: 'verify'): void;
    (e: 'resend'): void;
}>();

const codeInputs = ref<Array<number | ''>>(['', '', '', '']);
const inputRefs = ref<HTMLInputElement[]>([]);

interface RegisterResponse {
    success: boolean;
    message: string;
    data: Record<string, never>;
}

async function handleSubmit() {
    const response = await api<RegisterResponse>(`/${apiCountry.value}/auth/register`, {
        method: 'POST',
        body: {
            email: props.email,
            registration_token: props.token,
            otp: codeInputs.value.join('')
        }
    })
    
    if (response.success === false) {
        return
    }

    if (props.email) {
        const userStore = useUserStore();
        userStore.setOnboardingProfile({
            firstName: props.firstName?.trim() || '',
            lastName: props.lastName?.trim() || '',
            email: props.email.trim(),
            onboarding: props.onboarding ?? false,
        });
    }

    router.push(
        props.onboarding
            ? `/${country.value}/auth/profile`
            : `/${country.value}/account/profile`
    )
    closeModal()
}

function closeModal() {
    emit('update:modelValue', false);
}

function handleInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Only allow digits
    value = value.replace(/[^0-9]/g, '');

    // Keep only the last digit if multiple are entered
    if (value.length > 1) {
        value = value.slice(-1);
    }

    codeInputs.value[index] = value ? parseInt(value, 10) : '';

    // Move to next input if a digit was entered
    if (value && index < 3) {
        inputRefs.value[index + 1]?.focus();
    }
}

function handleKeyDown(index: number, event: KeyboardEvent) {
    // Handle backspace to move to previous input
    if (event.key === 'Backspace' && !codeInputs.value[index]) {
        if (index > 0) {
            inputRefs.value[index - 1]?.focus();
        }
    }
    // Handle arrow keys for navigation
    else if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        inputRefs.value[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < 3) {
        event.preventDefault();
        inputRefs.value[index + 1]?.focus();
    }
}

function handlePaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';
    const digits = pastedText.replace(/[^0-9]/g, '').split('').slice(0, 4);

    if (digits.length > 0) {
        event.preventDefault();
        digits.forEach((digit, index) => {
            codeInputs.value[index] = parseInt(digit, 10);
        });

        // Focus the last filled input or the next empty one
        const focusIndex = Math.min(digits.length, 3);
        inputRefs.value[focusIndex]?.focus();
    }
}
</script>

<template>
    <AuthVerificationModal
        :model-value="modelValue"
        :email="email"
        :order-number="orderNumber"
        :code="code"
        :error="error"
        :verifying="verifying"
        :translation-base="authVerificationConfig.i18n.guest"
        :submit-label="t('auth.guestVerification.verify')"
        :busy-label="t('auth.guestVerification.verifying')"
        :otp-length="authVerificationConfig.otpLength"
        test-id-prefix="auth-login-verification"
        @update:model-value="emit('update:modelValue', $event)"
        @update:code="emit('update:code', $event)"
        @verify="emit('verify')"
        @resend="emit('resend')"
    >
        <template #icon>
            <UiIcon name="strong-shield" :size="46" color="var(--brand-primary)" />
        </template>
    </AuthVerificationModal>
</template>
