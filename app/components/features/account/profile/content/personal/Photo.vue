<script setup lang="ts">
defineProps<{
	displayAvatar: string | null | undefined
	userInitial: string
	photoInlineError: string
}>()

defineEmits<{
	(e: 'upload-click'): void
	(e: 'delete-click'): void
}>()

const { t } = useI18n();
</script>

<template>
	<div class="account-profile-photo-group">
		<div class="account-profile-photo-head">
			<div class="account-profile-label">{{ t('account.profile.profilePhoto') }}</div>
			<p v-if="photoInlineError" class="account-profile-photo-error">{{ photoInlineError }}</p>
		</div>
		<div class="account-profile-photo-row" data-testid="account-profile-photo-row">
			<div :class="['account-profile-avatar', { 'account-profile-avatar--error': photoInlineError }]">
				<img
					v-if="displayAvatar"
					:src="displayAvatar"
					:alt="t('account.profile.profilePhoto')"
					class="account-profile-avatar-image"
				>
				<span v-else class="account-profile-avatar-text">{{ userInitial }}</span>
			</div>
			<div class="account-profile-photo-copy">
				<p class="account-profile-muted">{{ t('account.profile.photoHint1') }}</p>
				<p class="account-profile-muted">{{ t('account.profile.photoHint2') }}</p>
				<div class="account-profile-photo-actions">
					<UiButton
						variant="outline"
						tone="neutral"
						size="md"
						class="account-profile-outline-button"
						data-testid="account-profile-photo-upload-button"
						@click="$emit('upload-click')"
					>
						{{ displayAvatar ? t('account.profile.uploadNewPhoto') : t('account.profile.uploadPhoto') }}
					</UiButton>
					<UiButton
						v-if="displayAvatar"
						variant="ghost"
						tone="danger"
						size="md"
						class="account-profile-delete-button"
						data-testid="account-profile-photo-delete-button"
						@click="$emit('delete-click')"
					>
						{{ t('account.profile.delete') }}
					</UiButton>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.account-profile-label {
	display: block;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
	margin-bottom: 10px;
}

.account-profile-photo-head {
	display: flex;
	justify-content: space-between;

	.account-profile-label {
		margin-bottom: 0;
	}

	.account-profile-photo-error {
		text-align: left;
		max-width: 100%;
	}
}

.account-profile-photo-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-width: 427px;
}

.account-profile-photo-row {
	display: grid;
	grid-template-columns: 120px 1fr;
	gap: 32px;
	align-items: center;

	.account-profile-avatar {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		border: 1px solid transparent;
		background: var(--gray-40);
		color: var(--black-base);
		display: grid;
		place-items: center;
		overflow: hidden;
		font-size: var(--type-size-550);
		line-height: var(--type-line-550);
		font-weight: var(--font-weight-bold);

		.account-profile-avatar-image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.account-profile-avatar--error {
		border-color: var(--error);
	}
}

.account-profile-photo-copy {
	display: flex;
	flex-direction: column;
}

.account-profile-muted {
	color: var(--text-secondary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
}

.account-profile-photo-error {
	color: var(--error);
	font-size: var(--type-size-100);
	font-weight: var(--font-weight-semibold);
	line-height: var(--type-line-100);
}

.account-profile-photo-actions {
	margin-top: 10px;
	display: flex;
	gap: 14px;
	align-items: center;

	.account-profile-outline-button {
		min-height: 38px;
	}

	.account-profile-delete-button {
		color: var(--error);
	}
}
</style>
