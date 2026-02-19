<script setup lang="ts">
const props = defineProps<{
    hasPickedProduct: boolean;
}>();

const { t } = useI18n();
</script>

<template>
    <section v-show="props.hasPickedProduct" class="product-guarantees-band" data-testid="product-category-guarantees-band">
        <div class="product-guarantees" data-testid="product-category-guarantees">
            <article class="guarantee-card" data-testid="product-category-guarantee-made-today">
                <img
                    src="/icons/custom/guarantees/delivery-truck.svg"
                    :alt="t('products.guarantees.madeToday.title')"
                    loading="lazy" class="product-details-image" />
                <h4 class="product-guarantee-title">{{ t('products.guarantees.madeToday.title') }}</h4>
                <p class="product-details-text">{{ t('products.guarantees.madeToday.text') }}</p>
            </article>
            <article class="guarantee-card" data-testid="product-category-guarantee-proof-review">
                <img
                    src="/icons/custom/guarantees/proof-review.svg"
                    :alt="t('products.guarantees.proofReview.title')"
                    loading="lazy" class="product-details-image" />
                <h4 class="product-guarantee-title">{{ t('products.guarantees.proofReview.title') }}</h4>
                <p class="product-details-text">{{ t('products.guarantees.proofReview.text') }}</p>
            </article>
            <article class="guarantee-card" data-testid="product-category-guarantee-durability">
                <img
                    src="/icons/custom/guarantees/weather-durability.svg"
                    :alt="t('products.guarantees.durability.title')"
                    loading="lazy" class="product-details-image" />
                <h4 class="product-guarantee-title">{{ t('products.guarantees.durability.title') }}</h4>
                <p class="product-details-text">{{ t('products.guarantees.durability.text') }}</p>
            </article>
        </div>
    </section>

    <div class="product-experience-container" data-testid="product-category-story-container">
        <section class="product-story" data-testid="product-category-story">
            <article class="story-row" data-testid="product-category-story-timeless">
                <div class="story-image">
                    <img
                        src="/illustrations/products/sticker-kids/kid-making-stickers.svg"
                        :alt="t('products.story.timeless.title')"
                        loading="lazy" class="product-details-image" />
                </div>
                <div class="story-copy">
                    <h3 class="product-story-title">{{ t('products.story.timeless.title') }}</h3>
                    <p class="product-details-text">{{ t('products.story.timeless.text') }}</p>
                </div>
            </article>
            <article class="story-row reverse" data-testid="product-category-story-quick-stick">
                <div class="story-image">
                    <img
                        src="/illustrations/products/sticker-kids/kid-laptop-sticker.svg"
                        :alt="t('products.story.quickStick.title')"
                        loading="lazy" class="product-details-image" />
                </div>
                <div class="story-copy">
                    <h3 class="product-story-title">{{ t('products.story.quickStick.title') }}</h3>
                    <p class="product-details-text">{{ t('products.story.quickStick.text') }}</p>
                </div>
            </article>
            <article class="story-row" data-testid="product-category-story-precise-cut">
                <div class="story-image">
                    <img
                        src="/illustrations/products/sticker-kids/kid-decorating-sheet.svg"
                        :alt="t('products.story.preciseCut.title')"
                        loading="lazy" class="product-details-image" />
                </div>
                <div class="story-copy">
                    <h3 class="product-story-title">{{ t('products.story.preciseCut.title') }}</h3>
                    <p class="product-details-text">{{ t('products.story.preciseCut.text') }}</p>
                </div>
            </article>
        </section>
    </div>
</template>

<style scoped lang="scss">
.product-guarantees-band {
    background: var(--gray-10);
    padding: 48px 0;

    .product-guarantees {
        max-width: 1120px;
        margin: 0 auto;
        padding: 0 22px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;

        .guarantee-card {
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 16px;

            .product-details-image {
                width: 120px;
                height: 96px;
                object-fit: contain;
                display: block;
                margin: 0 auto;
            }

            .product-guarantee-title {
                font-size: 18px;
                line-height: 1.2;
                color: var(--text-primary);
            }

            .product-details-text {
                padding: 0 40px;
                font-size: 12px;
                line-height: 1.45;
                color: var(--text-secondary);
            }
        }
    }
}

.product-experience-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;

    .product-story {
        padding: 144px 0;
        display: flex;
        flex-direction: column;
        gap: 144px;

        .story-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 32px;

            &.reverse {
                .story-image {
                    order: 2;
                }

                .story-copy {
                    order: 1;
                }
            }
        }

        .story-image {
            height: 352px;
            border-radius: 18px;
            background: linear-gradient(140deg, var(--gray-40) 0%, var(--gray-10) 100%);
            border: 1px solid var(--border-default);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            .product-details-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
            }
        }

        .story-copy {
            padding: 0 80px;
            display: flex;
            flex-direction: column;
            gap: 24px;

            .product-story-title {
                font-size: 36px;
                line-height: 52px;
                letter-spacing: -0.02em;
                color: var(--text-primary);
            }

            .product-details-text {
                margin: 0;
                font-size: 16px;
                line-height: 28px;
                color: var(--text-secondary);
            }
        }
    }
}

@media (max-width: 980px) {
    .product-guarantees-band {
        .product-guarantees {
            grid-template-columns: 1fr;
        }
    }

    .product-experience-container {
        .product-story {
            .story-copy {
                .product-story-title {
                    font-size: 32px;
                }
            }
        }
    }
}

@media (max-width: 760px) {
    .product-experience-container {
        .product-story {
            .story-row {
                grid-template-columns: 1fr;
                gap: 18px;
            }

            .story-row.reverse {
                .story-image,
                .story-copy {
                    order: initial;
                }
            }
        }
    }
}
</style>
