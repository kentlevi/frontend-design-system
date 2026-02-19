<script setup lang="ts">
const { t } = useI18n();

const items = [
    {
        icon: 'strong-shield' as const,
        titleKey: 'quality.title',
        textKey: 'quality.text',
    },
    {
        icon: 'strong-ship' as const,
        titleKey: 'shipping.title',
        textKey: 'shipping.text',
    },
    {
        icon: 'strong-truck' as const,
        titleKey: 'freeDelivery.title',
        textKey: 'freeDelivery.text',
    },
];
</script>

<template>
    <section class="home-guarantees" data-testid="home-guarantees-section">
        <div class="home-guarantees-container">
            <article
                v-for="item in items"
                :key="item.titleKey"
                class="home-guarantees-item"
                :data-testid="`home-guarantee-${item.titleKey.replace('.title', '')}`"
            >
                <div class="home-guarantees-icon">
                    <UiIcon :name="item.icon" :size="30" color="var(--text-primary)" />
                </div>
                <h3 class="home-guarantees-title">
                    {{ t(`home.guarantees.${item.titleKey}`) }}
                </h3>
                <p class="home-guarantees-text">
                    {{ t(`home.guarantees.${item.textKey}`) }}
                </p>
            </article>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-guarantees {
    padding: 0 24px 70px;

    .home-guarantees-container {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 34px;

        .home-guarantees-item {
            max-width: 291px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;

            .home-guarantees-icon {
                width: 54px;
                height: 54px;
                margin: 0;
                border-radius: 12px;
                background: var(--surface-subtle);
                border: 1px solid var(--border-default);
                display: grid;
                place-items: center;
            }

            .home-guarantees-title {
                margin: 0;
                font-size: 18px;
                line-height: 32px;
                color: var(--text-primary);
            }

            .home-guarantees-text {
                margin: 0;
                font-size: 16px;
                line-height: 28px;
                color: var(--text-secondary);
            }
        }
    }
}
</style>
