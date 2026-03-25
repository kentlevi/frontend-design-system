<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import AuthLoginCard from '~/components/auth/login/AuthLoginCard.vue';
import AuthLoginForgotPasswordModal from '~/components/auth/login/AuthLoginForgotPasswordModal.vue';
import AuthRegisterCard from '~/components/auth/register/AuthRegisterCard.vue';

const props = defineProps<{
	modelValue: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

const modal_mode = ref<'login' | 'register'>('login');
const is_forgot_password_modal_open = ref(false);
const forgot_password_email = ref('');
const should_restore_login_modal = ref(false);

watch(() => props.modelValue, (is_open) => {
	if (!is_open) {
		modal_mode.value = 'login';
	}
});

async function openForgotPasswordModal(email: string) {
	forgot_password_email.value = email;
	should_restore_login_modal.value = true;
	emit('update:modelValue', false);
	await nextTick();
	is_forgot_password_modal_open.value = true;
}

function onForgotPasswordModalChange(value: boolean) {
	is_forgot_password_modal_open.value = value;

	if (!value && should_restore_login_modal.value) {
		restoreLoginModal();
	}
}

async function restoreLoginModal() {
	is_forgot_password_modal_open.value = false;
	should_restore_login_modal.value = false;
	await nextTick();
	modal_mode.value = 'login';
	emit('update:modelValue', true);
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		width="588px"
		padding="0"
		gap="0"
		modal-class="checkout-login-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<Transition name="checkout-auth-card" mode="out-in">
			<div v-if="modal_mode === 'login'" key="login" class="checkout-auth-card-panel">
				<AuthLoginCard
					:skip-member-redirect="true"
					:show-close-button="true"
					:register-as-action="true"
					:forgot-password-as-action="true"
					:hide-non-member-order-number="true"
					@member-login-success="emit('update:modelValue', false)"
					@close="emit('update:modelValue', false)"
					@open-register="modal_mode = 'register'"
					@open-forgot-password="openForgotPasswordModal"
				/>
			</div>

			<div v-else key="register" class="checkout-auth-card-panel">
				<AuthRegisterCard
					:show-close-button="true"
					:login-as-action="true"
					@close="emit('update:modelValue', false)"
					@open-login="modal_mode = 'login'"
				/>
			</div>
		</Transition>
	</UiModal>

	<AuthLoginForgotPasswordModal
		:model-value="is_forgot_password_modal_open"
		:email="forgot_password_email"
		@update:model-value="onForgotPasswordModalChange"
		@return-to-login="restoreLoginModal"
	/>
</template>

<style lang="scss">
.ui-modal.checkout-login-modal-shell {
	background: transparent;
	border: 0;
	box-shadow: none;
	padding: 0;
	gap: 0;
	width: min(588px, calc(100vw - 32px));
}

.checkout-auth-card-panel {
	width: 100%;
}

.checkout-auth-card-enter-active,
.checkout-auth-card-leave-active {
	transition:
		opacity 0.22s ease,
		transform 0.22s ease;
}

.checkout-auth-card-enter-from,
.checkout-auth-card-leave-to {
	opacity: 0;
	transform: translateY(8px);
}
</style>