<script setup lang="ts">
import ProfilePersonalSection from './ProfilePersonalSection.vue';
import ProfilePasswordSection from './ProfilePasswordSection.vue';
import ProfileSettingsSection from './ProfileSettingsSection.vue';

const { t } = useI18n();

</script>

<template>
	<section class="account-page" data-testid="account-profile-page">

		<AccountShell active-tab="profile">
			<h1 class="account-profile-title" data-testid="account-profile-title">{{ t('account.profile.title') }}</h1>
			<div class="account-content account-profile" data-testid="account-profile-content">
				<ProfilePersonalSection/>

				<ProfilePasswordSection/>

				<ProfileSettingsSection/>
			</div>
		</AccountShell>
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