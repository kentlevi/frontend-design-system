<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthOnboardingStore } from '~/stores/auth/onboarding.store';

const onboarding_store = useAuthOnboardingStore();
const { show_welcome_toast } = storeToRefs(onboarding_store);
</script>

<template>
	<UiToast
		:visible="show_welcome_toast"
		tone="primary"
		variant="outlined"
		:message="$t('auth.profile.toast')"
		data-testid="auth-profile-toast"
		@close="onboarding_store.setShowWelcomeToast(false)"
	/>
</template>