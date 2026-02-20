<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

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
    <section class="guide-wrapper guide-locale-switcher">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Locale Switcher</h1>
            <p class="guide-description">
                Basic locale toggle control used for language selection.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Default</h2>
            <div class="guide-row">
                <div class="guide-item guide-item-hoverable no-border">
                    <UiLocaleSwitcher />
                </div>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">i18n in Action</h2>
            <div class="guide-row">
                <article class="guide-locale-demo">
                    <p class="guide-locale-demo-locale">
                        Active locale:
                        <strong>{{ locale }}</strong>
                    </p>

                    <h3 class="guide-locale-demo-title">
                        {{ t('home.hero.title') }}
                    </h3>
                    <p class="guide-locale-demo-subtitle">
                        {{ t('home.hero.subtitle') }}
                    </p>

                    <p class="guide-locale-demo-cart-title">
                        {{ t('cart.cartPreview.emptyTitle') }}
                    </p>
                    <p class="guide-locale-demo-cart-description">
                        {{ t('cart.cartPreview.emptyDescription') }}
                    </p>

                    <div class="guide-locale-demo-actions">
                        <button
                            v-for="item in locales"
                            :key="item.code"
                            type="button"
                            class="guide-locale-demo-button"
                            :class="{ 'is-active': locale === item.code }"
                            @click="changeLocale(item.code)"
                        >
                            {{ item.name }}
                        </button>
                    </div>

                    <ul class="guide-locale-demo-keys">
                        <li>
                            <code>home.hero.title</code>
                        </li>
                        <li>
                            <code>home.hero.subtitle</code>
                        </li>
                        <li>
                            <code>cart.cartPreview.emptyTitle</code>
                        </li>
                        <li>
                            <code>cart.cartPreview.emptyDescription</code>
                        </li>
                    </ul>
                </article>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-locale-demo {
    width: min(680px, 100%);
    border: 1px solid var(--border-default);
    border-radius: 14px;
    background: var(--contrast-light);
    padding: 18px;
}

.guide-locale-demo-locale {
    margin: 0 0 10px;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 20px;
}

.guide-locale-demo-title {
    margin: 0;
    color: var(--text-primary);
    font-size: 24px;
    line-height: 34px;
}

.guide-locale-demo-subtitle {
    margin: 8px 0 14px;
    color: var(--text-secondary);
    font-size: 15px;
    line-height: 24px;
}

.guide-locale-demo-cart-title {
    margin: 0;
    color: var(--text-primary);
    font-size: 18px;
    line-height: 28px;
}

.guide-locale-demo-cart-description {
    margin: 6px 0 14px;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 24px;
}

.guide-locale-demo-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.guide-locale-demo-button {
    border: 1px solid var(--border-default);
    border-radius: 999px;
    background: var(--contrast-light);
    color: var(--text-secondary);
    padding: 7px 12px;
    font-size: 13px;
    line-height: 18px;
    cursor: pointer;
    transition:
        border-color 0.15s ease,
        color 0.15s ease,
        background-color 0.15s ease;

    &:hover {
        border-color: var(--brand-secondary);
        color: var(--brand-secondary);
    }

    &.is-active {
        background: var(--brand-secondary);
        border-color: var(--brand-secondary);
        color: var(--contrast-light);
    }
}

.guide-locale-demo-keys {
    margin: 0;
    padding-left: 18px;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 22px;
}
</style>
