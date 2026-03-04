<script setup lang="ts">
import { useCountry } from '@/composables/app/useCountry';

definePageMeta({
	layout: 'home',
	hideHeader: true,
	hideFooter: true,
});

const { withCountry } = useCountry();
</script>

<template>
	<section class="under-construction-page" data-testid="under-construction-page">
		<div class="under-construction-shell">
			<div class="under-construction-grid">
				<div class="under-construction-top-group">
					<UiLogo
						name="musticker"
						variant="full"
						color="colored"
						:size="88"
						class="under-construction-logo"
					/>
					<div class="under-construction-content-group">
						<div class="under-construction-heading-group">
							<h1 class="under-construction-title">Almost There!</h1>
							<p class="under-construction-copy">
								We're busy putting things together to make this feature awesome for you. Check back soon!
							</p>
						</div>

						<NuxtLink :to="withCountry('/')" class="under-construction-cta">
							Return to Homepage
						</NuxtLink>
					</div>
				</div>

				<img
					src="/illustrations/under-construction/boy-3.svg"
					alt=""
					class="under-construction-boy"
				>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.under-construction-page {
	height: 100dvh;
	min-height: 100dvh;
	background: var(--gold-base);
	display: grid;
	place-items: center;
	overflow: hidden;
	.under-construction-shell {
		width: 100%;
		height: 100%;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 56px;
		padding: 40px;

		.under-construction-grid {
			position: relative;
			width: 100%;
			height: 100%;
			min-height: 0;
			border-radius: 18px;
			background-color: var(--gold-base);
			background-image: url('/illustrations/under-construction/bg-page.png');
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center bottom;
			display: flex;
			flex-direction: column;
			gap: 64px;
			align-items: center;
			justify-content: center;

			.under-construction-top-group {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 56px;
				z-index: 1;

				.under-construction-logo {
					display: block;
					margin: 0 auto;
				}

				.under-construction-content-group {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 56px;

					.under-construction-heading-group {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 16px;

						.under-construction-title {
							font-size: var(--type-size-650);
							line-height: var(--type-line-650);
							font-weight: var(--font-weight-bold);
							color: var(--text-primary);
							letter-spacing: -0.03em;
							text-align: center;
						}

						.under-construction-copy {
							max-width: 900px;
							text-align: center;
							font-size: var(--type-size-300);
							line-height: var(--type-line-300);
							color: var(--text-primary);
						}
					}

					.under-construction-cta {
						min-height: 48px;
						padding: 10px 32px;
						border-radius: 18px;
						background: var(--text-primary);
						color: var(--white-base);
						text-decoration: none;
						font-size: var(--type-size-200);
						font-weight: var(--font-weight-semibold);
						line-height: var(--type-line-300);
					}
				}
			}

			.under-construction-boy {
				width: 400px;
				height: auto;
				display: block;
			}
		}
	}

	@media (max-width: 900px) {
		padding: 16px;

		.under-construction-shell {
			gap: 14px;

			.under-construction-cta {
				min-height: 50px;
				line-height: 50px;
				padding: 0 24px;
				border-radius: 14px;
			}

			.under-construction-grid {
				height: min(58vh, 480px);
				border-radius: 14px;
				background-position: center top;

				.under-construction-boy {
					margin-bottom: 12px;
				}
			}
		}
	}
}
</style>