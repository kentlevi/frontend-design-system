<script setup lang="ts">
import PersonalDetails from '~/components/profile/PersonalDetails.vue';

const { t } = useI18n();
</script>

<template>
	<div class="account-profile-section" data-testid="account-profile-personal-section">
		<div class="account-profile-section-copy">
			<h2 class="account-profile-section-title">{{ t('account.profile.personalDetails') }}</h2>
			<p class="account-profile-section-description">
				{{ t('account.profile.personalDetailsDesc') }}
			</p>
		</div>
		<div class="account-profile-section-main">
			<PersonalDetails />
		</div>
	</div>
</template>