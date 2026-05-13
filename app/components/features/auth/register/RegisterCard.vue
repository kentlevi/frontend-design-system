<script lang="ts" setup>
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import RegisterHeader from './RegisterHeader.vue';
import RegisterForm from './RegisterForm.vue';
import AlreadyRegisteredModal from '~/components/features/auth/AlreadyRegisteredModal.vue';
import VerificationModal from '~/components/verification/VerificationModal.vue';
import { useRegisterCard } from '~/composables/features/account/orders/auth/register/useRegisterCard';

const { translate, submitRegister } = useRegisterCard();
</script>

<template>
	<MuLinearWrapper
		class="auth-register-card-shell"
		direction="column"
		width="100%"
		justify="center"
		align="center"
		gap="16px"
	>
		<MuLinearWrapper direction="column" gap="32px" width="100%">
			<RegisterHeader />
			<RegisterForm />
		</MuLinearWrapper>

		<MuLinearWrapper direction="column" gap="16px" width="100%">
			<UiButton tone="neutral" size="lg" @click="submitRegister">
				{{ translate('auth.register.createAccount') }}
			</UiButton>

			<MuText size="small" color="var(--text-secondary)" class="auth-register-signin-line">
				{{ translate('auth.register.alreadyMember') }}
				<NuxtLink to="/auth/login" class="auth-register-signin-link">
					{{ translate('auth.register.signInHere') }}
				</NuxtLink>
			</MuText>
		</MuLinearWrapper>

		<AlreadyRegisteredModal />
		<VerificationModal />
	</MuLinearWrapper>
</template>

<style lang="scss">
.auth-register-card-shell {
	.auth-register-signin-line {
		text-align: center;

		.auth-register-signin-link {
			color: var(--text-primary);
			font-weight: var(--font-weight-bold);
			text-decoration: underline;
		}
	}
}
</style>