<script lang="ts" setup>
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useRegisterCard } from '~/composables/features/account/orders/auth/register/useRegisterCard';
import { registerRewardPoints } from '~/data/auth/register';

const { translate } = useRegisterCard();
</script>

<template>
	<MuLinearWrapper direction="column" gap="14px" class="auth-register-header">
		<UiLogo
			name="musticker"
			variant="mark"
			color="colored"
			:size="40"
			class="auth-register-header-logo"
		/>
		<MuText size="xlarge" weight="bold">
			{{ translate('auth.register.title') }}
		</MuText>
		<MuText size="small" color="var(--text-secondary)">
			{{ translate('auth.register.subtitle', { points: registerRewardPoints }) }}
		</MuText>
	</MuLinearWrapper>
</template>

<style lang="scss">
.auth-register-header {
	.auth-register-header-logo {
		align-self: flex-start;
	}
}
</style>