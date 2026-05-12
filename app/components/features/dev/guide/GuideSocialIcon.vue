<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiSocialIcon</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Social media icon component with color variants.
		</MuText>

		<div
			v-for="variant in variants"
			:key="variant"
		>
			<MuHeading variant="6" weight="bold">{{ variant }}</MuHeading>
			<div class="guide-demo" :class="{ 'guide-demo-dark': variant === 'white' }">
				<div class="guide-demo-row">
					<UiSocialIcon
						v-for="icon in icons"
						:key="`${variant}-${icon}`"
						:name="icon"
						:variant="variant"
						size="md"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const icons = ['facebook', 'instagram', 'tiktok', 'x', 'youtube'] as const;
const variants = ['colored', 'black', 'white'] as const;
</script>

<style scoped lang="scss">
.guide-demo-dark {
	background: #1f2937;
}
</style>
