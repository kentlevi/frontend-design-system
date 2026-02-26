<script setup lang="ts">
import { useAccountAddressBook } from '~/composables/account/useAccountAddressBook';

const { t } = useI18n();
const { items } = useAccountAddressBook();
</script>

<template>
    <section class="account-page" data-testid="account-address-book-page">
        <AccountShell active-tab="address-book">
            <div class="account-content" data-testid="account-address-book-content">
                <header class="account-address-book-header" data-testid="account-address-book-header">
                    <h1 class="account-address-book-title" data-testid="account-address-book-title">
                        {{ t('account.addressBook.title') }}
                    </h1>
                    <UiButton variant="filled" tone="neutral" size="md" data-testid="account-address-book-add-button">
                        {{ t('account.addressBook.addNew') }}
                    </UiButton>
                </header>

                <div class="account-address-book-layout" data-testid="account-address-book-grid">
                    <div class="account-address-book-info" data-testid="account-address-book-info">
                        <h2 class="account-address-book-subtitle">
                            {{ t('account.addressBook.shippingTitle') }}
                        </h2>
                        <p class="account-address-book-description">
                            {{ t('account.addressBook.shippingDescription') }}
                        </p>
                    </div>

                    <div class="account-address-book-list" data-testid="account-address-book-list">
                        <article
                            v-for="(item, index) in items"
                            :key="`${item.name}-${index}`"
                            class="account-address-book-card"
                            :data-testid="`account-address-book-item-${index}`"
                        >
                            <header class="account-address-book-card-header">
                                <h3 class="account-address-book-card-name">{{ item.name }}</h3>
                                <span
                                    v-if="item.isDefault"
                                    class="account-address-book-pill account-address-book-pill-default"
                                >
                                    {{ t('account.addressBook.default') }}
                                </span>
                                <button
                                    type="button"
                                    class="account-address-book-menu-button"
                                    :data-testid="`account-address-book-item-menu-${index}-button`"
                                >
                                    ...
                                </button>
                            </header>
                            <p v-if="item.phone" class="account-address-book-card-phone">
                                {{ item.phone }}
                            </p>
                            <p class="account-address-book-card-address">{{ item.address }}</p>
                            <div class="account-address-book-card-footer">
                                <span class="account-address-book-card-company">{{ item.company }}</span>
                                <span class="account-address-book-pill">
                                    {{ t(`account.addressBook.tags.${item.tag}`) }}
                                </span>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </AccountShell>
    </section>
</template>

<style scoped lang="scss">
.account-page {
    background: var(--bg-page);
    min-height: calc(100vh - 176px);

    .account-content {
        padding-top: 24px;
    }
    .address-book-cards{
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    .account-address-book-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 26px;

        .account-address-book-title {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            line-height: 40px;
            letter-spacing: -0.5px;
            color: var(--text-primary);
        }
    }

    .account-address-book-layout {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 126px;
    }
    .account-address-book-info h2{
        font-size: 18px;
        font-weight: 600;
        line-height: 32px;
        letter-spacing: -0.5px;
    }
    .account-address-book-info p{
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: -0.5px;
    }


    .account-address-book-list {
        display: grid;
        gap: 12px;
    }

    .account-address-book-card {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--contrast-light);
        padding: 16px;

        .account-address-book-card-header {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .account-address-book-card-name {
            margin: 0;
            font-size: 24px;
        }

        .account-address-book-menu-button {
            margin-left: auto;
            border: 0;
            background: transparent;
            font-size: 20px;
            cursor: pointer;
            color: var(--text-secondary);
        }

        .account-address-book-card-phone {
            margin-top: 10px;
            color: var(--text-primary);
        }

        .account-address-book-card-address {
            margin-top: 6px;
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .account-address-book-card-footer {
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
    }

    .account-address-book-pill {
        height: 24px;
        border-radius: 999px;
        padding: 0 10px;
        display: inline-flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        background: color-mix(in srgb, var(--brand-primary) 16%, var(--contrast-light));
        color: var(--text-primary);
    }

    .account-address-book-pill-default {
        background: var(--surface-subtle);
        color: var(--text-secondary);
    }

    @media (max-width: 980px) {
        .account-address-book-layout {
            grid-template-columns: 1fr;
        }
    }
}
</style>

