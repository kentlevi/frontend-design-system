<script setup lang="ts">
const drawerState = ref<'empty' | 'item'>('empty');
const featuredOpen = ref(true);

const hasItem = computed(() => drawerState.value === 'item');
const itemCount = computed(() => (hasItem.value ? 1 : 0));

function showEmpty() {
    drawerState.value = 'empty';
}

function showItem() {
    drawerState.value = 'item';
}

function toggleFeatured() {
    featuredOpen.value = !featuredOpen.value;
}
</script>

<template>
    <section class="guide-wrapper guide-cart-patterns">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">Cart Patterns</h1>
            <p class="guide-description">
                Reference patterns for the cart preview drawer, upload flow, and
                checkout actions.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Preview Drawer Structure</h2>
            <div class="cart-pattern-structure-grid">
                <article class="cart-pattern-card">
                    <h3 class="cart-pattern-card-title">Header</h3>
                    <ul class="cart-pattern-list">
                        <li>Shows item count and "Continue shopping" action.</li>
                        <li>Close action is always visible.</li>
                        <li>Keep height fixed to avoid content jump.</li>
                    </ul>
                </article>

                <article class="cart-pattern-card">
                    <h3 class="cart-pattern-card-title">Body</h3>
                    <ul class="cart-pattern-list">
                        <li>Empty state appears when count is zero.</li>
                        <li>Line item shows thumbnail, size, qty, and total.</li>
                        <li>Featured suggestions can collapse independently.</li>
                    </ul>
                </article>

                <article class="cart-pattern-card">
                    <h3 class="cart-pattern-card-title">Footer</h3>
                    <ul class="cart-pattern-list">
                        <li>Subtotal and note stay above final actions.</li>
                        <li>Use one filled neutral CTA for checkout.</li>
                        <li>Use outline neutral CTA for view-cart fallback.</li>
                    </ul>
                </article>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Upload Modal Actions</h2>
            <article class="cart-pattern-card">
                <p class="cart-pattern-copy">
                    Upload flow needs clear secondary actions before the primary
                    submit action.
                </p>
                <div class="cart-pattern-actions">
                    <UiButton variant="outline" tone="neutral">
                        Replace Image
                    </UiButton>
                    <UiButton variant="ghost" tone="neutral">Skip</UiButton>
                    <UiButton variant="filled" tone="neutral">
                        Add To Cart
                    </UiButton>
                </div>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Interactive Drawer Demo</h2>
            <article class="cart-pattern-card">
                <div class="cart-demo-toolbar">
                    <UiButton
                        tone="neutral"
                        :variant="drawerState === 'empty' ? 'filled' : 'outline'"
                        @click="showEmpty"
                    >
                        Empty
                    </UiButton>
                    <UiButton
                        tone="neutral"
                        :variant="drawerState === 'item' ? 'filled' : 'outline'"
                        @click="showItem"
                    >
                        With Item
                    </UiButton>
                    <UiButton
                        tone="neutral"
                        variant="outline"
                        :disabled="!hasItem"
                        @click="toggleFeatured"
                    >
                        {{ featuredOpen ? 'Hide Featured' : 'Show Featured' }}
                    </UiButton>
                </div>

                <div class="cart-demo-drawer">
                    <header class="cart-demo-header">
                        <h3 class="cart-demo-title">
                            Cart Preview ({{ itemCount }})
                        </h3>
                        <UiButton tone="neutral" variant="ghost" size="sm">
                            Continue Shopping
                        </UiButton>
                    </header>

                    <div class="cart-demo-body">
                        <section v-if="!hasItem" class="cart-demo-empty">
                            <img
                                src="/illustrations/cart/empty-cart-basket.svg"
                                alt="Empty shopping basket"
                                width="64"
                                height="64"
                            />
                            <p>Your cart is currently empty.</p>
                        </section>

                        <article v-else class="cart-demo-item">
                            <div class="cart-demo-item-top">
                                <p class="cart-demo-item-name">
                                    Die-Cut Stickers
                                </p>
                                <strong>$29.74</strong>
                            </div>
                            <p class="cart-demo-item-meta">Size: Medium</p>
                            <p class="cart-demo-item-meta">Qty: 150</p>
                        </article>

                        <section
                            v-if="hasItem && featuredOpen"
                            class="cart-demo-featured"
                        >
                            <p class="cart-demo-featured-title">
                                Featured Items
                            </p>
                            <div class="cart-demo-featured-grid">
                                <article class="cart-demo-featured-card">
                                    <p>Roll Stickers</p>
                                    <UiButton
                                        tone="neutral"
                                        variant="subtle"
                                        size="sm"
                                    >
                                        Customize
                                    </UiButton>
                                </article>
                                <article class="cart-demo-featured-card">
                                    <p>Sticker Sheets</p>
                                    <UiButton
                                        tone="neutral"
                                        variant="subtle"
                                        size="sm"
                                    >
                                        Customize
                                    </UiButton>
                                </article>
                            </div>
                        </section>
                    </div>

                    <footer v-if="hasItem" class="cart-demo-footer">
                        <p class="cart-demo-total">
                            <span>Total</span>
                            <strong>$29.74</strong>
                        </p>
                        <div class="cart-demo-actions">
                            <UiButton tone="neutral" variant="outline">
                                View Cart
                            </UiButton>
                            <UiButton tone="neutral" variant="filled">
                                Checkout
                            </UiButton>
                        </div>
                    </footer>
                </div>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Implementation Checklist</h2>
            <article class="cart-pattern-card">
                <ul class="cart-pattern-list">
                    <li>Drawer and modal must close on overlay click and ESC.</li>
                    <li>Icon-only controls require explicit accessible labels.</li>
                    <li>Empty state image includes width/height and meaningful alt text.</li>
                    <li>Checkout CTA stays disabled until required data is ready.</li>
                    <li>Use data-testid markers for all critical cart actions.</li>
                </ul>
            </article>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-cart-patterns {
    .cart-pattern-structure-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
    }

    .cart-pattern-card {
        border: 1px solid var(--border-default);
        border-radius: 14px;
        background: var(--contrast-light);
        padding: 16px;
        display: grid;
        gap: 12px;
    }

    .cart-pattern-card-title {
        margin: 0;
        color: var(--text-primary);
        font-size: 18px;
        line-height: 28px;
    }

    .cart-pattern-copy {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 24px;
    }

    .cart-pattern-list {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: 6px;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 24px;
    }

    .cart-pattern-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
    }

    .cart-demo-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .cart-demo-drawer {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        overflow: hidden;
    }

    .cart-demo-header {
        min-height: 62px;
        border-bottom: 1px solid var(--border-default);
        padding: 0 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .cart-demo-title {
        margin: 0;
        color: var(--text-primary);
        font-size: 16px;
        line-height: 24px;
    }

    .cart-demo-body {
        padding: 14px;
        display: grid;
        gap: 12px;
        background: var(--bg-page);
    }

    .cart-demo-empty {
        display: grid;
        gap: 8px;
        justify-items: center;
        text-align: center;

        p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 22px;
        }
    }

    .cart-demo-item {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--contrast-light);
        padding: 12px;
    }

    .cart-demo-item-top {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        align-items: center;
    }

    .cart-demo-item-name {
        margin: 0;
        color: var(--text-primary);
        font-size: 14px;
        line-height: 22px;
        font-weight: 600;
    }

    .cart-demo-item-meta {
        margin: 2px 0 0;
        color: var(--text-secondary);
        font-size: 13px;
        line-height: 20px;
    }

    .cart-demo-featured {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--contrast-light);
        padding: 12px;
        display: grid;
        gap: 10px;
    }

    .cart-demo-featured-title {
        margin: 0;
        color: var(--text-primary);
        font-size: 13px;
        line-height: 20px;
        font-weight: 600;
    }

    .cart-demo-featured-grid {
        display: grid;
        gap: 8px;
    }

    .cart-demo-featured-card {
        border: 1px solid var(--border-default);
        border-radius: 8px;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;

        p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 13px;
            line-height: 20px;
        }
    }

    .cart-demo-footer {
        border-top: 1px solid var(--border-default);
        padding: 12px 14px;
        display: grid;
        gap: 10px;
        background: var(--contrast-light);
    }

    .cart-demo-total {
        margin: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-primary);
        font-size: 14px;
        line-height: 22px;
    }

    .cart-demo-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }

    @media (max-width: 980px) {
        .cart-pattern-structure-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 680px) {
        .cart-pattern-structure-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
