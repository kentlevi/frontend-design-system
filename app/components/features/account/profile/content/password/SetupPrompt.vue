<script setup lang="ts">
defineEmits<{
	(e: 'open-setup'): void
}>()

const { t } = useI18n();
</script>

<template>
	<div
		class="account-profile-password-setup"
		data-testid="account-profile-password-setup"
	>
		<div class="account-profile-password-setup-copy">
			<h3 class="account-profile-password-setup-title">{{ t('account.profile.setPassword') }}</h3>
			<p class="account-profile-password-setup-description">
				{{ t('account.profile.socialPasswordDescription') }}
			</p>
		</div>
		<UiButton
			variant="filled"
			tone="neutral"
			size="md"
			data-testid="account-profile-setup-password-button"
			@click="$emit('open-setup')"
		>
			{{ t('account.profile.setUpPassword') }}
		</UiButton>
	</div>
</template>

<style scoped lang="scss">
.account-profile-password-setup {
	display: flex;
	align-items: flex-end;
	flex-direction: column;
	justify-content: space-between;
	gap: 16px;

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

	.account-profile-password-setup-description {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}
}
</style>
