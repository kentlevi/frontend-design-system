<script setup lang="ts">
defineProps<{
	modelValue: boolean
	pendingEmail: string
	emailChangeError: string
	closeEmailChangeModal: () => void
	confirmEmailChange: () => void
}>()

/** Emits */
const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
	(e: 'update:pendingEmail', value: string): void
	(e: 'input-change'): void
}>()

/**
 * Update modal visibility
 */
function handleModalValueChange(value: boolean) {
	emit('update:modelValue', value)
}

/**
 * Update pending email and notify parent to clear error
 */
function handlePendingEmailChange(value: string) {
	emit('update:pendingEmail', value)
	emit('input-change')
}

const { t } = useI18n();
</script>

<template>
	<UiModal
		:model-value="modelValue"
		align="center"
		padding="0"
		gap="0"
		modal-class="account-profile-email-change-modal-shell"
		@update:model-value="handleModalValueChange"
	>
		<section class="account-profile-email-change-modal" data-testid="account-profile-email-change-modal">
			<button
				type="button"
				class="account-profile-email-change-modal-close"
				:aria-label="t('account.profile.emailChange.closeModal')"
				data-testid="account-profile-email-change-modal-close"
				@click="closeEmailChangeModal"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>

			<div class="account-profile-email-change-modal-copy">
				<div class="account-profile-email-change-modal-icon-wrap">
					<img
						src="/icons/custom/account/email-change.svg"
						alt=""
						class="account-profile-email-change-modal-icon"
					>
				</div>

				<div class="account-profile-email-change-modal-text-wrap">
					<h3 class="account-profile-email-change-modal-title">{{ t('account.profile.emailChange.title') }}</h3>
					<p class="account-profile-email-change-modal-text">
						{{ t('account.profile.emailChange.description') }}
					</p>
				</div>
			</div>

			<div class="account-profile-email-change-modal-body">
				<UiFormField
					class="account-profile-email-change-field"
					head-class="account-profile-email-change-field-head"
					label-text-class="account-profile-email-change-field-label-text"
					:label="t('account.profile.emailAddress')"
					:error="emailChangeError"
					:required="true"
				>
					<template #default="{ inputId, describedBy }">
						<div class="account-profile-email-change-input-wrap">
							<UiInput
								:id="inputId"
								:model-value="pendingEmail"
								type="email"
								:aria-describedby="describedBy || undefined"
								:state="emailChangeError ? 'error' : 'default'"
								:placeholder="t('account.profile.emailChange.placeholder')"
								input-class="account-profile-email-change-input"
								data-testid="account-profile-email-change-input"
								@update:model-value="handlePendingEmailChange"
							/>
						</div>
					</template>
				</UiFormField>
			</div>

			<div class="account-profile-email-change-modal-actions">
				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					size="md"
					class="account-profile-email-change-modal-confirm"
					data-testid="account-profile-email-change-modal-confirm"
					@click="confirmEmailChange"
				>
					{{ t('account.profile.emailChange.confirm') }}
				</UiButton>
			</div>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
.account-profile-email-change-modal {
	position: relative;
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	gap: 32px;
	width: 100%;
	padding: 40px;

	.account-profile-email-change-modal-close {
		position: absolute;
		top: 24px;
		right: 24px;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--text-primary);
		cursor: pointer;
	}

	.account-profile-email-change-modal-copy {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		align-items: start;
		column-gap: 16px;

		.account-profile-email-change-modal-icon-wrap {
			display: grid;
			place-items: center;
			width: 48px;
			height: 48px;

			.account-profile-email-change-modal-icon {
				display: block;
				width: 48px;
				height: 48px;
			}
		}

		.account-profile-email-change-modal-text-wrap {
			display: flex;
			flex-direction: column;
			gap: 8px;

			.account-profile-email-change-modal-title {
				color: var(--text-primary);
				font-size: var(--type-size-400);
				line-height: var(--type-line-400);
				font-weight: var(--font-weight-semibold);
			}

			.account-profile-email-change-modal-text {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);

				.change-strong {
					color: var(--text-primary);
					font-weight: var(--font-weight-bold);
				}
			}
		}
	}

	.account-profile-email-change-modal-confirm {
		width: 100%;
		min-height: 46px;
		border-radius: 18px;
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
	}
}

:global(.account-profile-email-change-modal-shell) {
	border-radius: 16px;
	overflow: hidden;
	max-width: 520px;
}

:global(.account-profile-email-change-field-label-text) {
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}
</style>