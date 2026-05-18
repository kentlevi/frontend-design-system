<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuSwitch from '~/components/base/MuSwitch.vue';
import MuText from '~/components/base/MuText.vue';
import { useArtworkDetailModal } from '~/composables/features/account/orders/useArtworkDetailModal';

const { close_modal, is_dark_background } = useArtworkDetailModal();
</script>

<template>
	<header class="artwork-detail-header">
		<MuLinearWrapper align="center" justify="space-between" width="100%" class="artwork-detail-header__row">
			<MuLinearWrapper align="center" class="artwork-detail-header__slot">
				<UiButton variant="outline" tone="neutral" size="sm" @click="close_modal">
					Close
				</UiButton>
			</MuLinearWrapper>

			<MuLinearWrapper align="center" justify="center" class="artwork-detail-header__title">
				<MuHeading variant="6" weight="bold">Item 001</MuHeading>
			</MuLinearWrapper>

			<MuLinearWrapper align="center" justify="flex-end" class="artwork-detail-header__slot artwork-detail-header__slot--end">
				<MuSwitch v-model="is_dark_background">
					<MuText size="small" weight="medium">Dark Background</MuText>
				</MuSwitch>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</header>
</template>

<style scoped lang="scss">
.artwork-detail-header {
	padding: 16px 24px;
	border-bottom: 1px solid var(--border-default);
	background: var(--bg-surface);

	&__slot {
		min-width: 200px;
	}

	&__title {
		flex: 1;
	}
}
</style>