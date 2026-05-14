<script setup lang="ts">
import { useAccountGallery } from '~/composables/account/gallery/useAccountGallery';

const { items } = useAccountGallery();
</script>

<template>
	<div class="account-gallery-grid" data-testid="account-gallery-grid">
		<FeaturesAccountGalleryContentCard
			v-for="item in items"
			:key="item.name"
			:item="item"
		/>
	</div>
</template>

<style scoped lang="scss">
.account-gallery-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 14px;
}

@media (max-width: 980px) {
	.account-gallery-grid {
		grid-template-columns: 1fr;
	}
}
</style>