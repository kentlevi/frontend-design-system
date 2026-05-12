<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
</script>

<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuText</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Typography text component with size, weight, and color options.
		</MuText>

		<MuHeading variant="6" weight="bold">Sizes</MuHeading>
		<div class="guide-demo">
			<MuText size="xlarge">xlarge text</MuText>
			<MuText size="large">large text</MuText>
			<MuText size="medium">medium text</MuText>
			<MuText size="small">small text</MuText>
			<MuText size="xsmall">xsmall text</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Weights</MuHeading>
		<div class="guide-demo">
			<MuText weight="light">Light text</MuText>
			<MuText weight="regular">Regular text</MuText>
			<MuText weight="semi-bold">Semi-bold text</MuText>
			<MuText weight="bold">Bold text</MuText>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>