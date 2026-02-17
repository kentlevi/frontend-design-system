<script setup lang="ts">
const { t } = useI18n();

const types = [
    { key: 'dieCut', icon: 'strong-star' as const },
    { key: 'dieCutRoll', icon: 'strong-ship' as const },
    { key: 'sheet', icon: 'strong-shield' as const },
    { key: 'hologram', icon: 'strong-stars' as const },
    { key: 'vinyl', icon: 'strong-truck' as const },
];
</script>

<template>
    <section class="home-types">
        <div class="home-types-container">
            <article
                v-for="item in types"
                :key="item.key"
                class="home-types-item"
            >
                <div class="home-types-icon">
                    <UiIcon :name="item.icon" :size="34" color="#25293a" />
                </div>
                <p class="home-types-label">
                    {{ t(`home.productTypes.${item.key}`) }}
                </p>
            </article>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-types {
    padding: 54px 24px 30px;

    .home-types-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        gap: 46px;
    }

    .home-types-item {
        width: 136px;
        display: grid;
        justify-items: center;
        gap: 10px;
    }

    .home-types-icon {
        width: 72px;
        height: 72px;
        border-radius: 20px;
        border: 1px solid #d8d8d8;
        background: #f3f3f3;
        display: grid;
        place-items: center;
    }

    .home-types-label {
        margin: 0;
        font-size: 14px;
        line-height: 1.25;
        text-align: center;
        color: #232735;
    }
}
</style>
