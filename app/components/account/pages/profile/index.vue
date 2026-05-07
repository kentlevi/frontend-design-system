<script setup lang="ts">
// import { onMounted, ref, computed } from 'vue';
import { useProfileIndex } from '~/composables/account/profile/useProfileIndex';
import ProfilePersonalSection from './ProfilePersonalSection.vue';
// import ProfilePasswordSection from './ProfilePasswordSection.vue';
// import ProfileSettingsSection from './ProfileSettingsSection.vue';
// import { usePersonalForm } from '~/composables/account/profile/usePersonalForm';
// import { usePreferenceForm } from '~/composables/account/profile/usePreferenceForm';

withDefaults(defineProps<{
	embedded?: boolean;
}>(), {
	embedded: false,
});

const {
	translate,

	is_fetching_fields
} = useProfileIndex()

// const { t } = useI18n();
// const { loadPersonalForm, is_loading: is_personal_loading } = usePersonalForm();
// const { loadPreferences, is_loading: is_preferences_loading } = usePreferenceForm();
// const is_bootstrapping = ref(true);
// const is_profile_loading = computed(() =>
// 	is_bootstrapping.value || is_personal_loading.value || is_preferences_loading.value
// );

// onMounted(async () => {
// 	is_bootstrapping.value = true;
// 	await Promise.allSettled([
// 		loadPersonalForm(),
// 		loadPreferences(),
// 	]);
// 	is_bootstrapping.value = false;
// });


</script>

<template>
	<section class="account-page" data-testid="account-profile-page">
		<AccountShellSection :embedded="embedded" active-tab="profile">
			<h1 class="account-profile-title" data-testid="account-profile-title">{{ translate('account.profile.title') }}</h1>
			<div class="account-content account-profile" data-testid="account-profile-content">
				<ProfilePersonalSection :loading="is_fetching_fields" />

				<!-- <ProfilePasswordSection :loading="is_profile_loading" />

				<ProfileSettingsSection :loading="is_profile_loading" /> -->
			</div>
		</AccountShellSection>
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);
	position: relative;

	.account-profile-title {
		font-size: var(--type-size-450);
		font-weight: var(--font-weight-bold);
		line-height: var(--type-line-450);
		color: var(--text-primary);
		padding: 40px 0 24px;
	}

	.account-content {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		gap: 56px;
	}
}

:global(.ui-toast.account-profile-photo-toast) {
	background: #ff3131;
	color: var(--contrast-light);
	border: 2px solid var(--white-base);

	.ui-toast-text {
		display: inline-flex;
		align-items: center;
		gap: 0;
	}

	.ui-toast-close {
		color: inherit;
	}
}

:global(.account-profile-photo-toast-title) {
	font-weight: var(--font-weight-bold);
}
</style>