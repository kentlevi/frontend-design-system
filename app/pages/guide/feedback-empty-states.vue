<template>
    <section class="guide-wrapper guide-feedback">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Feedback States</h1>
            <p class="guide-description">
                Communication patterns for success, warning, error, loading, and empty states.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Status Messages</h2>
            <div class="guide-grid">
                <article class="feedback-card is-success">
                    <h3>Success</h3>
                    <p>Your file has been uploaded and is ready for review.</p>
                </article>
                <article class="feedback-card is-warning">
                    <h3>Warning</h3>
                    <p>Your artwork resolution is low and may affect print quality.</p>
                </article>
                <article class="feedback-card is-error">
                    <h3>Error</h3>
                    <p>We could not submit your request. Please try again.</p>
                </article>
                <article class="feedback-card is-loading">
                    <h3>Loading</h3>
                    <p>Processing your design preview. This may take a few seconds.</p>
                </article>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Empty State Example</h2>
            <article class="empty-state-card">
                <img
                    src="/illustrations/cart/empty-cart-basket.svg"
                    alt="Empty shopping basket"
                    width="112"
                    height="112"
                    class="empty-state-image"
                />
                <h3>Your cart is currently empty.</h3>
                <p>
                    Explore our menu to add items to your cart, or pick from the featured favorites below.
                </p>
                <UiButton tone="neutral">Browse Products</UiButton>
            </article>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-feedback {
    .feedback-card {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        padding: 16px;

        h3 {
            margin: 0 0 6px;
            font-size: var(--type-size-200);
            line-height: var(--type-line-200);
            color: var(--text-primary);
        }

        p {
            margin: 0;
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--text-secondary);
        }
    }

    .is-success {
        border-color: var(--success);
    }

    .is-warning {
        border-color: var(--warning);
    }

    .is-error {
        border-color: var(--error);
    }

    .is-loading {
        border-color: var(--brand-secondary);
    }

    .empty-state-card {
        border: 1px solid var(--border-default);
        border-radius: 14px;
        background: var(--contrast-light);
        padding: 24px;
        text-align: center;
        display: grid;
        justify-items: center;
        gap: 10px;

        h3 {
            margin: 0;
            font-size: var(--type-size-500);
            line-height: var(--type-line-500);
            color: var(--text-primary);
        }

        p {
            margin: 0;
            max-width: 640px;
            font-size: var(--type-size-200);
            line-height: var(--type-line-200);
            color: var(--text-secondary);
        }
    }

    .empty-state-image {
        width: 112px;
        height: 112px;
        object-fit: contain;
    }
}
</style>
