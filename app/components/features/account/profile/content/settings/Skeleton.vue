<template>
	<div class="account-profile-settings" data-testid="account-profile-settings-skeleton">
		<div class="account-profile-setting-row">
			<div class="account-profile-setting-copy account-profile-setting-copy--skeleton">
				<UiSkeleton width="140px" height="20px" border-radius="8px" />
				<UiSkeleton width="280px" height="20px" border-radius="8px" />
			</div>
			<UiSkeleton width="42px" height="24px" border-radius="999px" />
		</div>
		<div class="account-profile-setting-row">
			<div class="account-profile-setting-copy account-profile-setting-copy--skeleton">
				<UiSkeleton width="82px" height="20px" border-radius="8px" />
				<UiSkeleton width="360px" height="20px" border-radius="8px" />
			</div>
			<UiSkeleton width="42px" height="24px" border-radius="999px" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.account-profile-settings {
	display: flex;
	flex-direction: column;
	gap: 12px;

	.account-profile-setting-row {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		align-items: center;

		.account-profile-setting-copy {
			display: flex;
			flex-direction: column;

			&.account-profile-setting-copy--skeleton {
				gap: 4px;
			}
		}
	}
}
</style>