<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';

const { t: translate } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();

const guarantee_items = [
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
				v-for="item in guarantee_items"
				:key="item.titleKey"
				class="home-guarantees-item"
				:data-testid="`home-guarantee-${item.titleKey.replace('.title', '')}`"
			>
				<div class="home-guarantees-icon">
					<img :src="item.image" :alt="translate(`home.guarantees.${item.titleKey}`)" class="home-guarantees-icon-image">
				</div>
				<div class="home-guarantees-copy">
					<h3 class="home-guarantees-title">
						{{ translate(`home.guarantees.${item.titleKey}`) }}
					</h3>
					<p class="home-guarantees-text">
						{{ translate(`home.guarantees.${item.textKey}`) }}
					</p>
				</div>
			</article>
		</div>
	</section>
</template>

<style scoped lang="scss">
.home-guarantees {

    .home-guarantees-container {
        display: flex;
        justify-content: center;
        gap: 78px;
        padding: 64px 0;

        .home-guarantees-item {
            min-width: 296px;
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
                white-space: pre-line;
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