<script setup lang="ts">
import { useCountry } from '@/composables/app/useCountry';

const { t } = useI18n();
const { withCountry } = useCountry();

const types = [
    {
        key: 'dieCut',
        image: '/illustrations/products/stickers/die-cut.svg',
        to: '/stickers/die-cut',
    },
    {
        key: 'dieCutRoll',
        image: '/illustrations/products/roll-stickers/die-cut-labels.svg',
        to: '/roll-stickers/die-cut-roll',
    },
    {
        key: 'sheet',
        image: '/illustrations/products/stickers/sheet.svg',
        to: '/stickers/sticker-sheet',
    },
    {
        key: 'hologram',
        image: '/illustrations/products/stickers/hologram.svg',
        to: '/stickers/hologram',
    },
    {
        key: 'vinyl',
        image: '/illustrations/products/stickers/vinyl-lettering.svg',
        to: '/stickers/vinyl-lettering',
    },
];
</script>

<template>
    <section class="home-types" data-testid="home-product-types-section">
        <div class="home-types-container">
            <NuxtLink
                v-for="item in types"
                :key="item.key"
                :to="withCountry(item.to)"
                class="home-types-item"
                :data-testid="`home-product-type-${item.key}`"
            >
                <div class="home-types-icon">
                    <img
                        :src="item.image"
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        class="home-types-image"
                    >
                </div>
                <p class="home-types-label">
                    {{ t(`home.productTypes.${item.key}`) }}
                </p>
            </NuxtLink>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-types {
    margin-bottom: 56px;

    .home-types-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        gap: 46px;

        .home-types-item {
            width: 180px;
            display: flex;
            flex-direction: column;
            border-radius: 16px;
            text-decoration: none;
            transition: background-color 0.2s ease;

            &:hover {
                background: var(--gray-20);

                .home-types-image {
                    transform: scale(1.07);
                }
            }

            .home-types-icon {
                width: 180px;
                height: 120px;
                display: flex;
                place-items: center;
                justify-content: center;

                .home-types-image {
                    max-width: 125px;
                    max-height: 96px;
                    width: auto;
                    height: auto;
                    display: block;
                    object-fit: contain;
                    transform-origin: center;
                    transition: transform 0.24s ease;
                }
            }

            .home-types-label {
                padding-bottom: 12px;
                font-size: 16px;
                font-weight: 500;
                line-height: 28px;
                text-align: center;
                color: #232735;
            }
        }
    }
}
</style>
