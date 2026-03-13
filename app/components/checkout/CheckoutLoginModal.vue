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

const modalMode = ref<'login' | 'register'>('login');
const isForgotPasswordModalOpen = ref(false);
const forgotPasswordEmail = ref('');
const shouldRestoreLoginModal = ref(false);

watch(() => props.modelValue, (is_open) => {
	if (!is_open) {
		modalMode.value = 'login';
	}
});

async function openForgotPasswordModal(email: string) {
	forgotPasswordEmail.value = email;
	shouldRestoreLoginModal.value = true;
	emit('update:modelValue', false);
	await nextTick();
	isForgotPasswordModalOpen.value = true;
}

function onForgotPasswordModalChange(value: boolean) {
	isForgotPasswordModalOpen.value = value;

	if (!value && shouldRestoreLoginModal.value) {
		restoreLoginModal();
	}
}

async function restoreLoginModal() {
	isForgotPasswordModalOpen.value = false;
	shouldRestoreLoginModal.value = false;
	await nextTick();
	modalMode.value = 'login';
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
			<div v-if="modalMode === 'login'" key="login" class="checkout-auth-card-panel">
				<AuthLoginCard
					:skip-member-redirect="true"
					:show-close-button="true"
					:register-as-action="true"
					:forgot-password-as-action="true"
					:hide-non-member-order-number="true"
					@member-login-success="emit('update:modelValue', false)"
					@close="emit('update:modelValue', false)"
					@open-register="modalMode = 'register'"
					@open-forgot-password="openForgotPasswordModal"
				/>
			</div>

			<div v-else key="register" class="checkout-auth-card-panel">
				<AuthRegisterCard
					:show-close-button="true"
					:login-as-action="true"
					@close="emit('update:modelValue', false)"
					@open-login="modalMode = 'login'"
				/>
			</div>
		</Transition>
	</UiModal>

	<AuthLoginForgotPasswordModal
		:model-value="isForgotPasswordModalOpen"
		:email="forgotPasswordEmail"
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