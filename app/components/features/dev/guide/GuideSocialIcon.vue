<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiSocialIcon</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Social-media glyph image resolved from <code>/social/{variant}/{name}.svg</code>. Renders as an <code>&lt;a&gt;</code> when <code>href</code> is passed (with <code>target="_blank"</code> + <code>rel="noopener noreferrer"</code>), otherwise as a <code>&lt;span&gt;</code>.
		</MuText>

		<MuHeading variant="6" weight="bold">Variants</MuHeading>
		<div
			v-for="variant in variants"
			:key="variant"
			class="guide-variant"
		>
			<MuText size="small" color="var(--text-secondary)">variant: <code>{{ variant }}</code></MuText>
			<div class="guide-demo" :class="{ 'guide-dark': variant === 'white' }">
				<div class="guide-row">
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

		<MuHeading variant="6" weight="bold">Sizes</MuHeading>
		<div class="guide-demo">
			<div class="guide-row">
				<UiSocialIcon name="instagram" size="sm" />
				<UiSocialIcon name="instagram" size="md" />
				<UiSocialIcon name="instagram" size="lg" />
				<UiSocialIcon name="instagram" :size="72" />
			</div>
		</div>

		<MuHeading variant="6" weight="bold">As a link</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Passing <code>href</code> upgrades the root from <code>&lt;span&gt;</code> to <code>&lt;a&gt;</code> with safe defaults for opening in a new tab.
		</MuText>
		<div class="guide-demo">
			<div class="guide-row">
				<UiSocialIcon name="facebook" href="https://facebook.com" />
				<UiSocialIcon name="instagram" href="https://instagram.com" />
				<UiSocialIcon name="tiktok" href="https://tiktok.com" />
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>name</td><td><code>string</code></td><td>Required</td><td>Icon filename without extension. Must match an SVG at <code>/social/{variant}/{name}.svg</code>.</td></tr>
				<tr><td>variant</td><td><code>'colored' | 'white' | 'black'</code></td><td><code>'colored'</code></td><td>Color scheme. White for dark backgrounds, black for outline-only.</td></tr>
				<tr><td>size</td><td><code>'sm' | 'md' | 'lg' | number</code></td><td><code>'md'</code></td><td>Pixel size. Token map: <code>sm=24, md=32, lg=48</code>. Pass a number for custom.</td></tr>
				<tr><td>href</td><td><code>string</code></td><td><code>''</code></td><td>When truthy, renders as <code>&lt;a&gt;</code> with <code>target="_blank"</code> + <code>rel="noopener noreferrer"</code>. Otherwise renders as <code>&lt;span&gt;</code>.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots &amp; events</MuHeading>
		<MuText size="small" color="var(--text-secondary)">None — pure image element with optional link wrapper.</MuText>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong><code>name</code> is not typed.</strong> Unlike <code>UiFlag</code>'s <code>FlagCode</code> union, <code>name</code> is a plain <code>string</code>. A typo silently 404s the asset.</li>
			<li><strong>Always opens in a new tab.</strong> The link form hard-codes <code>target="_blank"</code> — there's no in-tab navigation option. If you need same-tab linking, wrap in your own <code>&lt;a&gt;</code> instead of passing <code>href</code>.</li>
			<li><strong>Adding an icon.</strong> Drop an SVG in <code>/social/colored/</code>, <code>/social/white/</code>, and <code>/social/black/</code> with the same filename. The component picks the right one based on <code>variant</code>.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const icons = ['facebook', 'instagram', 'tiktok', 'x', 'youtube'] as const;
const variants = ['colored', 'black', 'white'] as const;
</script>

<style scoped lang="scss">
.guide-variant {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;
}

.guide-row {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 16px;
}

.guide-dark {
	background: #1f2937;
	padding: 16px;
	border-radius: 8px;
}

.guide-notes {
	margin: 0;
	padding-left: 20px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: var(--text-secondary);
	font-size: var(--body-sm);
	line-height: 1.5;
	strong { color: var(--text-primary); }
}

code {
	background: var(--gray-20);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
	font-size: 0.85em;
	color: var(--error);
}
</style>
