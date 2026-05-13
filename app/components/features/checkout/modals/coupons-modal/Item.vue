<template>
	<MuCard class="coupon-item" :variant="selected ? 'subtle' : 'default'">
		<MuLinearWrapper justify="space-between">
			<MuLinearWrapper direction="column" :gap="8">
				<MuLinearWrapper direction="column">
					<UiRadio
						v-model="coupon"
						name="coupon"
						value="stick20"
						class="coupon_radio"
					>
						<MuText color="abyss-40" weight="semi-bold">Get 15% OFF all stickers.</MuText>
					</UiRadio>
					<MuHeading variant="6" weight="bold">STICK20</MuHeading>
				</MuLinearWrapper>
				<MuText color="abyss-40">Get 20% OFF all stickers. No minimum spend. One use per customer.</MuText>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" justify="space-between" align="center">
				<MuText color="abyss-40" weight="semi-bold">Expiration: 05/30/2026</MuText>
				<UiBadge color="success" size="md">Single Use</UiBadge>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuCard>
</template>

<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';

const selected = ref(true);
const coupon = ref('stick20');
</script>

<style lang="scss" scoped>
.coupon-card { position: relative; }
.coupon_radio { pointer-events: none; }

</style>