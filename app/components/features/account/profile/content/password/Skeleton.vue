<template>
	<div
		class="account-profile-stack account-profile-password-skeleton"
		data-testid="account-profile-password-skeleton"
	>
		<div class="account-profile-password-skeleton-field">
			<UiSkeleton width="128px" height="20px" border-radius="8px" />
			<UiSkeleton width="100%" height="42px" border-radius="8px" />
		</div>
		<div class="account-profile-password-skeleton-field">
			<UiSkeleton width="112px" height="20px" border-radius="8px" />
			<UiSkeleton width="100%" height="42px" border-radius="8px" />
			<UiSkeleton width="62%" height="16px" border-radius="8px" />
		</div>
		<div class="account-profile-password-skeleton-field">
			<UiSkeleton width="152px" height="20px" border-radius="8px" />
			<UiSkeleton width="100%" height="42px" border-radius="8px" />
		</div>
		<div class="account-profile-inline-actions">
			<UiSkeleton width="136px" height="40px" border-radius="14px" />
			<UiSkeleton width="112px" height="20px" border-radius="8px" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.account-profile-stack {
	display: flex;
	flex-direction: column;
	gap: 16px;

	.account-profile-inline-actions {
		display: flex;
		gap: 16px;
		align-items: center;
		justify-content: flex-end;
	}
}

.account-profile-password-skeleton-field {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
</style>