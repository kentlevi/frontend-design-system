<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCountry } from '@/composables/app/country/useCountry';
import { homeProductTypes } from '~/data/products/homeTypes';

const { t: translate } = useI18n();
const { withCountry } = useCountry();
</script>

<template>
	<section class="home-types" data-testid="home-product-types-section">
		<div class="home-types-container">
			<NuxtLink
				v-for="item in homeProductTypes"
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
					{{ translate(`home.productTypes.${item.key}`) }}
				</p>
			</NuxtLink>
		</div>
	</section>
</template>

<style scoped lang="scss">
.home-types {
    padding: 44px 0;

    .home-types-container {
        display: flex;
        justify-content: center;
        gap: 24px;

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
                    padding: 8px 22px;
                    width: auto;
                    height: auto;
                    display: block;
                    object-fit: contain;
                    transform-origin: center;
                    transition: transform 0.24s ease;
                }
            }

            .home-types-label {
                font-size: var(--type-size-200);
                font-weight: var(--font-weight-medium);
                line-height: var(--type-line-200);
                text-align: center;
                color: var(--black-base);
            }
        }
    }
}
</style>