<template>
	<div class="account-profile-section-main account-profile-personal-skeleton">
		<div class="account-profile-personal-skeleton-photo-group">
			<UiSkeleton width="84px" height="20px" border-radius="8px" />
			<div class="account-profile-personal-skeleton-photo-row">
				<UiSkeleton width="120px" height="120px" border-radius="999px" />
				<div class="account-profile-personal-skeleton-photo-copy">
					<UiSkeleton width="220px" height="20px" border-radius="8px" />
					<UiSkeleton width="180px" height="20px" border-radius="8px" />
					<div class="account-profile-personal-skeleton-photo-actions">
						<UiSkeleton width="136px" height="38px" border-radius="999px" />
						<UiSkeleton width="78px" height="40px" border-radius="999px" />
					</div>
				</div>
			</div>
		</div>
		<div class="account-profile-personal-skeleton-grid">
			<div class="account-profile-personal-skeleton-field">
				<UiSkeleton width="84px" height="20px" border-radius="8px" />
				<UiSkeleton width="100%" height="42px" border-radius="8px" />
			</div>
			<div class="account-profile-personal-skeleton-field">
				<UiSkeleton width="138px" height="20px" border-radius="8px" />
				<UiSkeleton width="100%" height="42px" border-radius="8px" />
			</div>
			<div class="account-profile-personal-skeleton-field account-profile-personal-skeleton-grid-full">
				<UiSkeleton width="112px" height="20px" border-radius="8px" />
				<UiSkeleton width="100%" height="42px" border-radius="8px" />
			</div>
		</div>
		<div class="account-profile-personal-skeleton-actions">
			<UiSkeleton width="110px" height="40px" border-radius="14px" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.account-profile-personal-skeleton {
	gap: 16px;

	.account-profile-personal-skeleton-photo-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 427px;
	}

	.account-profile-personal-skeleton-photo-row {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 32px;
		align-items: center;
	}

	.account-profile-personal-skeleton-photo-copy {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.account-profile-personal-skeleton-photo-actions {
		margin-top: 10px;
		display: flex;
		gap: 14px;
		align-items: center;
	}

	.account-profile-personal-skeleton-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.account-profile-personal-skeleton-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.account-profile-personal-skeleton-grid-full {
		grid-column: 1 / -1;
	}

	.account-profile-personal-skeleton-actions {
		display: flex;
		justify-content: flex-end;
	}
}

@media (max-width: 980px) {
	.account-profile-personal-skeleton {
		.account-profile-personal-skeleton-grid {
			grid-template-columns: 1fr;
		}
	}
}
</style>