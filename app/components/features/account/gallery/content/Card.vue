<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';

interface GalleryItem {
	name: string;
	size: string;
	tag: string;
}

defineProps<{
	item: GalleryItem;
}>();

const { t } = useI18n();
</script>

<template>
	<MuCard
		padding="none"
		class="account-gallery-card"
		:data-testid="`account-gallery-item-${item.name}`"
	>
		<div class="account-gallery-preview" />
		<h3 class="account-gallery-name">{{ item.name }}</h3>
		<p class="account-gallery-size">
			{{ t('account.gallery.sizeLabel') }} {{ item.size }} {{ t('account.gallery.sizeUnit') }}
		</p>
		<span class="account-gallery-tag">{{ t(`account.gallery.tags.${item.tag}`) }}</span>
	</MuCard>
</template>

<style scoped lang="scss">
.account-gallery-card {
	padding: 14px;

	.account-gallery-preview {
		aspect-ratio: 16 / 9;
		border-radius: 8px;
		background: linear-gradient(135deg, var(--surface-subtle), var(--border-default));
		margin-bottom: 12px;
	}

	.account-gallery-name {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
	}

	.account-gallery-size {
		margin: 6px 0 0;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}

	.account-gallery-tag {
		margin-top: 10px;
		height: 24px;
		border-radius: 999px;
		padding: 0 10px;
		display: inline-flex;
		align-items: center;
		background: color-mix(in srgb, var(--brand-primary) 16%, var(--contrast-light));
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-bold);
	}
}
</style>
