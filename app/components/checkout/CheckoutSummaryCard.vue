<script setup lang="ts">
type SummaryItem = {
	id: string;
	product: {
		name: string;
		image: string;
	};
	sizeLabel: string;
	qty: number;
	total: number;
	artworkPreviewUrl: string;
};

const props = defineProps<{
	tone: 'guest' | 'member';
	title: string;
	items: SummaryItem[];
	subtotalLabel: string;
	shippingFeeLabel: string;
	discountsLabel: string;
	totalLabel: string;
	subtotalValue: string;
	shippingFeeValue: string;
	discountValue: string;
	totalValue: string;
	completeLabel: string;
	agreementPrefix: string;
	agreementTerms: string;
	agreementAnd: string;
	agreementPrivacy: string;
	agreementSuffix: string;
	termsPath: string;
	privacyPath: string;
	disabled?: boolean;
	loading?: boolean;
	sizeDimOnly: (value: string) => string;
	formatPrice: (value: number) => string;
	itemMeta: (sizeLabel: string, qty: number) => string;
}>();

const emit = defineEmits<{
	(e: 'submit'): void;
}>();
</script>

<template>
	<section :class="[`checkout-summary-card`, `is-${props.tone}`]">
		<div class="checkout-summary-title">
			<span>{{ props.title }}</span>
			<div class="checkout-summary-title-actions">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="checkout-summary-title-action"
					aria-label="Edit order summary"
				>
					<UiIcon name="regular-edit" size="24" color="var(--text-primary)" decorative />
				</UiButton>
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="checkout-summary-title-action"
					aria-label="Print order summary"
				>
					<UiIcon name="regular-print" size="24" color="var(--text-primary)" decorative />
				</UiButton>
			</div>
		</div>

		<div class="checkout-summary-list">
			<template v-if="props.items.length > 0">
				<div
					v-for="item in props.items"
					:key="item.id"
					class="checkout-summary-item"
				>
					<div class="checkout-summary-thumb">
						<img
							:src="item.artworkPreviewUrl || item.product.image"
							:alt="item.product.name"
							class="checkout-summary-thumb-image"
						>
					</div>
					<div class="checkout-summary-info">
						<div class="checkout-summary-name">{{ item.product.name }}</div>
						<div class="checkout-summary-meta">
							{{ props.itemMeta(item.sizeLabel, item.qty) }}
						</div>
					</div>
					<div class="checkout-summary-price">{{ props.formatPrice(item.total) }}</div>
				</div>
			</template>
			<div v-else class="checkout-summary-skeleton" aria-hidden="true">
				<div v-for="n in 1" :key="n" class="checkout-summary-item is-skeleton">
					<div class="checkout-summary-thumb skeleton-block" />
					<div class="checkout-summary-info">
						<div class="checkout-summary-skeleton-line checkout-summary-skeleton-line--name" />
						<div class="checkout-summary-skeleton-line checkout-summary-skeleton-line--meta" />
					</div>
					<div class="checkout-summary-skeleton-line checkout-summary-skeleton-line--price" />
				</div>
			</div>
		</div>

		<slot name="after-items" />

		<div class="checkout-summary-footer">
			<div class="checkout-summary-lines">
				<div class="checkout-summary-line">
					<div class="checkout-summary-line-label">{{ props.subtotalLabel }}</div>
					<div class="checkout-summary-line-value">{{ props.subtotalValue }}</div>
				</div>
				<div class="checkout-summary-line">
					<div class="checkout-summary-line-label">{{ props.shippingFeeLabel }}</div>
					<div class="checkout-summary-line-value">{{ props.shippingFeeValue }}</div>
				</div>
				<div class="checkout-summary-line">
					<div class="checkout-summary-line-label">{{ props.discountsLabel }}</div>
					<div class="checkout-summary-line-value is-discount">{{ props.discountValue }}</div>
				</div>
				<div class="checkout-summary-line is-total">
					<div class="checkout-summary-line-label">{{ props.totalLabel }}</div>
					<div class="checkout-summary-line-value">{{ props.totalValue }}</div>
				</div>
			</div>

			<UiButton
				variant="filled"
				tone="neutral"
				size="lg"
				class="checkout-summary-submit"
				:disabled="props.disabled || props.loading"
				@click="emit('submit')"
			>
				{{ props.completeLabel }}
			</UiButton>

			<div class="checkout-summary-agreement">
				<span class="checkout-summary-agreement-text">{{ props.agreementPrefix }}</span>
				<NuxtLink :to="props.termsPath" class="checkout-summary-agreement-link">{{ props.agreementTerms }}</NuxtLink>
				<span class="checkout-summary-agreement-text">{{ props.agreementAnd }}</span>
				<NuxtLink :to="props.privacyPath" class="checkout-summary-agreement-link">{{ props.agreementPrivacy }}</NuxtLink>
				<span class="checkout-summary-agreement-text">{{ props.agreementSuffix }}</span>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.checkout-summary-card {
	border: 1px solid var(--gray-50);
	border-radius: 10px;
	background: var(--contrast-light);
	overflow: hidden;

	.checkout-summary-title {

		padding: 12px 24px;
		border-bottom: 1px solid var(--gray-50);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);

			.checkout-summary-title-actions {
				display: inline-flex;
				align-items: center;
				gap: 12px;

				.checkout-summary-title-action {
					width: 24px;
					height: 24px;
					padding: 0;
					min-height: auto;
					color: var(--text-primary);
					display: inline-flex;
					align-items: center;
					justify-content: center;
					box-shadow: none;
				}
			}
		}

	.checkout-summary-list {
		max-height: 360px;
		overflow: auto;

		.checkout-summary-item {
			display: grid;
			grid-template-columns: 46px 1fr auto;
			align-items: center;
			gap: 12px;
			padding: 16px 18px;
			border-bottom: 1px solid var(--gray-50);

			.checkout-summary-thumb {
				width: 40px;
				height: 40px;
				border-radius: 8px;
				background: var(--gray-20);
				overflow: hidden;
				display: grid;
				place-items: center;

				&.skeleton-block {
					border-radius: 8px;
					background: linear-gradient(90deg, var(--gray-20) 25%, var(--gray-40) 37%, var(--gray-20) 63%);
					background-size: 400% 100%;
					animation: checkout-summary-skeleton-shimmer 1.4s ease-in-out infinite;
				}

				.checkout-summary-thumb-image {
					width: 26px;
					height: 26px;
					object-fit: contain;
				}
			}

			.checkout-summary-info {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100%;
				.checkout-summary-name {

					color: var(--text-primary);
					font-size: var(--type-size-100);
					font-weight: var(--font-weight-bold);
					line-height: var(--type-line-100);
				}

				.checkout-summary-meta {

					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
				}
			}

			.checkout-summary-price {
				font-size: var(--type-size-200);
				font-weight: var(--font-weight-bold);
				line-height: var(--type-line-200);
				color: var(--text-primary);
			}

			.checkout-summary-skeleton-line {
				border-radius: 8px;
				background: linear-gradient(90deg, var(--gray-20) 25%, var(--gray-40) 37%, var(--gray-20) 63%);
				background-size: 400% 100%;
				animation: checkout-summary-skeleton-shimmer 1.4s ease-in-out infinite;

				&.checkout-summary-skeleton-line--name {
					width: 132px;
					height: 20px;
				}

				&.checkout-summary-skeleton-line--meta {
					width: 96px;
					height: 12px;
				}

				&.checkout-summary-skeleton-line--price {
					width: 58px;
					height: 14px;
					justify-self: end;
				}
			}
		}
	}

	.checkout-summary-footer {
		padding: 16px 24px 24px;

		.checkout-summary-lines {
			display: flex;
			flex-direction: column;
			gap: 4px;

			.checkout-summary-line {

				display: flex;
				align-items: center;
				justify-content: space-between;
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);

				.checkout-summary-line-value {
					color: var(--text-primary);
					font-weight: var(--font-weight-semibold);

					&.is-discount {
						color: var(--error);
					}
				}

				&.is-total {
					color: var(--text-primary);
					font-weight: var(--font-weight-bold);

					.checkout-summary-line-value {
						font-size: var(--type-size-400);
						line-height: var(--type-line-400);
						font-weight: var(--font-weight-bold);
					}
				}
			}
		}

		.checkout-summary-submit {
			width: 100%;
			margin-top: 16px;
			border-radius: 16px;
			box-shadow: none;
			font-size: var(--type-size-200);
			line-height: var(--type-line-200);
		}

		.checkout-summary-agreement {
			margin-top: 10px;
			text-align: center;
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			color: var(--text-primary);

			.checkout-summary-agreement-link {
				color: var(--text-primary);
				font-weight: var(--font-weight-semibold);
				text-decoration: underline;
				margin-inline: 2px;
			}
		}
	}

	&.is-member {
		.checkout-summary-list {
			.checkout-summary-item {
				grid-template-columns: 40px 1fr auto;
				padding: 16px 24px;
				border-bottom-color: var(--gray-40);

				.checkout-summary-thumb {
					width: 40px;
					height: 40px;
					border-radius: 12px;

					.checkout-summary-thumb-image {
						width: 24px;
						height: 24px;
					}
				}
			}
		}

		.checkout-summary-footer {
			.checkout-summary-lines {
				.checkout-summary-line {
					&.is-total {
						.checkout-summary-line-value {
							font-size: var(--type-size-400);
							line-height: var(--type-line-400);
						}
					}
				}
			}
		}
	}
}

@keyframes checkout-summary-skeleton-shimmer {
	0% {
		background-position: 100% 0;
	}

	100% {
		background-position: 0 0;
	}
}
</style>