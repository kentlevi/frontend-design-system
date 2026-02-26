<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();

const currentCountry = computed(() => {
    const country = route.params.country;
    if (typeof country === 'string' && country.length > 0) return country;
    if (Array.isArray(country) && country[0]) return country[0];
    return 'en';
});

function withCountry(path: string) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `/${currentCountry.value}${normalizedPath}`;
}

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
                    />
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
    padding: 54px 24px 30px;

    .home-types-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        gap: 46px;
        .home-types-item {
            width: 136px;
            display: grid;
            justify-items: center;
            gap: 10px;
            border-radius: 16px;
            text-decoration: none;
            padding: 8px 6px 12px;
            transition: background-color 0.2s ease;

            &:hover {
                background: var(--gray-20);

                .home-types-image {
                    transform: scale(1.07);
                }
            }

            .home-types-icon {
                width: 104px;
                height: 86px;
                display: grid;
                place-items: center;

                .home-types-image {
                    max-width: 100%;
                    max-height: 100%;
                    width: auto;
                    height: auto;
                    display: block;
                    object-fit: contain;
                    transform-origin: center;
                    transition: transform 0.24s ease;
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
    }
}
</style>
