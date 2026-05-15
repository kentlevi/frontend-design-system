<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import { useProfilePasswordSetupPrompt } from '~/composables/account/profile/useProfilePasswordSetupPrompt';
import { useProfilePasswordSetupPromptUI } from '~/composables/account/profile/useProfilePasswordSetupPromptUI';

const { openSetupPasswordModal } = useProfilePasswordSetupPrompt()

const { translate } = useProfilePasswordSetupPromptUI()
</script>

<template>
	<MuLinearWrapper
		class="account-profile-password-setup"
		data-testid="account-profile-password-setup"
		direction="column"
		align="flex-end"
		justify="space-between"
		:gap="16"
	>
		<div class="account-profile-password-setup-copy">
			<MuHeading variant="3" class="account-profile-password-setup-title">{{ translate('account.profile.setPassword') }}</MuHeading>
			<MuText color="text-secondary" class="account-profile-password-setup-description">
				{{ translate('account.profile.socialPasswordDescription') }}
			</MuText>
		</div>
		<UiButton
			variant="filled"
			tone="neutral"
			size="md"
			data-testid="account-profile-setup-password-button"
			@click="openSetupPasswordModal"
		>
			{{ translate('account.profile.setUpPassword') }}
		</UiButton>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-profile-password-setup {
	.account-profile-password-setup-copy {
		width: 100%;
		display: grid;
		gap: 8px;
	}

	.account-profile-password-setup-title {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

}
</style>