<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

defineProps<{
	modelValue: boolean
	pendingEmail: string
	emailChangeError: string
	closeEmailChangeModal: () => void
	confirmEmailChange: () => void
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
	(e: 'update:pendingEmail', value: string): void
	(e: 'input-change'): void
}>()

function handleModalValueChange(value: boolean) {
	emit('update:modelValue', value)
}

function handlePendingEmailChange(value: string) {
	emit('update:pendingEmail', value)
	emit('input-change')
}

const { t: translate } = useI18n();

function parseBoldText(text: string) {
	return text.split(/(\[b\].*?\[\/b\])/g).filter(Boolean).map((part) => ({
		text: part.replace(/\[\/?b\]/g, ''),
		isBold: /^\[b\].*\[\/b\]$/.test(part),
	}))
}
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
				:aria-label="translate('account.profile.emailChange.closeModal')"
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

				<MuLinearWrapper class="account-profile-email-change-modal-text-wrap" direction="column" :gap="8">
					<MuHeading variant="5" weight="semi-bold" color="text-primary" class="account-profile-email-change-modal-title">{{ translate('account.profile.emailChange.title') }}</MuHeading>
					<MuText color="text-secondary" class="account-profile-email-change-modal-text">
						<template
							v-for="(part, index) in parseBoldText(translate('account.profile.emailChange.description'))"
							:key="`${part.text}-${index}`"
						>
							<strong v-if="part.isBold" class="change-strong">{{ part.text }}</strong>
							<template v-else>{{ part.text }}</template>
						</template>
					</MuText>
				</MuLinearWrapper>
			</div>

			<div class="account-profile-email-change-modal-body">
				<UiFormField
					class="account-profile-email-change-field"
					head-class="account-profile-email-change-field-head"
					label-text-class="account-profile-email-change-field-label-text"
					:label="translate('account.profile.emailAddress')"
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
								:placeholder="translate('account.profile.emailChange.placeholder')"
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
					{{ translate('account.profile.emailChange.confirm') }}
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
			.account-profile-email-change-modal-text {
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