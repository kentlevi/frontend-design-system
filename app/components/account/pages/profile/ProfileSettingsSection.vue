<script setup lang="ts">
import { usePreferenceForm } from '~/composables/account/profile/usePreferenceForm';

const { t } = useI18n();

const {
	form_state: preference_form_state,
	loadPreferences,
	updatePreferenceField
} = usePreferenceForm();


onMounted(() => {
	loadPreferences();
});
</script>

<template>
	<div class="account-profile-section" data-testid="account-profile-settings-section">
		<div class="account-profile-section-copy">
			<h2 class="account-profile-section-title">{{ t('account.profile.settings') }}</h2>
			<p class="account-profile-section-description">{{ t('account.profile.settingsDesc') }}</p>
		</div>
		<div class="account-profile-settings" data-testid="account-profile-settings">
			<div class="account-profile-setting-row" data-testid="account-profile-setting-promotions">
				<div class="account-profile-setting-copy">
					<h3 class="account-profile-setting-title">{{ t('account.profile.promotions') }}</h3>
					<p class="account-profile-muted">{{ t('account.profile.promotionsDesc') }}</p>
				</div>
				<label class="account-profile-switch">
					<input
						:checked="Boolean(preference_form_state.offers_emails)"
						type="checkbox"
						class="account-profile-switch-input"
						data-testid="account-profile-toggle-promotions"
						@change="updatePreferenceField('offers_emails', ($event.target as HTMLInputElement).checked)"
					>
					<span class="account-profile-switch-track" />
				</label>
			</div>

			<div class="account-profile-setting-row" data-testid="account-profile-setting-reviews">
				<div class="account-profile-setting-copy">
					<h3 class="account-profile-setting-title">{{ t('account.profile.reviews') }}</h3>
					<p class="account-profile-muted">{{ t('account.profile.reviewsDesc') }}</p>
				</div>
				<label class="account-profile-switch">
					<input
						:checked="Boolean(preference_form_state.reviews_emails)"
						type="checkbox"
						class="account-profile-switch-input"
						data-testid="account-profile-toggle-reviews"
						@change="updatePreferenceField('reviews_emails', ($event.target as HTMLInputElement).checked)"
					>
					<span class="account-profile-switch-track" />
				</label>
			</div>


		</div>
	</div>
</template>

<style scoped lang="scss">
.account-profile-section {
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
}
</style>