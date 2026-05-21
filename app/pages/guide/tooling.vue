<script setup lang="ts">
import { guides } from '@/data/guide/guides';

const localePath = useLocalePath();

const toolingGuide = guides.find((item) => item.path === '/guide/tooling') ?? null;

const tools = [
	{
		name: 'Workbook sync',
		path: 'frontend-documentation/tools/workbook/',
		summary:
			'Diff and apply the team Content Workbook (Google Sheets, exported as .xlsx) against the storefront i18n locale files.',
		runWhen:
			'A content / copy update lands in the workbook and needs to roll out to frontend/i18n/locales/{en,kr}/**.',
		steps: [
			{
				label: 'extract.py',
				detail:
					'Reads the .xlsx and writes one normalized JSON per content sheet (Homepage, Login, Product_Page_*, etc.). Canonicalizes the various column-header dialects (en_v1, en_impl, en_latest, …).',
			},
			{
				label: 'pipeline.py',
				detail:
					'Scans the locale scopes declared in SHEET_SCOPES, matches each workbook row to a real key by its existing EN value, then proposes the workbook value (en_latest first, falling back through en_marketing → en_impl → en_v2 → en_v1). Ambiguous matches become conflicts; placeholders and whitespace-only diffs are filtered out. Writes apply_plan_all.json.',
			},
			{
				label: 'apply.py',
				detail:
					'Writes the proposed values into the locale JSON files, preserving each file’s indent style + trailing newline. Conflicts and known-bad strings are left untouched.',
			},
		],
		readme: 'frontend-documentation/tools/workbook/README.md',
	},
	{
		name: 'Media optimization',
		path: 'frontend-documentation/tools/media/optimize-media.ps1',
		summary:
			'Batch-convert PNG → WebP (libwebp q=82) and re-encode MP4 → MP4 (h264 CRF 26, capped 1080p / 30 fps, audio stripped, +faststart) into a mirrored output tree.',
		runWhen:
			'A raw camera / editor export landed in tmp/ or in the product hero/feature directories and looks oversized (multi-MB MP4, 1080p60 with audio, large PNG).',
		steps: [
			{
				label: 'Inspect first',
				detail:
					'Run ffprobe on a sample. If files are already small (<1 MB, ≤ 720p, ≤ 30 fps, no audio), the source pipeline already optimized them — re-encoding will INCREASE size.',
			},
			{
				label: 'Run',
				detail:
					'.\\optimize-media.ps1 -SrcRoot <raw> -DstRoot <out>. Idempotent; rerunning skips outputs that already exist.',
			},
			{
				label: 'Review the size report',
				detail:
					'The script prints a per-file before/after table sorted by reduction. Only ship outputs that are smaller; discard the rest.',
			},
		],
		readme: 'frontend-documentation/tools/media/README.md',
	},
	{
		name: 'Font subsetting',
		path: 'frontend-documentation/tools/media/font-subset.ps1',
		summary:
			'Split a variable TTF into Latin + Korean WOFF2 subsets so EN-only routes do not pay for Hangul glyphs (and vice versa). Bootstraps its own Python venv with fontTools + brotli.',
		runWhen:
			'A new variable font is being added to the storefront, or an existing one is shipping the full glyph set as a single oversized file.',
		steps: [
			{
				label: 'Run',
				detail:
					'.\\font-subset.ps1 -Source <PretendardVariable.ttf> -OutDir <frontend/public/fonts>. Produces .latin.woff2 and .kr.woff2 next to each other.',
			},
			{
				label: 'Wire in SCSS',
				detail:
					'Replace the single @font-face block with two unicode-range-scoped blocks (the README has the exact snippet). Browsers fetch only the subset that matches rendered text.',
			},
			{
				label: 'Preload',
				detail:
					'In nuxt.config app.head, preload the small Latin subset for everyone. For KR-locale routes, also preload the Korean subset via useHead in the page (gated on route.params.country === "kr").',
			},
		],
		readme: 'frontend-documentation/tools/media/README.md',
	},
];

const result = {
	workbook: '6.4 MB Pretendard TTF → 79 KB Latin + 1.7 MB Korean WOFF2 (EN: 98.8% smaller, KR: 73%).',
	media:
		'Skater hero video: 46.3 MB @ 1080p60 + audio → 8.05 MB @ 1080p30 muted, +faststart (82.6% smaller). 25 already-optimized peer videos were correctly left alone.',
};
</script>

<template>
	<section class="guide-wrapper guide-tooling">
		<header class="guide-header">
			<p class="guide-eyebrow">Tooling</p>
			<h1 class="guide-title">Out-of-band scripts</h1>
			<p class="guide-description">
				Run these manually when their workflow comes up — they are not part of the build.
				All scripts take arguments or environment variables for paths, so they work
				regardless of where you cloned the repos.
			</p>
		</header>

		<section
			v-for="tool in tools"
			:key="tool.name"
			class="tool-card"
		>
			<header class="tool-card-head">
				<h2 class="tool-card-title">{{ tool.name }}</h2>
				<code class="tool-card-path">{{ tool.path }}</code>
			</header>

			<p class="tool-card-summary">{{ tool.summary }}</p>

			<div class="tool-card-runwhen">
				<strong>Run when:</strong> {{ tool.runWhen }}
			</div>

			<ol class="tool-card-steps">
				<li v-for="step in tool.steps" :key="step.label">
					<strong>{{ step.label }}</strong>
					<p>{{ step.detail }}</p>
				</li>
			</ol>

			<p class="tool-card-readme">
				Full reference:
				<code>{{ tool.readme }}</code>
			</p>
		</section>

		<section class="guide-callout">
			<h2 class="guide-callout-title">Reference results from this codebase</h2>
			<ul>
				<li><strong>Font subsetting:</strong> {{ result.workbook }}</li>
				<li><strong>Media optimization:</strong> {{ result.media }}</li>
			</ul>
		</section>

		<nav class="guide-back">
			<NuxtLink :to="localePath('/guide')">← Back to guides</NuxtLink>
		</nav>

		<p v-if="toolingGuide?.reviewDueAt" class="guide-review-due">
			Review due {{ toolingGuide.reviewDueAt }}.
		</p>
	</section>
</template>

<style scoped lang="scss">
.guide-tooling {
	display: grid;
	gap: 32px;
	padding-bottom: 48px;
}

.tool-card {
	border: 1px solid color-mix(in srgb, var(--gray-30) 70%, transparent);
	border-radius: 16px;
	padding: 24px 28px;
	background: var(--bg-surface, #fff);
	display: grid;
	gap: 16px;

	.tool-card-head {
		display: flex;
		align-items: baseline;
		gap: 16px;
		flex-wrap: wrap;
	}

	.tool-card-title {
		font-size: var(--type-size-400);
		line-height: var(--type-line-400);
		font-weight: var(--font-weight-bold);
		margin: 0;
	}

	.tool-card-path {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
		font-size: var(--type-size-100);
		color: var(--text-secondary);
		background: var(--gray-10);
		padding: 2px 8px;
		border-radius: 8px;
	}

	.tool-card-summary {
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
		color: var(--text-primary);
		margin: 0;
	}

	.tool-card-runwhen {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
		background: color-mix(in srgb, var(--gray-10) 70%, transparent);
		padding: 8px 12px;
		border-radius: 10px;
	}

	.tool-card-steps {
		margin: 0;
		padding-left: 20px;
		display: grid;
		gap: 12px;

		li {
			font-size: var(--type-size-100);
			line-height: var(--type-line-150);

			strong {
				font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
				font-size: 0.95em;
			}

			p {
				margin: 4px 0 0 0;
				color: var(--text-secondary);
			}
		}
	}

	.tool-card-readme {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
		margin: 0;

		code {
			font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
		}
	}
}

.guide-callout {
	border-left: 3px solid var(--brand-primary);
	background: color-mix(in srgb, var(--gray-10) 70%, transparent);
	padding: 20px 24px;
	border-radius: 12px;

	.guide-callout-title {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		margin: 0 0 12px 0;
	}

	ul {
		margin: 0;
		padding-left: 18px;
		display: grid;
		gap: 8px;
		font-size: var(--type-size-100);
		line-height: var(--type-line-150);
	}
}

.guide-back {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);

	a {
		color: var(--text-primary);
		text-decoration: none;
		border-bottom: 1px dashed var(--text-secondary);
	}
}

.guide-review-due {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--text-secondary);
}
</style>
