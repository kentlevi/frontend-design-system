<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
    <header class="checkout-header" data-testid="checkout-header">
        <div class="checkout-header-inner">
            <div class="checkout-header-left">
                <NuxtLink :to="localePath('/')" class="checkout-header-logo" aria-label="Musticker">
                    <UiLogo name="musticker" variant="full" color="colored" :width="112" :size="54" />
                </NuxtLink>
                <span class="checkout-header-divider" aria-hidden="true" />
                <p class="checkout-header-title">
                    <UiIcon name="strong-shield" :size="32" color="var(--text-primary)" />
                    Secure Checkout
                </p>
            </div>

            <div class="checkout-header-contact">
                <a href="tel:+6531582800" class="checkout-header-link">
                    <UiIcon name="strong-phone" :size="24" color="var(--text-primary)" />
                    +65 3158 2800
                </a>
                <a href="mailto:info@mustickers.com" class="checkout-header-link">
                    <UiIcon name="strong-envelope" :size="24" color="var(--text-primary)" />
                    info@mustickers.com
                </a>
            </div>
        </div>
    </header>
</template>

<style scoped lang="scss">
.checkout-header {
    border-bottom: 1px solid var(--gray-40);
    background: var(--bg-page);

    .checkout-header-inner {
        max-width: 1200px;
        margin: 0 auto;
        min-height: 74px;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;

        .checkout-header-left {
            display: inline-flex;
            align-items: center;
            gap: 14px;

            .checkout-header-divider {
                width: 1px;
                height: 24px;
                background: var(--gray-40);
            }

            .checkout-header-title {
                margin: 0;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 20px;
                font-weight: 600;
                line-height: 28px;
                color: var(--text-primary);
            }
        }

        .checkout-header-contact {
            display: inline-flex;
            align-items: center;
            gap: 20px;

            .checkout-header-link {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: var(--text-primary);
                text-decoration: none;
                font-size: 14px;
                line-height: 24px;
                font-weight: 500;
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
                    font-size: 18px;
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
