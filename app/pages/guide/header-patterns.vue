<script setup lang="ts">
const demoSearchOpen = ref(false);
const demoLocaleOpen = ref(false);
const demoAccountOpen = ref(false);
const demoQuery = ref('');
</script>

<template>
    <section class="guide-wrapper guide-header-patterns">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">Header Patterns</h1>
            <p class="guide-description">
                Reference for primary header composition, search behavior, locale
                actions, and account/cart affordances.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Main Bar Anatomy</h2>
            <div class="header-pattern-grid">
                <article class="header-pattern-card">
                    <h3 class="header-pattern-card-title">Left Zone</h3>
                    <ul class="header-pattern-list">
                        <li>Brand mark and primary navigation links.</li>
                        <li>Active route state is visibly distinct.</li>
                        <li>Navigation labels remain concise for localization.</li>
                    </ul>
                </article>

                <article class="header-pattern-card">
                    <h3 class="header-pattern-card-title">Right Zone</h3>
                    <ul class="header-pattern-list">
                        <li>Locale, search, cart, and account actions.</li>
                        <li>Icon-only actions require explicit accessible names.</li>
                        <li>Keep click targets consistent in size.</li>
                    </ul>
                </article>

                <article class="header-pattern-card">
                    <h3 class="header-pattern-card-title">Overlay Priority</h3>
                    <ul class="header-pattern-list">
                        <li>Search, locale, and cart overlays should not stack.</li>
                        <li>Opening one closes the others to prevent collisions.</li>
                        <li>Escape key closes active top-level overlay.</li>
                    </ul>
                </article>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Interactive Header Demo</h2>
            <article class="header-pattern-card">
                <header class="header-demo-bar">
                    <div class="header-demo-left">
                        <UiLogo name="musticker" variant="mark" :size="36" />
                        <nav class="header-demo-nav">
                            <a href="#" @click.prevent>Stickers</a>
                            <a href="#" @click.prevent>Rolls</a>
                            <a href="#" @click.prevent>Sheets</a>
                        </nav>
                    </div>

                    <div class="header-demo-actions">
                        <UiButton
                            tone="neutral"
                            variant="outline"
                            size="sm"
                            @click="demoLocaleOpen = !demoLocaleOpen"
                        >
                            Locale
                        </UiButton>
                        <UiButton
                            tone="neutral"
                            variant="outline"
                            size="sm"
                            @click="demoSearchOpen = !demoSearchOpen"
                        >
                            Search
                        </UiButton>
                        <UiButton
                            tone="neutral"
                            variant="outline"
                            size="sm"
                            @click="demoAccountOpen = !demoAccountOpen"
                        >
                            Account
                        </UiButton>
                    </div>
                </header>

                <div class="header-demo-panels">
                    <section v-if="demoSearchOpen" class="header-demo-panel">
                        <h4>Search Modal Pattern</h4>
                        <UiInput
                            v-model="demoQuery"
                            placeholder="Search products..."
                            icon-left="search"
                        />
                        <p>Recent searches, grouped results, and keyboard navigation live here.</p>
                    </section>

                    <section v-if="demoLocaleOpen" class="header-demo-panel">
                        <h4>Locale Modal Pattern</h4>
                        <p>Show selected locale, readable country names, and currency context.</p>
                        <div class="header-demo-locale-row">
                            <UiFlag code="us" :size="20" />
                            <span>English (USD)</span>
                        </div>
                    </section>

                    <section v-if="demoAccountOpen" class="header-demo-panel">
                        <h4>Account Menu Pattern</h4>
                        <p>Account links, profile route, and logout action grouped by priority.</p>
                        <div class="header-demo-account-actions">
                            <UiButton tone="neutral" variant="subtle" size="sm">Profile</UiButton>
                            <UiButton tone="neutral" variant="subtle" size="sm">Orders</UiButton>
                            <UiButton tone="neutral" variant="outline" size="sm">Sign out</UiButton>
                        </div>
                    </section>
                </div>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Implementation Checklist</h2>
            <article class="header-pattern-card">
                <ul class="header-pattern-list">
                    <li>Only one overlay panel is open at a time.</li>
                    <li>Header buttons expose clear labels for assistive tech.</li>
                    <li>Active nav and account states are keyboard reachable.</li>
                    <li>Search and locale overlays keep focus in active container.</li>
                    <li>Header remains stable at all breakpoints and long locales.</li>
                </ul>
            </article>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-header-patterns {
    .header-pattern-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
    }

    .header-pattern-card {
        border: 1px solid var(--border-default);
        border-radius: 14px;
        background: var(--contrast-light);
        padding: 16px;
        display: grid;
        gap: 12px;
    }

    .header-pattern-card-title {
        margin: 0;
        color: var(--text-primary);
        font-size: 16px;
        line-height: 28px;
    }

    .header-pattern-list {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: 6px;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 24px;
    }

    .header-demo-bar {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--bg-page);
        padding: 12px;
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
    }

    .header-demo-left {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .header-demo-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        a {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 14px;
            line-height: 22px;

            &:hover {
                color: var(--text-primary);
            }
        }
    }

    .header-demo-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .header-demo-panels {
        display: grid;
        gap: 10px;
    }

    .header-demo-panel {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        padding: 12px;
        background: var(--bg-page);
        display: grid;
        gap: 8px;

        h4 {
            margin: 0;
            color: var(--text-primary);
            font-size: 15px;
            line-height: 24px;
        }

        p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 13px;
            line-height: 21px;
        }
    }

    .header-demo-locale-row {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--text-secondary);
        font-size: 13px;
    }

    .header-demo-account-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    @media (max-width: 980px) {
        .header-pattern-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 720px) {
        .header-pattern-grid {
            grid-template-columns: 1fr;
        }

        .header-demo-bar {
            flex-direction: column;
            align-items: flex-start;
        }
    }
}
</style>
