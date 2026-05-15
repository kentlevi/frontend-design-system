<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import { useProfileSettingsIndex } from '~/composables/account/profile/useProfileSettingsIndex';
import { useProfileSettingsIndexUI } from '~/composables/account/profile/useProfileSettingsIndexUI';

withDefaults(defineProps<{
	loading?: boolean;
}>(), {
	loading: false,
});

useProfileSettingsIndex()

const { translate } = useProfileSettingsIndexUI()
</script>

<template>
	<div class="account-profile-section" data-testid="account-profile-settings-section">
		<MuLinearWrapper v-if="loading" class="account-profile-section-copy" direction="column" :gap="4">
			<UiSkeleton width="92px" height="36px" border-radius="8px" />
			<UiSkeleton width="100%" height="20px" border-radius="8px" />
			<UiSkeleton width="84%" height="20px" border-radius="8px" />
		</MuLinearWrapper>
		<MuLinearWrapper v-else class="account-profile-section-copy" direction="column" :gap="4">
			<MuHeading class="account-profile-section-title">{{ translate('account.profile.settings') }}</MuHeading>
			<MuText class="account-profile-section-description">{{ translate('account.profile.settingsDesc') }}</MuText>
		</MuLinearWrapper>

		<FeaturesAccountProfileContentSettingsSkeleton v-if="loading" />

		<FeaturesAccountProfileContentSettingsToggles v-else />
	</div>
</template>

<style scoped lang="scss">
.account-profile-section {
	.account-profile-muted {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}
}
</style>