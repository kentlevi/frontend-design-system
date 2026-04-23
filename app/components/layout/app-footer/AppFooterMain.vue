<script setup lang="ts">
import { toRefs } from 'vue';
import { useCountry } from '@/composables/app/country/useCountry';

const { t } = useI18n();
const { withCountry } = useCountry();

const component_props = defineProps<{
	year: number;
	isProduct: boolean;
}>();
const { year, isProduct: is_product } = toRefs(component_props);
</script>

<template>
	<div class="home-footer-inner" :class="{ 'is-product': is_product }" data-testid="app-footer-main-container">
		<div class="home-footer-left" data-testid="app-footer-main-left">
			<h2 class="home-footer-brand">{{ t('layout.footer.brand') }}</h2>
			<p class="home-footer-meta">
				{{ t('layout.footer.meta1') }}
			</p>
			<p class="home-footer-meta">
				{{ t('layout.footer.meta2') }}
			</p>
			<p class="home-footer-copy">
				{{ t('layout.footer.copyright') }} {{ year }}
				<NuxtLink :to="withCountry('/terms-of-use')" class="home-footer-policy-link" data-testid="app-footer-main-terms-link">{{ t('layout.footer.terms') }}</NuxtLink>
				<NuxtLink :to="withCountry('/privacy-policy')" class="home-footer-policy-link" data-testid="app-footer-main-privacy-link">{{ t('layout.footer.privacy') }}</NuxtLink>
			</p>
		</div>

		<div class="home-footer-right" data-testid="app-footer-main-right">
			<p class="home-footer-phone">1899-5529</p>
			<div class="home-footer-meta-row">
				<p class="home-footer-hours">{{ t('layout.footer.hours') }}</p>
				<p class="home-footer-note">{{ t('layout.footer.closed') }}</p>
			</div>
			<div class="home-footer-links">
				<NuxtLink :to="withCountry('/under-construction')" class="home-footer-action-link" data-testid="app-footer-main-inquiry-link">{{ t('layout.footer.inquiry') }}</NuxtLink>
				<NuxtLink :to="withCountry('/under-construction')" class="home-footer-action-link" data-testid="app-footer-main-faq-link">{{ t('layout.footer.faq') }}</NuxtLink>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.home-footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--footer-bg);
    color: var(--footer-text-muted);
    display: flex;
    justify-content: space-between;
    gap: 40px;
    padding: 78px 78px 48px;

    &.is-product {
        padding: 72px 0 48px 0;
    }
    .home-footer-left {
        flex: 1;

        .home-footer-brand {
            padding-bottom: 12px;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--abyss-50);
            font-size: var(--type-size-400);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-400);
            color: var(--footer-text-primary);
        }

        .home-footer-meta {
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--footer-text-primary);
        }

        .home-footer-copy {
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--footer-text-primary);
            display: flex;
            gap: 24px;

            .home-footer-policy-link {
                color: var(--footer-text-primary);
                text-decoration: none;
                font-size: var(--type-size-100);
                font-weight: var(--font-weight-bold);
                line-height: var(--type-line-100);
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .home-footer-right {
        text-align: right;

        .home-footer-phone {
            margin-bottom: 6px;
            font-size: var(--type-size-400);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-400);
            color: var(--footer-text-primary);
        }

        .home-footer-meta-row {
            display: inline-flex;
            justify-content: flex-end;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;

            .home-footer-hours {
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--footer-text-primary);
            }

            .home-footer-note {
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--footer-text-primary);
            }
        }

        .home-footer-links {
            display: flex;
            justify-content: end;
            gap: 8px;

            .home-footer-action-link {
                border: 1px solid var(--footer-border);
                color: var(--footer-text-primary);
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                text-decoration: none;
                padding: 2px 8px;
            }
        }
    }
}
</style>