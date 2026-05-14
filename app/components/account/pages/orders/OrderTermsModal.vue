<script setup lang="ts">
const { t: translate } = useI18n();
const props = defineProps<{
	open: boolean;
}>();

const emit = defineEmits<{
	close: [];
}>();

function closeModal() {
	emit('close');
}
</script>

<template>
	<UiModal
		:model-value="props.open"
		align="top"
		width="720px"
		padding="0"
		gap="0"
		modal-class="account-order-terms-modal-shell"
		@update:model-value="!$event ? closeModal() : undefined"
	>
		<section class="account-order-terms-modal">
			<header class="account-order-terms-modal-header">
				<h3 class="account-order-terms-modal-title">{{ translate('account.orders.terms.title') }}</h3>
				<button
					type="button"
					class="account-order-terms-modal-close"
					:aria-label="translate('account.orders.terms.closeLabel')"
					@click="closeModal"
				>
					<UiIcon name="regular-times" :size="24" color="var(--text-primary)" decorative />
				</button>
			</header>

			<div class="account-order-terms-modal-body">
				<div class="account-order-terms-modal-content">
					<p>
						{{ translate('account.orders.terms.paragraph1') }}
					</p>
					<p>
						{{ translate('account.orders.terms.paragraph2') }}
					</p>
					<p>
						{{ translate('account.orders.terms.paragraph3') }}
					</p>
					<p>
						{{ translate('account.orders.terms.turnaroundNote') }}
					</p>

					<section class="account-order-terms-modal-section">
						<h4 class="account-order-terms-modal-section-title">{{ translate('account.orders.terms.orderTermsNoteTitle') }}</h4>
						<ul class="account-order-terms-modal-list">
							<li>
								{{ translate('account.orders.terms.bumperStickerPrintNote') }}
							</li>
							<li>
								{{ translate('account.orders.terms.materialCurlNote') }}
							</li>
						</ul>
					</section>

					<section class="account-order-terms-modal-section">
						<h4 class="account-order-terms-modal-section-title">{{ translate('account.orders.terms.cancellationTitle') }}</h4>
						<ul class="account-order-terms-modal-list">
							<li>
								{{ translate('account.orders.terms.cancellationBody') }}
							</li>
						</ul>
					</section>
				</div>
			</div>

			<footer class="account-order-terms-modal-footer">
				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					size="md"
					class="account-order-terms-modal-button"
					@click="closeModal"
				>
					{{ translate('account.orders.terms.close') }}
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
.account-order-terms-modal {
	background: var(--contrast-light);
	border-radius: 14px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.account-order-terms-modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18px 24px;
	border-bottom: 1px solid var(--gray-40);
}

.account-order-terms-modal-title {
	font-size: var(--type-size-300);
	line-height: var(--type-line-300);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.account-order-terms-modal-close {
	display: grid;
	place-items: center;
	padding: 0;
	border: 0;
	background: transparent;
	cursor: pointer;
	color: var(--text-primary);
}

.account-order-terms-modal-body {
	padding: 24px;
	max-height: calc(100vh - 200px);
	overflow-y: auto;
}

.account-order-terms-modal-content {
	display: flex;
	flex-direction: column;
	gap: 20px;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--text-primary);

	p {
		margin: 0;
	}

	strong {
		font-weight: var(--font-weight-bold);
	}
}

.account-order-terms-modal-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-top: 8px;
}

.account-order-terms-modal-section-title {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.account-order-terms-modal-list {
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 16px;

	li {
		position: relative;
		padding-left: 24px;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 7px;
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background-color: #f4c542;
		}
	}
}

.account-order-terms-modal-footer {
	padding: 16px 24px 24px;
	border-top: 1px solid var(--gray-40);
	display: flex;
	justify-content: flex-end;
}

.account-order-terms-modal-button {
	min-width: 92px;
	border-radius: 18px;
	font-weight: var(--font-weight-semibold);
}

:global(.ui-modal.account-order-terms-modal-shell) {
	width: min(720px, calc(100vw - 32px));
	padding: 0;
	gap: 0;
	border-radius: 14px;
}
</style>