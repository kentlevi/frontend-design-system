<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuLink from '~/components/base/MuLink.vue';
import MuText from '~/components/base/MuText.vue';
import MuThumbnail from '~/components/core/MuThumbnail.vue';
import UiBadge from '~/components/ui/Badge.vue';
</script>

<template>
	<MuLinearWrapper class="activity-log-entry" :gap="12" align="flex-start">
		<MuThumbnail
			:size="32"
			shape="circle"
			name="Joy Love"
			alt="User Avatar"
		/>

		<MuLinearWrapper direction="column" :gap="12" class="body">
			<MuLinearWrapper direction="column">
				<MuLinearWrapper align="center" justify="space-between" :gap="8" width="100%">
					<MuLinearWrapper align="center" :gap="16">
						<MuText size="large" weight="bold">Joy Love</MuText>
						<MuText color="abyss-40">11/20/2024 at 1:43pm</MuText>
					</MuLinearWrapper>
					<UiBadge variant="outline" badge-class="activity-log-entry__badge">
						Submitted Artwork
					</UiBadge>
				</MuLinearWrapper>

				<MuText color="text-secondary">
					Please make sure the colors and size is exactly perfect.
				</MuText>
			</MuLinearWrapper>

			<MuLinearWrapper direction="column" :gap="12">
				<MuLinearWrapper justify="space-between" align="center">
					<MuLinearWrapper :gap="12">
						<MuThumbnail
							:size="56"
							shape="square"
							src="https://static.musticker.com/dev/store-front/illustrations/products/stickers/die-cut.svg"
							alt="Artwork Thumbnail"
						/>
						<MuLinearWrapper direction="column" :gap="4">
							<MuLink weight="bold" color="text-primary">Proof #1</MuLink>
							<MuText weight="bold">yellow-bear.png</MuText>
							<MuText color="text-secondary">Die Cut Stickers</MuText>
							<MuText color="text-secondary">30×30mm | 1,000개</MuText>
						</MuLinearWrapper>
					</MuLinearWrapper>
					<UiButton tone="neutral" icon="regular-check" :icon-size="24">
						<MuText>Approve Proof #1</MuText>
					</UiButton>
				</MuLinearWrapper>
				<MuCard variant="primary">
					<MuText weight="bold">
						Proof Note:
					</MuText>
					<MuText>
						Please be advised that there are colours. that is prone to dark printing, and some parts may blend.

						Due to the characteristics of the Bumper material (PVC), we advise our clients to keep the stickers on the
						packaging if they do not intend to use it right away which could help keep the stickers stay in shape.

						In spite of the most modem printing machines, a colour difference of 5-10% and a movement of 1-2mm on
						the actual product should be acceptable due to mechanical tolerances.
					</MuText>
				</MuCard>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.activity-log-entry {
	.body {
		flex: 1;
		min-width: 0;
	}
}
</style>
