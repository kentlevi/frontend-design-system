<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';

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
	<MuLinearWrapper class="account-profile-photo-group" direction="column" :gap="8">
		<MuLinearWrapper class="account-profile-photo-head" justify="space-between">
			<div class="account-profile-label">{{ t('account.profile.profilePhoto') }}</div>
			<MuText v-if="photoInlineError" weight="semi-bold" color="error" class="account-profile-photo-error">{{ photoInlineError }}</MuText>
		</MuLinearWrapper>
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
			<MuLinearWrapper class="account-profile-photo-copy" direction="column">
				<MuText color="text-secondary" class="account-profile-muted">{{ t('account.profile.photoHint1') }}</MuText>
				<MuText color="text-secondary" class="account-profile-muted">{{ t('account.profile.photoHint2') }}</MuText>
				<MuLinearWrapper class="account-profile-photo-actions" align="center" :gap="14">
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
				</MuLinearWrapper>
			</MuLinearWrapper>
		</div>
	</MuLinearWrapper>
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
	.account-profile-label {
		margin-bottom: 0;
	}

	.account-profile-photo-error {
		text-align: left;
		max-width: 100%;
	}
}

.account-profile-photo-group {
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


.account-profile-photo-actions {
	margin-top: 10px;

	.account-profile-outline-button {
		min-height: 38px;
	}

	.account-profile-delete-button {
		color: var(--error);
	}
}
</style>
