<script setup lang="ts">
import { usePreferenceForm } from '~/composables/account/profile/usePreferenceForm';

withDefaults(defineProps<{
	loading?: boolean;
}>(), {
	loading: false,
});

const {
	translate,

	preference_form_state,

	updatePreferenceField
} = usePreferenceForm();
</script>

<template>
	<div class="account-profile-section" data-testid="account-profile-settings-section">
		<div v-if="loading" class="account-profile-section-copy">
			<UiSkeleton width="92px" height="36px" border-radius="8px" />
			<UiSkeleton width="100%" height="20px" border-radius="8px" />
			<UiSkeleton width="84%" height="20px" border-radius="8px" />
		</div>
		<div v-else class="account-profile-section-copy">
			<h2 class="account-profile-section-title">{{ translate('account.profile.settings') }}</h2>
			<p class="account-profile-section-description">{{ translate('account.profile.settingsDesc') }}</p>
		</div>

		<FeaturesAccountProfileContentSettingsSkeleton v-if="loading" />

		<FeaturesAccountProfileContentSettingsToggles
			v-else
			:preference-form-state="preference_form_state"
			@update-field="(key, value) => updatePreferenceField(key, value)"
		/>
	</div>
</template>

<style scoped lang="scss">
.account-profile-section {
	.account-profile-section-copy {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.account-profile-muted {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}
}
</style>
