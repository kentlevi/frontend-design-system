<script setup lang="ts">
import { guideDocs } from '@/data/guide/docs';
import { guides } from '@/data/guide/guides';

const localePath = useLocalePath();
const route = useRoute();

const GUIDE_STANDARDS_VERSION = 'v2';
const GUIDE_STANDARDS_COOKIE = `guide_standards_read_${GUIDE_STANDARDS_VERSION}`;
const standardsCookie = useCookie<string | null>(GUIDE_STANDARDS_COOKIE, {
	path: '/',
	sameSite: 'lax',
	maxAge: 60 * 60 * 24 * 365,
});

const standardsDoc = guideDocs['/guide/standards'];
const standardsGuide = guides.find((item) => item.path === '/guide/standards') ?? null;

const continueTarget = computed(() => {
	const redirect = route.query.redirect;
	const value = Array.isArray(redirect) ? redirect[0] : redirect;
	if (typeof value === 'string' && value.includes('/guide')) return value;
	return localePath('/guide');
});

const relatedGuides = computed(() => {
	const relatedPaths = standardsGuide?.related ?? [];
	return relatedPaths
		.map((path) => guides.find((item) => item.path === path))
		.filter((item): item is (typeof guides)[number] => Boolean(item));
});

const standardsMetadataSnippet = computed(() =>
`{
	path: '/guide/standards',
	status: '${standardsGuide?.status ?? 'stable'}',
	tags: ${JSON.stringify(standardsGuide?.tags ?? [])}
}`
);

function confirmStandardsRead() {
	standardsCookie.value = '1';
	navigateTo(continueTarget.value);
}

function guideStatusLabel(status?: 'draft' | 'stable' | 'deprecated') {
	if (!status) return 'Stable';
	if (status === 'draft') return 'Draft';
	if (status === 'deprecated') return 'Deprecated';
	return 'Stable';
}
</script>

<template>
	<section class="guide-standards-doc">
		<header class="guide-docs-header">
			<h1 class="guide-docs-title">Documentation</h1>
			<p class="guide-docs-summary">{{ standardsDoc.summary }}</p>
			<p class="guide-docs-meta">
				Status:
				<span class="guide-docs-status-chip">
					{{ guideStatusLabel(standardsGuide?.status) }}
				</span>
			</p>
			<p v-if="standardsDoc.lastUpdatedAt" class="guide-docs-meta">
				Updated: {{ standardsDoc.lastUpdatedAt }}
			</p>
		</header>

		<section
			v-for="section in standardsDoc.sections"
			:key="section.title"
			class="guide-docs-section"
		>
			<h2 class="guide-docs-section-title">{{ section.title }}</h2>
			<ul class="guide-docs-list">
				<li v-for="point in section.points" :key="`${section.title}-${point}`" class="guide-docs-list-item">
					{{ point }}
				</li>
			</ul>
		</section>

		<section v-if="standardsDoc.doDont" class="guide-docs-section guide-docs-section-dual">
			<article class="guide-docs-card guide-docs-card-do">
				<h2 class="guide-docs-section-title">Do</h2>
				<ul class="guide-docs-list">
					<li v-for="item in standardsDoc.doDont.do" :key="`do-${item}`" class="guide-docs-list-item">
						{{ item }}
					</li>
				</ul>
			</article>
			<article class="guide-docs-card guide-docs-card-dont">
				<h2 class="guide-docs-section-title">Don't</h2>
				<ul class="guide-docs-list">
					<li v-for="item in standardsDoc.doDont.dont" :key="`dont-${item}`" class="guide-docs-list-item">
						{{ item }}
					</li>
				</ul>
			</article>
		</section>

		<section v-if="standardsDoc.accessibilityChecklist?.length" class="guide-docs-section">
			<h2 class="guide-docs-section-title">Accessibility Checklist</h2>
			<ul class="guide-docs-list guide-docs-checklist">
				<li
					v-for="item in standardsDoc.accessibilityChecklist"
					:key="`a11y-${item}`"
					class="guide-docs-list-item"
				>
					{{ item }}
				</li>
			</ul>
		</section>

		<section v-if="standardsDoc.qaChecklist?.length" class="guide-docs-section">
			<h2 class="guide-docs-section-title">QA Checklist</h2>
			<ul class="guide-docs-list guide-docs-checklist">
				<li
					v-for="item in standardsDoc.qaChecklist"
					:key="`qa-${item}`"
					class="guide-docs-list-item"
				>
					{{ item }}
				</li>
			</ul>
		</section>

		<section v-if="standardsDoc.contentGuidelines?.length" class="guide-docs-section">
			<h2 class="guide-docs-section-title">Content Guidelines</h2>
			<ul class="guide-docs-list">
				<li
					v-for="item in standardsDoc.contentGuidelines"
					:key="`content-${item}`"
					class="guide-docs-list-item"
				>
					{{ item }}
				</li>
			</ul>
		</section>

		<section class="guide-docs-section">
			<h2 class="guide-docs-section-title">Copyable Snippets</h2>
			<h3 class="guide-docs-example-title">Standards Metadata</h3>
			<pre class="guide-docs-code-block"><code>{{ standardsMetadataSnippet }}</code></pre>
		</section>

		<section v-if="standardsDoc.changelog?.length" class="guide-docs-section">
			<h2 class="guide-docs-section-title">Changelog</h2>
			<article
				v-for="entry in standardsDoc.changelog"
				:key="`${entry.date}-${entry.version ?? 'entry'}`"
				class="guide-docs-changelog-item"
			>
				<p class="guide-docs-changelog-date">{{ entry.date }}</p>
				<p v-if="entry.version" class="guide-docs-meta">Version: {{ entry.version }}</p>
				<ul class="guide-docs-list">
					<li v-for="change in entry.changes" :key="`${entry.date}-${change}`" class="guide-docs-list-item">
						{{ change }}
					</li>
				</ul>
				<div v-if="entry.diffLinks?.length" class="guide-docs-related-links">
					<a
						v-for="link in entry.diffLinks"
						:key="`${entry.date}-${link.path}`"
						href="#"
						class="guide-docs-related-link"
						@click.prevent
					>
						<span>{{ link.label }}</span>
						<span>{{ link.path }}</span>
					</a>
				</div>
			</article>
		</section>

		<section class="guide-docs-section">
			<h2 class="guide-docs-section-title">Related Guides</h2>
			<div class="guide-docs-related-links">
				<NuxtLink
					v-for="item in relatedGuides"
					:key="item.path"
					:to="localePath(item.path)"
					class="guide-docs-related-link"
				>
					<span>{{ item.title }}</span>
					<span class="guide-docs-status-chip">{{ guideStatusLabel(item.status) }}</span>
				</NuxtLink>
			</div>
		</section>

		<section class="guide-section">
			<div class="guide-standards-actions">
				<UiButton variant="filled" tone="neutral" size="md" @click="confirmStandardsRead">
					I have read the standards
				</UiButton>
			</div>
		</section>
	</section>
</template>

<style scoped lang="scss">
.guide-standards-doc {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px 6px 12px;
	display: grid;
	gap: 12px;
}

.guide-docs-header {
	border: 1px solid var(--border-default);
	border-radius: 12px;
	padding: 16px;
	background: var(--contrast-light);
}

.guide-docs-title {
	margin: 0 0 8px;
	font-size: 34px;
	line-height: 42px;
	color: var(--text-primary);
}

.guide-docs-summary {
	margin: 0;
	font-size: 14px;
	line-height: 22px;
	color: var(--text-secondary);
}

.guide-docs-meta {
	margin: 8px 0 0;
	color: var(--text-muted);
	font-size: 12px;
	line-height: 18px;
}

.guide-docs-status-chip {
	display: inline-flex;
	align-items: center;
	border-radius: 999px;
	padding: 2px 8px;
	font-size: 11px;
	line-height: 16px;
	color: var(--text-primary);
	background: color-mix(in srgb, #16a34a 18%, var(--contrast-light));
}

.guide-docs-section {
	border: 1px solid var(--border-default);
	border-radius: 10px;
	padding: 14px 16px;
	background: var(--contrast-light);
}

.guide-docs-section-title {
	margin: 0 0 8px;
	font-size: 20px;
	line-height: 28px;
	color: var(--text-primary);
}

.guide-docs-list {
	margin: 0;
	padding-left: 18px;
}

.guide-docs-list-item {
	color: var(--text-secondary);
	font-size: 14px;
	line-height: 24px;
}

.guide-docs-section-dual {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 10px;
}

.guide-docs-card {
	border: 1px solid var(--border-default);
	border-radius: 10px;
	padding: 10px;
}

.guide-docs-card-do {
	background: color-mix(in srgb, #16a34a 9%, var(--contrast-light));
}

.guide-docs-card-dont {
	background: color-mix(in srgb, #dc2626 8%, var(--contrast-light));
}

.guide-docs-checklist {
	list-style: none;
	padding-left: 0;
}

.guide-docs-checklist .guide-docs-list-item {
	position: relative;
	padding-left: 18px;
}

.guide-docs-checklist .guide-docs-list-item::before {
	content: '•';
	position: absolute;
	left: 0;
	top: 0;
	color: var(--text-primary);
}

.guide-docs-example-title {
	margin: 0 0 8px;
	font-size: 14px;
	line-height: 22px;
	color: var(--text-primary);
}

.guide-docs-code-block {
	margin: 0;
	padding: 12px;
	border-radius: 8px;
	border: 1px solid var(--border-default);
	background: #0f172a;
	color: #e2e8f0;
	font-size: 12px;
	line-height: 18px;
	overflow-x: auto;
}

.guide-docs-changelog-item + .guide-docs-changelog-item {
	margin-top: 14px;
	padding-top: 14px;
	border-top: 1px solid var(--border-subtle);
}

.guide-docs-changelog-date {
	margin: 0 0 8px;
	color: var(--text-primary);
	font-size: 13px;
	line-height: 20px;
	font-weight: 600;
}

.guide-docs-related-links {
	display: grid;
	gap: 8px;
}

.guide-docs-related-link {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	border: 1px solid var(--border-default);
	border-radius: 10px;
	padding: 10px 12px;
	text-decoration: none;
	color: var(--text-primary);
	background: var(--contrast-light);
}

.guide-standards-actions {
	display: flex;
	justify-content: flex-start;
}

@media (max-width: 860px) {
	.guide-docs-section-dual {
		grid-template-columns: 1fr;
	}

	.guide-docs-title {
		font-size: 30px;
		line-height: 38px;
	}
}
</style>
