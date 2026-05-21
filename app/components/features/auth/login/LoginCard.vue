<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { useLoginCard } from '~/composables/features/account/orders/auth/login/useLoginCard';
import ModeSwitcher from './ModeSwitcher.vue';
import MemberForm from './MemberForm.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import SocialLogin from './SocialLogin.vue';
import NonMemberForm from './NonMemberForm.vue';

const AlreadyRegisteredModal = defineAsyncComponent(
	() => import('~/components/features/auth/AlreadyRegisteredModal.vue')
);
const VerificationModal = defineAsyncComponent(
	() => import('~/components/verification/VerificationModal.vue')
);

const { translate, member_type, submitLogin } = useLoginCard();
</script>

<template>
	<MuLinearWrapper
		class="auth-login-card-shell"
		direction="column"
		width="100%"
		justify="center"
		align="center"
		gap="16px"
	>
		<MuLinearWrapper direction="column" gap="16px" width="100%">
			<MuLinearWrapper
				direction="column"
				gap="32px"
				class="auth-login-intro"
			>
				<AuthLoginHeader />
				<ModeSwitcher />
			</MuLinearWrapper>

			<MemberForm v-if="member_type === 'member'" />
			<NonMemberForm v-else />
		</MuLinearWrapper>

		<MuLinearWrapper direction="column" gap="24px" width="100%">
			<UiButton tone="neutral" size="lg" @click="submitLogin">
				{{ translate('auth.login.signIn') }}
			</UiButton>

			<MuLinearWrapper
				v-if="member_type === 'member'"
				width="100%"
				direction="column"
				gap="16px"
			>
				<div class="auth-login-divider">
					{{ translate('auth.login.socialLabel') }}
				</div>

				<SocialLogin />
			</MuLinearWrapper>
		</MuLinearWrapper>

		<AlreadyRegisteredModal />
		<VerificationModal />
	</MuLinearWrapper>
</template>

<style lang="scss">
.auth-login-card-shell {
	.auth-login-card {
		.auth-login-intro {
			display: flex;
			flex-direction: column;
			gap: 40px;
		}
	}
}

.auth-login-divider {
	display: flex;
	align-items: center;
	gap: 12px;
	color: var(--text-muted);
	font-size: var(--type-size-100);

	&::before,
	&::after {
		content: '';
		flex-grow: 1;
		height: 1px;
		background-color: var(--border-default);
	}
}
</style>