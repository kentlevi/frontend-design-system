<script setup lang="ts">
const { t } = useI18n();

const types = [
    { key: 'dieCut', image: '/illustrations/products/stickers/die-cut.svg' },
    {
        key: 'dieCutRoll',
        image: '/illustrations/products/roll-stickers/die-cut-labels.svg',
    },
    { key: 'sheet', image: '/illustrations/products/stickers/sheet.svg' },
    { key: 'hologram', image: '/illustrations/products/stickers/hologram.svg' },
    {
        key: 'vinyl',
        image: '/illustrations/products/stickers/vinyl-lettering.svg',
    },
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
                    <img
                        :src="item.image"
                        :alt="t(`home.productTypes.${item.key}`)"
                        loading="lazy"
                    />
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
        width: 104px;
        height: 86px;
        display: grid;
        place-items: center;

        img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            display: block;
            object-fit: contain;
        }
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
