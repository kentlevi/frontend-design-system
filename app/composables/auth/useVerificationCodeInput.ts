import { ref } from 'vue';

export function useVerificationCodeInput(length = 4) {
    const codeInputs = ref<string[]>(Array.from({ length }, () => ''));
    const inputRefs = ref<HTMLInputElement[]>([]);

    function setCode(value: string) {
        const digits = (value || '').replace(/\D/g, '').slice(0, length).split('');
        codeInputs.value = Array.from({ length }, (_, index) => digits[index] || '');
    }

    function getCode() {
        return codeInputs.value.join('');
    }

    function handleInput(index: number, event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/\D/g, '').slice(-1);
        codeInputs.value[index] = value;

        if (value && index < length - 1) {
            inputRefs.value[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, event: KeyboardEvent) {
        if (event.key === 'Backspace' && !codeInputs.value[index] && index > 0) {
            inputRefs.value[index - 1]?.focus();
            return;
        }

        if (event.key === 'ArrowLeft' && index > 0) {
            event.preventDefault();
            inputRefs.value[index - 1]?.focus();
            return;
        }

        if (event.key === 'ArrowRight' && index < length - 1) {
            event.preventDefault();
            inputRefs.value[index + 1]?.focus();
        }
    }

    function handlePaste(event: ClipboardEvent) {
        const pasted = event.clipboardData?.getData('text') || '';
        const digits = pasted.replace(/\D/g, '').slice(0, length);
        if (!digits.length) return;

        event.preventDefault();
        setCode(digits);

        const focusIndex = Math.min(digits.length, length - 1);
        inputRefs.value[focusIndex]?.focus();
    }

    return {
        codeInputs,
        inputRefs,
        setCode,
        getCode,
        handleInput,
        handleKeyDown,
        handlePaste,
    };
}
