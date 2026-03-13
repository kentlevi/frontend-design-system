<script setup lang="ts">
import { useCountry } from '~/composables/app/country/useCountry';
import { headerCheckoutConfig } from '~/data/layout/header';

const { withCountry } = useCountry();
</script>

<template>
	<header class="checkout-header" data-testid="checkout-header">
		<div class="checkout-header-inner">
			<div class="checkout-header-left">
				<NuxtLink :to="withCountry('/')" class="checkout-header-logo" aria-label="Musticker">
					<UiLogo name="musticker" variant="full" color="colored" :width="112" :size="54" />
				</NuxtLink>
				<span class="checkout-header-divider" aria-hidden="true" />
				<p class="checkout-header-title">
					<UiIcon name="regular-shield" :size="32" color="var(--text-primary)" />
					{{ headerCheckoutConfig.title }}
				</p>
			</div>

			<div class="checkout-header-contact">
				<a :href="`tel:${headerCheckoutConfig.phone.replace(/\\s+/g, '')}`" class="checkout-header-link">
					<UiIcon name="regular-phone" :size="24" color="var(--text-primary)" />
					{{ headerCheckoutConfig.phone }}
				</a>
				<a :href="`mailto:${headerCheckoutConfig.email}`" class="checkout-header-link">
					<UiIcon name="regular-envelope" :size="24" color="var(--text-primary)" />
					{{ headerCheckoutConfig.email }}
				</a>
			</div>
		</div>
	</header>
</template>

<style scoped lang="scss">
.checkout-header {
    border-bottom: 1px solid var(--gray-30);
    background: var(--bg-page);

    .checkout-header-inner {
        max-width: 1200px;
        margin: 0 auto;
        min-height: 74px;
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;

        .checkout-header-left {
            display: inline-flex;
            align-items: center;
            gap: 14px;

            .checkout-header-logo {
                height: fit-content;
            }

            .checkout-header-divider {
                width: 1px;
                height: 34px;
                background: var(--gray-50);
            }

            .checkout-header-title {

                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: var(--type-size-300);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-200);
                color: var(--text-primary);
            }
        }

        .checkout-header-contact {
            display: inline-flex;
            align-items: center;
            gap: 24px;

            .checkout-header-link {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--text-primary);
                text-decoration: none;
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                font-weight: var(--font-weight-semibold);
            }
        }
    }
}

@media (max-width: 980px) {
    .checkout-header {
        .checkout-header-inner {
            min-height: 64px;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            padding: 10px 16px;

            .checkout-header-left {
                .checkout-header-title {
                    font-size: var(--type-size-200);
                    line-height: var(--type-line-200);
                }
            }

            .checkout-header-contact {
                gap: 14px;
                flex-wrap: wrap;
            }
        }
    }
}
</style>