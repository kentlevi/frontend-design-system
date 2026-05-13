<script setup lang="ts">
defineProps<{
	preferenceFormState: {
		offers_emails: boolean | number
		reviews_emails: boolean | number
	}
}>()

const emit = defineEmits<{
	(e: 'update-field', key: string, value: boolean): void
}>()

const { t: translate } = useI18n();

function onToggle(key: string, event: Event) {
	const checked = (event.target as HTMLInputElement).checked
	emit('update-field', key, checked)
}
</script>

<template>
	<div class="account-profile-settings" data-testid="account-profile-settings">
		<div class="account-profile-setting-row" data-testid="account-profile-setting-promotions">
			<div class="account-profile-setting-copy">
				<h3 class="account-profile-setting-title">{{ translate('account.profile.promotions') }}</h3>
				<p class="account-profile-muted">{{ translate('account.profile.promotionsDesc') }}</p>
			</div>
			<label class="account-profile-switch">
				<input
					:checked="Boolean(preferenceFormState.offers_emails)"
					type="checkbox"
					class="account-profile-switch-input"
					data-testid="account-profile-toggle-promotions"
					@change="onToggle('offers_emails', $event)"
				>
				<span class="account-profile-switch-track" />
			</label>
		</div>

		<div class="account-profile-setting-row" data-testid="account-profile-setting-reviews">
			<div class="account-profile-setting-copy">
				<h3 class="account-profile-setting-title">{{ translate('account.profile.reviews') }}</h3>
				<p class="account-profile-muted">{{ translate('account.profile.reviewsDesc') }}</p>
			</div>
			<label class="account-profile-switch">
				<input
					:checked="Boolean(preferenceFormState.reviews_emails)"
					type="checkbox"
					class="account-profile-switch-input"
					data-testid="account-profile-toggle-reviews"
					@change="onToggle('reviews_emails', $event)"
				>
				<span class="account-profile-switch-track" />
			</label>
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
		}

		.account-profile-setting-title {
			margin: 0;
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-semibold);
		}

		.account-profile-switch {
			position: relative;
			width: 42px;
			height: 24px;
			display: inline-flex;
			flex-shrink: 0;
			cursor: pointer;

			.account-profile-switch-input {
				position: absolute;
				opacity: 0;
				pointer-events: none;
			}

			.account-profile-switch-track {
				width: 100%;
				height: 100%;
				border-radius: 999px;
				background: var(--gray-30);
				position: relative;

				&::after {
					content: '';
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: var(--contrast-light);
					position: absolute;
					left: 4px;
					top: 4px;
					transition: transform 0.2s ease;
				}
			}

			.account-profile-switch-input:checked + .account-profile-switch-track {
				background: var(--text-primary);
			}

			.account-profile-switch-input:checked + .account-profile-switch-track::after {
				transform: translateX(18px);
			}
		}

		.account-profile-unit-segment {
			display: inline-grid;
			grid-template-columns: 1fr 1fr;
			border: 1px solid var(--text-primary);
			border-radius: 14px;
			overflow: hidden;

			.account-profile-unit-button {
				min-width: 112px;
				height: 40px;
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-bold);
				border-radius: 0;

				&.active {
					background: var(--text-primary);
					color: var(--contrast-light);
				}
			}
		}
	}
}

.account-profile-muted {
	color: var(--text-secondary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
}
</style>
