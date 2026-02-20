<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const sampleCount = 3;

async function changeLocale(code: string) {
    if (code !== 'en' && code !== 'kr') return;
    const target = switchLocalePath(code);
    await setLocale(code);
    if (target) {
        await navigateTo(target);
    }
}
</script>

<template>
    <section class="guide-wrapper guide-i18n">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">i18n</h1>
            <p class="guide-description">
                Translation key conventions and runtime localization behavior.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Live Locale Demo</h2>
            <div class="guide-row">
                <article class="guide-i18n-card">
                    <p class="guide-i18n-locale">
                        Active locale:
                        <strong>{{ locale }}</strong>
                    </p>

                    <h3 class="guide-i18n-title">
                        {{ t('home.hero.title') }}
                    </h3>
                    <p class="guide-i18n-subtitle">
                        {{ t('home.hero.subtitle') }}
                    </p>

                    <p class="guide-i18n-preview">
                        {{
                            t('cart.cartPreview.previewTitle', {
                                count: sampleCount,
                            })
                        }}
                    </p>

                    <div class="guide-i18n-actions">
                        <button
                            v-for="item in locales"
                            :key="item.code"
                            type="button"
                            class="guide-i18n-button"
                            :class="{ 'is-active': locale === item.code }"
                            @click="changeLocale(item.code)"
                        >
                            {{ item.name }}
                        </button>
                    </div>
                </article>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Common Keys</h2>
            <div class="guide-row">
                <pre class="guide-i18n-code"><code>home.hero.title
home.hero.subtitle
cart.cartPreview.previewTitle
cart.cartPreview.emptyDescription</code></pre>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-i18n-card {
    width: min(720px, 100%);
    border: 1px solid var(--border-default);
    border-radius: 14px;
    background: var(--contrast-light);
    padding: 18px;
}

.guide-i18n-locale {
    margin: 0 0 10px;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 20px;
}

.guide-i18n-title {
    margin: 0;
    color: var(--text-primary);
    font-size: 24px;
    line-height: 34px;
}

.guide-i18n-subtitle {
    margin: 8px 0;
    color: var(--text-secondary);
    font-size: 15px;
    line-height: 24px;
}

.guide-i18n-preview {
    margin: 0 0 14px;
    color: var(--text-primary);
    font-size: 15px;
    line-height: 24px;
}

.guide-i18n-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.guide-i18n-button {
    border: 1px solid var(--border-default);
    border-radius: 999px;
    background: var(--contrast-light);
    color: var(--text-secondary);
    padding: 7px 12px;
    font-size: 13px;
    line-height: 18px;
    cursor: pointer;

    &.is-active {
        background: var(--brand-secondary);
        border-color: var(--brand-secondary);
        color: var(--contrast-light);
    }
}

.guide-i18n-code {
    width: min(720px, 100%);
    margin: 0;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid var(--border-default);
    background: #0f172a;
    color: #e2e8f0;
    font-size: 12px;
    line-height: 20px;
}
</style>
