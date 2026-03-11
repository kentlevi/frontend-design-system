import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue';
import { useVerificationCodeInput } from '~/composables/auth/verification/useVerificationCodeInput';

export function useAuthVerificationModal(params: {
	otpLength: Ref<number>;
	code: Ref<string>;
	verifying: Ref<boolean>;
	submitLabel: Ref<string>;
	busyLabel: Ref<string>;
	translationBase: Ref<string>;
	resendCooldownRemaining: Ref<number>;
	modelValue: Ref<boolean>;
	emitUpdateModelValue: (value: boolean) => void;
	emitUpdateCode: (value: string) => void;
	emitResend: () => void;
	align: Ref<'start' | 'top' | 'center' | 'bottom'>;
}) {
	const { t } = useI18n();
	const { codeInputs, inputRefs, setCode, getCode, handleInput, handleKeyDown, handlePaste } =
		useVerificationCodeInput(params.otpLength.value);

	const key = computed(() => params.translationBase.value);
	const computed_submit_label = computed(() =>
		params.verifying.value
			? params.busyLabel.value || t(`${key.value}.verifying`)
			: params.submitLabel.value || t(`${key.value}.verify`)
	);

	const is_resend_tap_locked = ref(false);
	let resend_tap_lock_timer: ReturnType<typeof setTimeout> | null = null;

	function clear_resend_tap_lock_timer() {
		if (!resend_tap_lock_timer) return;
		clearTimeout(resend_tap_lock_timer);
		resend_tap_lock_timer = null;
	}

	function lock_resend_tap(ms = 2000) {
		clear_resend_tap_lock_timer();
		is_resend_tap_locked.value = true;
		resend_tap_lock_timer = setTimeout(() => {
			is_resend_tap_locked.value = false;
			resend_tap_lock_timer = null;
		}, ms);
	}

	const can_resend = computed(
		() => params.resendCooldownRemaining.value <= 0 && !is_resend_tap_locked.value
	);
	const modal_align = computed<'top' | 'center' | 'bottom'>(() =>
		params.align.value === 'start' ? 'top' : params.align.value
	);

	function close_modal() {
		params.emitUpdateModelValue(false);
	}

	function emit_code() {
		params.emitUpdateCode(getCode());
	}

	function on_input(index: number, event: Event) {
		handleInput(index, event);
		emit_code();
	}

	function on_paste(event: ClipboardEvent) {
		handlePaste(event);
		emit_code();
	}

	function on_resend_click() {
		if (!can_resend.value) return;
		lock_resend_tap();
		params.emitResend();
	}

	watch(
		() => params.code.value,
		(value) => {
			setCode(value ?? '');
		},
		{ immediate: true }
	);

	watch(
		() => params.resendCooldownRemaining.value,
		(remaining) => {
			if (remaining > 0) {
				is_resend_tap_locked.value = false;
				clear_resend_tap_lock_timer();
			}
		}
	);

	watch(
		() => params.modelValue.value,
		(is_open) => {
			if (!is_open) return;
			is_resend_tap_locked.value = false;
			clear_resend_tap_lock_timer();
		}
	);

	onBeforeUnmount(() => {
		clear_resend_tap_lock_timer();
	});

	return {
		codeInputs: codeInputs,
		inputRefs: inputRefs,
		key,
		computedSubmitLabel: computed_submit_label,
		canResend: can_resend,
		modalAlign: modal_align,
		closeModal: close_modal,
		onInput: on_input,
		onPaste: on_paste,
		onResendClick: on_resend_click,
		handleKeyDown,
	};
}