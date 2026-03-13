<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';

const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();

const items = [
	{
		image: resolveFileUrl('/home/guarantees/best-value-guarantee.png'),
		titleKey: 'quality.title',
		textKey: 'quality.text',
	},
	{
		image: resolveFileUrl('/home/guarantees/fast-air-delivery.png'),
		titleKey: 'shipping.title',
		textKey: 'shipping.text',
	},
	{
		image: resolveFileUrl('/home/guarantees/rush-delivery-truck.png'),
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
					<img :src="item.image" :alt="t(`home.guarantees.${item.titleKey}`)" class="home-guarantees-icon-image">
				</div>
				<div class="home-guarantees-copy">
					<h3 class="home-guarantees-title">
						{{ t(`home.guarantees.${item.titleKey}`) }}
					</h3>
					<p class="home-guarantees-text">
						{{ t(`home.guarantees.${item.textKey}`) }}
					</p>
				</div>
			</article>
		</div>
	</section>
</template>

<style scoped lang="scss">
.home-guarantees {
    margin-bottom: 64px;

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
            gap: 16px;

            .home-guarantees-icon {
                width: 108px;
                height: 108px;

                display: grid;
                place-items: center;

                .home-guarantees-icon-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }
            }

            .home-guarantees-title {

                font-size: var(--type-size-300);
                line-height: var(--type-line-300);
                color: var(--text-primary);
            }

            .home-guarantees-text {

                font-size: var(--type-size-200);
                line-height: var(--type-line-200);
                color: var(--text-secondary);
            }

            .home-guarantees-copy {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
        }
    }
}
</style>