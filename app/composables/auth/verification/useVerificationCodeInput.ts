import { ref } from 'vue';

export function useVerificationCodeInput(length = 4) {
	const code_inputs = ref<string[]>(Array.from({ length }, () => ''));
	const input_refs = ref<HTMLInputElement[]>([]);

	function setCode(value: string) {
		const digits = (value || '').replace(/\D/g, '').slice(0, length).split('');
		code_inputs.value = Array.from({ length }, (_, index) => digits[index] || '');
	}

	function getCode() {
		return code_inputs.value.join('');
	}

	function handleInput(index: number, event: Event) {
		const input = event.target as HTMLInputElement;
		const value = input.value.replace(/\D/g, '').slice(-1);
		code_inputs.value[index] = value;

		if (value && index < length - 1) {
			input_refs.value[index + 1]?.focus();
		}
	}

	function handleKeyDown(index: number, event: KeyboardEvent) {
		if (event.key === 'Backspace' && !code_inputs.value[index] && index > 0) {
			input_refs.value[index - 1]?.focus();
			return;
		}

		if (event.key === 'ArrowLeft' && index > 0) {
			event.preventDefault();
			input_refs.value[index - 1]?.focus();
			return;
		}

		if (event.key === 'ArrowRight' && index < length - 1) {
			event.preventDefault();
			input_refs.value[index + 1]?.focus();
		}
	}

	function handlePaste(event: ClipboardEvent) {
		const pasted = event.clipboardData?.getData('text') || '';
		const digits = pasted.replace(/\D/g, '').slice(0, length);
		if (!digits.length) return;

		event.preventDefault();
		setCode(digits);

		const focus_index = Math.min(digits.length, length - 1);
		input_refs.value[focus_index]?.focus();
	}

	return {
		codeInputs: code_inputs,
		inputRefs: input_refs,
		setCode,
		getCode,
		handleInput,
		handleKeyDown,
		handlePaste,
	};
}