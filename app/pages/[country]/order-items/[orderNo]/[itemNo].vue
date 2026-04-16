<script setup lang="ts">
import { computed, ref } from 'vue';
import { accountOrders } from '~/data/account/orders';
import OrderUploadArtworkModal from '~/components/account/pages/orders/OrderUploadArtworkModal.vue';
import OrderTermsModal from '~/components/account/pages/orders/OrderTermsModal.vue';
import type { AccountOrderLineItem } from '~/types/account/orders';
import { useCountry } from '~/composables/app/country/useCountry';

definePageMeta({
	layout: 'home',
	hideHeader: true,
	hideFooter: true,
	layoutBackground: 'neutral',
});

const route = useRoute();
const { withCountry } = useCountry();
const { t } = useI18n();

const dark_background = ref(false);
const upload_modal_open = ref(false);
const tos_modal_open = ref(false);
const upload_toast_visible = ref(false);
const upload_toast_message = ref('');
let upload_toast_timeout: ReturnType<typeof setTimeout> | null = null;

const order_no = computed(() => String(route.params.orderNo || ''));
const item_no = computed(() => String(route.params.itemNo || ''));

const order = computed(() => accountOrders.find((entry) => entry.id === order_no.value) || null);
const item = computed<AccountOrderLineItem | null>(() =>
	order.value?.items.find((entry) => entry.number === item_no.value) || null
);

if (!order.value || !item.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Order item not found',
	});
}

const artwork_file_name = computed(() => item.value?.artworkFileName || 'yellow-bear.png');
const artwork_preview_src = computed(() => {
	const current_src = item.value?.imageSrc || '';
	if (!current_src || current_src === '/icons/custom/checkout/icon-box.svg') {
		return '/illustrations/products/stickers/die-cut.svg';
	}
	return current_src;
});
function resolveOrderText(value: string) {
	return value.startsWith('account.') ? t(value) : value;
}

const artwork_submitted_by = computed(() => resolveOrderText(item.value?.artworkSubmittedBy || 'account.orders.mock.submitters.joyLove'));
const artwork_submitted_at = computed(() => item.value?.artworkSubmittedAt || '11/20/2024 at 1:43pm');
const artwork_instruction = computed(
	() => resolveOrderText(item.value?.artworkInstruction || 'account.orders.mock.instructions.default')
);

function hideUploadToast() {
	upload_toast_visible.value = false;
	if (upload_toast_timeout) {
		clearTimeout(upload_toast_timeout);
		upload_toast_timeout = null;
	}
}

function closePage() {
	void navigateTo(withCountry('/account/orders'));
}

function openReplaceArtwork() {
	upload_modal_open.value = true;
}

function closeReplaceArtwork() {
	upload_modal_open.value = false;
}

function openTermsModal() {
	tos_modal_open.value = true;
}

function closeTermsModal() {
	tos_modal_open.value = false;
}

function handleReplaceArtworkSubmit(_payload: { itemNumber: string }) {
	closeReplaceArtwork();
	upload_toast_message.value = t('account.orders.detail.uploadSuccess');
	upload_toast_visible.value = true;
	if (upload_toast_timeout) {
		clearTimeout(upload_toast_timeout);
	}
	upload_toast_timeout = setTimeout(() => {
		upload_toast_visible.value = false;
		upload_toast_timeout = null;
	}, 3000);
}
</script>

<template>
	<section class="account-order-item-page" :class="{ 'is-dark': dark_background }">
		<header class="account-order-item-topbar">
			<div class="account-order-item-topbar-inner">
				<button type="button" class="account-order-item-topbar-button" @click="closePage">
					{{ t('account.orders.detail.close') }}
				</button>
				<h1 class="account-order-item-topbar-title">Item No. {{ item?.number }}</h1>
				<label class="account-order-item-topbar-switch">
					<input v-model="dark_background" type="checkbox" class="account-order-item-topbar-switch-input">
					<span class="account-order-item-topbar-switch-track" />
					<span class="account-order-item-topbar-switch-label">{{ t('account.orders.detail.darkBackground') }}</span>
				</label>
			</div>
		</header>

		<div class="account-order-item-shell">
			<section class="account-order-item-hero">
				<div class="account-order-item-preview">
					<img :src="artwork_preview_src" :alt="artwork_file_name" class="account-order-item-image">
				</div>
				<h2 class="account-order-item-status-title">{{ t('account.orders.detail.statusTitle') }}</h2>
				<p class="account-order-item-status-copy">
					{{ t('account.orders.detail.statusDescriptionPrefix') }}
					<button type="button" class="account-order-item-inline-link" @click="openReplaceArtwork">{{ t('account.orders.replaceArtwork') }}</button>{{ t('account.orders.detail.statusDescriptionSuffix') }}
				</p>
			</section>

			<section class="account-order-item-activity">
				<h3 class="account-order-item-section-title">{{ t('account.orders.detail.activityLogs') }}</h3>

				<article class="account-order-item-log-card">
					<div class="account-order-item-log-head">
						<div class="account-order-item-log-author">
							<div class="account-order-item-log-avatar">JL</div>
							<div class="account-order-item-log-author-copy">
								<strong>{{ artwork_submitted_by }}</strong>
								<span>{{ artwork_submitted_at }}</span>
							</div>
						</div>
						<span class="account-order-item-log-badge">{{ t('account.orders.detail.submittedArtwork') }}</span>
					</div>

					<p class="account-order-item-log-message">
						{{ artwork_instruction }}
					</p>

					<div class="account-order-item-log-asset">
						<div class="account-order-item-log-thumb">
							<img :src="artwork_preview_src" :alt="artwork_file_name" class="account-order-item-log-image">
						</div>
						<div class="account-order-item-log-asset-copy">
							<strong>{{ artwork_file_name }}</strong>
							<span>{{ t('account.orders.detail.product') }} {{ item ? resolveOrderText(item.productName) : '' }}</span>
							<span>{{ t('account.orders.size', { size: item?.size }) }}</span>
						</div>
					</div>
				</article>
			</section>
		</div>

		<OrderUploadArtworkModal
			:open="upload_modal_open"
			:item="item"
			@close="closeReplaceArtwork"
			@submit="handleReplaceArtworkSubmit"
		/>

		<OrderTermsModal
			:open="tos_modal_open"
			@close="closeTermsModal"
		/>

		<UiToast
			:visible="upload_toast_visible"
			:message="upload_toast_message"
			tone="primary"
			variant="outlined"
			dismissible
			class="account-order-item-upload-toast"
			@close="hideUploadToast"
		/>

		<footer class="account-order-item-footer">
			<button type="button" class="account-order-item-footer-button" @click="openTermsModal">
				{{ t('account.orders.detail.finalProofTerms') }}
			</button>
		</footer>
	</section>
</template>

<style scoped lang="scss">
.account-order-item-page {
	min-height: 100vh;
	background: #ffffff;
	color: var(--text-primary);
	display: flex;
	flex-direction: column;
	transition:
		background-color 0.2s ease,
		color 0.2s ease;
}

.account-order-item-page.is-dark {
	background: #1c212d;
	color: #ffffff;

	.account-order-item-topbar {
		border-bottom-color: rgba(255, 255, 255, 0.14);
		background: rgba(28, 33, 45, 0.94);
	}

	.account-order-item-topbar-title,
	.account-order-item-status-title,
	.account-order-item-section-title,
	.account-order-item-log-author-copy strong,
	.account-order-item-log-asset-copy strong {
		color: #ffffff;
	}

	.account-order-item-topbar-button,
	.account-order-item-topbar-switch-label {
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.3);
	}

	.account-order-item-status-copy,
	.account-order-item-log-author-copy span,
	.account-order-item-log-message,
	.account-order-item-log-asset-copy span {
		color: rgba(255, 255, 255, 0.72);
	}

	.account-order-item-log-avatar {
		background: rgba(255, 255, 255, 0.18);
		color: #ffffff;
	}

	.account-order-item-inline-link {
		color: #ffffff;
	}
}

.account-order-item-topbar {
	position: sticky;
	top: 0;
	z-index: 10;
	padding: 14px 24px;
	border-bottom: 1px solid var(--gray-30);
	background: rgba(255, 255, 255, 0.96);
	backdrop-filter: blur(8px);
}

.account-order-item-topbar-inner {
	width: 100%;
	max-width: 1200px;
	margin: auto;
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	gap: 16px;
}

.account-order-item-topbar-button {
	justify-self: start;
	min-height: 32px;
	padding: 0 16px;
	border: 1px solid var(--gray-60);
	border-radius: 999px;
	background: transparent;
	font-size: 13px;
	line-height: 1;
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
	cursor: pointer;
}

.account-order-item-topbar-title {
	margin: 0;
	font-size: 16px;
	line-height: 1.2;
	font-weight: var(--font-weight-bold);
	text-align: center;
	color: var(--text-primary);
}

.account-order-item-topbar-switch {
	justify-self: end;
	display: inline-flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
}

.account-order-item-topbar-switch-input {
	position: absolute;
	opacity: 0;
	pointer-events: none;
}

.account-order-item-topbar-switch-track {
	position: relative;
	width: 28px;
	height: 18px;
	border-radius: 999px;
	background: var(--gray-40);
	flex: 0 0 auto;
	transition: background-color 0.2s ease;
}

.account-order-item-topbar-switch-track::after {
	content: '';
	position: absolute;
	top: 2px;
	left: 2px;
	width: 14px;
	height: 14px;
	border-radius: 999px;
	background: #ffffff;
	transition: transform 0.2s ease;
}

.account-order-item-topbar-switch-input:checked + .account-order-item-topbar-switch-track {
	background: var(--gray-90);
}

.account-order-item-topbar-switch-input:checked + .account-order-item-topbar-switch-track::after {
	transform: translateX(10px);
}

.account-order-item-topbar-switch-label {
	font-size: 14px;
	line-height: 1.2;
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

.account-order-item-shell {
	max-width: 1200px;
	margin: 0 auto;
	padding: 22px 24px 48px;
	display: grid;
	gap: 42px;
	flex: 1;
}

.account-order-item-hero {
	display: grid;
	justify-items: center;
	gap: 16px;
	padding-top: 12px;
	text-align: center;
}

.account-order-item-preview {
	display: grid;
	place-items: center;
	min-height: 250px;
}

.account-order-item-image {
	width: min(244px, 34vw);
	height: auto;
	object-fit: contain;
}

.account-order-item-status-title {
	margin: 0;
	font-size: 18px;
	line-height: 1.3;
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.account-order-item-status-copy {
	margin: 0;
	max-width: 700px;
	font-size: 13px;
	line-height: 1.45;
	color: var(--text-secondary);
}

.account-order-item-inline-link {
	border: 0;
	background: transparent;
	padding: 0;
	font: inherit;
	font-weight: var(--font-weight-bold);
	text-decoration: underline;
	color: var(--text-primary);
	cursor: pointer;
}

.account-order-item-activity {
	max-width: 610px;
	margin: 0 auto;
	display: grid;
	gap: 18px;
}

.account-order-item-section-title {
	margin: 0;
	font-size: 20px;
	line-height: 1.2;
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.account-order-item-log-card {
	display: grid;
	gap: 16px;
}

.account-order-item-log-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.account-order-item-log-author {
	display: flex;
	align-items: center;
	gap: 12px;
}

.account-order-item-log-avatar {
	width: 36px;
	height: 36px;
	border-radius: 999px;
	background: #d9e2f2;
	display: grid;
	place-items: center;
	font-size: 12px;
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.account-order-item-log-author-copy {
	display: flex;
	align-items: baseline;
	gap: 10px;
	flex-wrap: wrap;
}

.account-order-item-log-author-copy strong {
	font-size: 16px;
	line-height: 1.2;
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.account-order-item-log-author-copy span,
.account-order-item-log-message,
.account-order-item-log-asset-copy span {
	font-size: 14px;
	line-height: 1.5;
	color: var(--text-secondary);
}

.account-order-item-log-badge {
	padding: 4px 12px;
	border: 1px solid var(--azure-30);
	border-radius: 999px;
	background: var(--azure-10);
	font-size: 13px;
	line-height: 1.2;
	font-weight: var(--font-weight-semibold);
	color: var(--azure-60);
}

.account-order-item-log-message {
	margin: 0;
}

.account-order-item-log-asset {
	display: flex;
	align-items: flex-start;
	gap: 14px;
}

.account-order-item-log-thumb {
	width: 48px;
	height: 48px;
	border-radius: 10px;
	background: var(--gray-10);
	display: grid;
	place-items: center;
	overflow: hidden;
	flex: 0 0 auto;
}

.account-order-item-log-image {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.account-order-item-log-asset-copy {
	display: grid;
	gap: 4px;
}

.account-order-item-log-asset-copy strong {
	font-size: 16px;
	line-height: 1.25;
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.account-order-item-footer {
	padding: 8px 24px 24px;
	border-top: 1px solid var(--gray-30);
	display: flex;
	justify-content: center;
}

.account-order-item-footer-button {
	border: 0;
	background: transparent;
	padding: 0;
	font-size: 14px;
	line-height: 1.35;
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
	text-decoration: underline;
	cursor: pointer;
}

:global(.ui-toast.account-order-item-upload-toast) {
	left: 50%;
	bottom: 40px;
	transform: translateX(-50%);
	border: 1px solid #f4c542;
	border-radius: 14px;
	background: #ffe05c;
	box-shadow: 0 18px 36px rgba(21, 26, 38, 0.18);
}

:global(.ui-toast.account-order-item-upload-toast .ui-toast-main) {
	align-items: center;
	gap: 10px;
}

:global(.ui-toast.account-order-item-upload-toast .ui-toast-text) {
	font-size: 14px;
	line-height: 1.4;
	font-weight: var(--font-weight-semibold);
	color: #1f2533;
	white-space: nowrap;
}

:global(.ui-toast.account-order-item-upload-toast .ui-icon) {
	color: #1f2533;
}

:global(.ui-toast.account-order-item-upload-toast .ui-toast-close) {
	color: #1f2533;
}

@media (max-width: 760px) {
	.account-order-item-topbar-inner {
		grid-template-columns: 1fr;
		justify-items: start;
	}

	.account-order-item-topbar-title,
	.account-order-item-topbar-switch {
		justify-self: start;
	}

	.account-order-item-status-title {
		font-size: 26px;
	}

	.account-order-item-log-head {
		align-items: flex-start;
		flex-direction: column;
	}

	:global(.ui-toast.account-order-item-upload-toast .ui-toast-text) {
		white-space: normal;
	}
}
</style>