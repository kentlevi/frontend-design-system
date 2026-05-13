<template>
	<MuLinearWrapper align="center" :gap="12" data-testid="account-shell-user">
		<div class="account-shell-avatar">
			<img
				v-if="display_avatar"
				:src="display_avatar"
				:alt="display_name"
				class="account-shell-avatar-image"
			>
			<template v-else>{{ user_initial }}</template>
			<img
				:src="account_level_badge_src"
				:alt="t('account.shell.level')"
				class="account-shell-avatar-badge"
			>
		</div>
		<MuLinearWrapper direction="column" :gap="4">
			<MuHeading variant="5" weight="bold" color="text-primary">{{ display_name }}</MuHeading>
			<MuText size="medium" color="text-secondary">{{ t('account.shell.level') }}</MuText>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useAccountAvatarSync } from '~/composables/features/account/top/useAccountAvatarSync';
import { useProfilePhotoDisplay } from '~/utils/profile_photo/profile_photo';

const { t } = useI18n();
const { display_avatar, display_name, user_initial } = useProfilePhotoDisplay();

useAccountAvatarSync();

const account_level_badge_src = '/icons/custom/account/points/badges/badge-bumper-boss.svg';
</script>

<style scoped lang="scss">
.account-shell-avatar {
	position: relative;
	width: 72px;
	height: 72px;
	border-radius: 50%;
	background: var(--gray-40);
	color: var(--black-base);
	display: grid;
	place-items: center;
	font-weight: var(--font-weight-bold);
	font-size: var(--type-size-400);
	line-height: var(--type-line-400);

	.account-shell-avatar-image {
		width: inherit;
		height: inherit;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid var(--gray-40);
	}

	.account-shell-avatar-badge {
		position: absolute;
		bottom: 0;
		right: -14px;
		width: 42px;
		height: 36px;
		display: block;
	}
}
</style>