<script setup lang="ts">
import { definePageMeta } from '#imports';
import StatusBackgroundWrapper from '~/components/common/StatusBackgroundWrapper.vue';
import { useCountry } from '~/composables/app/country/useCountry';
const { t } = useI18n();

definePageMeta({
	layout: 'home',
	hideHeader: true,
	hideFooter: true,
});

const { withCountry } = useCountry();
</script>

<template>
	<StatusBackgroundWrapper test-id="under-construction-page" :full-height="true">
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
					<h1 class="under-construction-title">{{ t('underConstruction.title') }}</h1>
					<p class="under-construction-copy">
						{{ t('underConstruction.description') }}
					</p>
				</div>

				<NuxtLink :to="withCountry('/')" class="under-construction-cta">
					{{ t('underConstruction.returnHome') }}
				</NuxtLink>
			</div>

			<img
				src="/illustrations/under-construction/boy-3.svg"
				alt=""
				class="under-construction-boy"
			>
		</div>
	</StatusBackgroundWrapper>
</template>

<style scoped lang="scss">
.under-construction-top-group {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 56px;
}

.under-construction-logo {
    display: block;
    margin: 0 auto;
}

.under-construction-content-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 56px;
}

.under-construction-heading-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

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

.under-construction-boy {
    width: 400px;
    height: auto;
    display: block;
    margin: 0 auto;
}

@media (max-width: 900px) {
    .under-construction-top-group {
        gap: 14px;
    }

    .under-construction-cta {
        min-height: 50px;
        line-height: 50px;
        padding: 0 24px;
        border-radius: 14px;
    }

    .under-construction-boy {
        margin-bottom: 12px;
    }
}
</style>