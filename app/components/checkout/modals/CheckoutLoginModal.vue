<script setup lang="ts">
import { toRef } from 'vue'
import AuthLoginCard from '~/components/auth/login/AuthLoginCard.vue'
import AuthLoginForgotPasswordModal from '~/components/auth/login/AuthLoginForgotPasswordModal.vue'
import AuthRegisterCard from '~/components/auth/register/AuthRegisterCard.vue'
import { useCheckoutLoginModal } from '~/composables/checkout/useCheckoutLoginModal'

const props = defineProps<{
	modelValue: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const {
	checkout_modal_mode,
	is_checkout_forgot_password_modal_open,
	checkout_forgot_password_email,
	handleModalValueChange,
	handleForgotPasswordModalChange,
	openLoginCard,
} = useCheckoutLoginModal(
	toRef(props, 'modelValue'),
	(value) => emit('update:modelValue', value)
)
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		width="588px"
		padding="0"
		gap="0"
		modal-class="checkout-login-modal-shell"
		@update:model-value="handleModalValueChange"
	>
		<Transition name="checkout-auth-card" mode="out-in">
			<div
				v-if="checkout_modal_mode === 'login'"
				key="login"
				class="checkout-auth-card-panel"
			>
				<AuthLoginCard />
			</div>

			<div v-else key="register" class="checkout-auth-card-panel">
				<AuthRegisterCard
					:show-close-button="true"
					:login-as-action="true"
					@close="emit('update:modelValue', false)"
					@open-login="openLoginCard"
				/>
			</div>
		</Transition>
	</UiModal>

	<AuthLoginForgotPasswordModal
		:model-value="is_checkout_forgot_password_modal_open"
		:email="checkout_forgot_password_email"
		@update:model-value="handleForgotPasswordModalChange"
		@return-to-login="handleForgotPasswordModalChange(false)"
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