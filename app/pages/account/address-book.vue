<script setup lang="ts">
definePageMeta({
    layout: 'home',
});

type AddressType = 'Home' | 'Office' | 'Client';
const { t } = useI18n();

const items: Array<{
    name: string;
    phone?: string;
    address: string;
    company: string;
    tag: AddressType;
    isDefault?: boolean;
}> = [
    {
        name: 'Joy Love',
        phone: '+1 (551) 236-4533',
        address:
            '176-6, Yusan-ri, Gusan-myeon, Gaseong-si, Incheon 01000, Republic of Korea',
        company: 'Summit Inc.',
        tag: 'Home',
        isDefault: true,
    },
    {
        name: 'Joy Love',
        phone: '+1 (818) 922-5542',
        address:
            '9F, 310 Teheran-ro, Gangnam-gu, Seoul 06241, Republic of Korea',
        company: 'Lock&Lock Inc.',
        tag: 'Office',
    },
    {
        name: 'Joy Love',
        phone: '+1 (963) 524-8858',
        address:
            '18F, 45 Gwanggyo Jungang-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do 41577, Republic of Korea',
        company: 'Lock&Lock Inc.',
        tag: 'Client',
    },
];
</script>

<template>
    <section class="account-page">
        <AccountShell active-tab="address-book">
            <div class="account-content">
                <div class="page-header">
                    <h1>{{ t('account.addressBook.title') }}</h1>
                    <UiButton variant="filled" tone="neutral" size="md">{{
                        t('account.addressBook.addNew')
                    }}</UiButton>
                </div>

                <div class="page-grid">
                    <div class="left">
                        <h2>{{ t('account.addressBook.shippingTitle') }}</h2>
                        <p>
                            {{ t('account.addressBook.shippingDescription') }}
                        </p>
                    </div>
                    <div class="right">
                        <article
                            v-for="(item, index) in items"
                            :key="`${item.name}-${index}`"
                            class="card"
                        >
                            <header>
                                <h3>{{ item.name }}</h3>
                                <span
                                    v-if="item.isDefault"
                                    class="pill pill-default"
                                    >{{
                                        t('account.addressBook.default')
                                    }}</span
                                >
                                <button type="button" class="ghost">...</button>
                            </header>
                            <p class="phone" v-if="item.phone">
                                {{ item.phone }}
                            </p>
                            <p class="address">{{ item.address }}</p>
                            <div class="card-footer">
                                <span>{{ item.company }}</span>
                                <span class="pill">{{
                                    t(`account.addressBook.tags.${item.tag}`)
                                }}</span>
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

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 26px;

        h1 {
            margin: 0;
            font-size: 52px;
            line-height: 1.05;
            color: var(--text-primary);
        }
    }

    .page-grid {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 24px;
    }

    .left {
        h2 {
            margin: 0 0 8px;
            font-size: 34px;
        }

        p {
            margin: 0;
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.6;
        }
    }

    .right {
        display: grid;
        gap: 12px;
    }

    .card {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--contrast-light);
        padding: 16px;

        header {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        h3 {
            margin: 0;
            font-size: 24px;
        }

        .ghost {
            margin-left: auto;
            border: 0;
            background: transparent;
            font-size: 20px;
            cursor: pointer;
            color: var(--text-secondary);
        }

        .phone {
            margin-top: 10px;
            color: var(--text-primary);
        }

        .address {
            margin-top: 6px;
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .card-footer {
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
    }

    .pill {
        height: 24px;
        border-radius: 999px;
        padding: 0 10px;
        display: inline-flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        background: #ddf7ef;
        color: #0f8a6a;
    }

    .pill-default {
        background: #f2f4f8;
        color: #6b7280;
    }

    @media (max-width: 980px) {
        .page-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
