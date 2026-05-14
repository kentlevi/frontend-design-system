<script setup lang="ts">
import { toRefs } from 'vue';
import { useCountry } from '@/composables/app/country/useCountry';

const { t: translate } = useI18n();
const { withCountry } = useCountry();

const component_props = defineProps<{
	year: number;
}>();
const { year } = toRefs(component_props);
</script>

<template>
	<div class="home-footer-compact" data-testid="app-footer-compact-container">
		<div class="home-footer-compact-left" data-testid="app-footer-compact-left">
			<span class="home-footer-compact-copy">{{ translate('layout.footer.copyright') }} {{ year }}</span>
			<span>{{ translate('layout.footer.sales') }}</span>
			<NuxtLink :to="withCountry('/terms-of-use')" class="home-footer-compact-policy-link" data-testid="app-footer-compact-terms-link">{{ translate('layout.footer.terms') }}</NuxtLink>
			<NuxtLink :to="withCountry('/privacy-policy')" class="home-footer-compact-policy-link" data-testid="app-footer-compact-privacy-link">{{ translate('layout.footer.privacy') }}</NuxtLink>
		</div>
		<div class="home-footer-compact-links" data-testid="app-footer-compact-links">
			<NuxtLink :to="withCountry('/under-construction')" class="home-footer-compact-action-link" data-testid="app-footer-compact-inquiry-link">{{ translate('layout.footer.inquiry') }}</NuxtLink>
			<NuxtLink :to="withCountry('/under-construction')" class="home-footer-compact-action-link" data-testid="app-footer-compact-faq-link">{{ translate('layout.footer.faq') }}</NuxtLink>
		</div>
	</div>
</template>

<style scoped lang="scss">
.home-footer-compact {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--footer-bg);
    padding: 24px 78px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;

    .home-footer-compact-left {
        display: flex;
        align-items: center;
        gap: 24px;
        color: var(--footer-text-secondary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);

        .home-footer-compact-policy-link {
            color: var(--footer-text-primary);
            text-decoration: none;
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            font-weight: var(--font-weight-semibold);
        }
    }

    .home-footer-compact-links {
        display: flex;
        align-items: center;
        gap: 8px;

        .home-footer-compact-action-link {
            border: 1px solid var(--footer-border);
            color: var(--footer-text-secondary);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            text-decoration: none;
            padding: 2px 8px;
        }
    }
}

@media (max-width: 900px) {
    .home-footer-compact {
        min-height: auto;
        padding: 18px 16px;
        flex-direction: column;
        align-items: flex-start;
        .home-footer-compact-left {
            flex-wrap: wrap;
            gap: 12px;
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);

            .home-footer-compact-policy-link {
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
            }
        }

        .home-footer-compact-links {
            .home-footer-compact-action-link {
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
            }
        }
    }
}
</style>