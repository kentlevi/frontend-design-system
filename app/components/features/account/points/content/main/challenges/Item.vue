<script setup lang="ts">
</script>

<template>
	<article class="card" data-state="active">
		<div class="frame">
			<img
				src="/icons/custom/account/points/challenges/active/first-order-victory.svg"
				alt="Challenge"
				class="image"
			>
		</div>
	</article>
</template>

<style scoped lang="scss">
.card {
	display: grid;
	place-items: center;
	min-height: 126px;
	flex: 0 0 auto;

	.frame {
		width: 88px;
		height: 116px;
		display: grid;
		place-items: center;
	}

	.image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
		display: block;
	}
}
</style>
