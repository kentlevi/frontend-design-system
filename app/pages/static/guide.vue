<template>
	<div class="guide-page">
		<nav class="guide-nav">
			<UiHeading variant="6" weight="bold" class="guide-nav-title">
				MUSTICKER UI
			</UiHeading>

			<input
				v-model.trim="search_query"
				type="search"
				class="guide-nav-search"
				placeholder="Search component..."
			>

			<div
				v-for="group in grouped_guides"
				:key="group.label"
				class="guide-nav-group"
			>
				<span class="guide-nav-group-label">
					{{ group.label }}
					<span class="guide-nav-group-count">{{ group.items.length }}</span>
				</span>

				<button
					v-for="item in group.items"
					:key="item.name"
					type="button"
					class="guide-nav-item"
					:class="{ 'is-active': item.name === active_guide_name }"
					@click="selectGuide(item)"
				>
					{{ item.name }}
				</button>
			</div>

			<p v-if="!grouped_guides.length" class="guide-nav-empty">
				No match for "{{ search_query }}"
			</p>
		</nav>

		<section class="guide-content">
			<header class="guide-content-header">
				<div>
					<UiText size="xsmall" color="var(--text-secondary)">Frontend UI Guide</UiText>
					<UiHeading variant="5" weight="bold">
						{{ active_guide_name || 'Select a component' }}
					</UiHeading>
				</div>
				<UiText size="small" color="var(--text-secondary)">
					{{ filtered_guides.length }} / {{ guides.length }} guide entries
				</UiText>
			</header>

			<div v-if="active_usage_snippet" class="guide-usage">
				<UiHeading variant="6" weight="bold">How to use</UiHeading>
				<pre class="guide-code"><code>{{ active_usage_snippet }}</code></pre>
			</div>

			<component
				:is="active_component"
				v-if="active_component"
			/>

			<div v-else class="guide-landing">
				<UiHeading variant="4" weight="bold">Musticker Frontend UI</UiHeading>
				<UiText color="var(--text-secondary)">
					Internal reference for reusable UI components.
					Select a component from the sidebar to view its documentation.
				</UiText>

				<div class="guide-landing-stats">
					<div class="guide-landing-stat">
						<UiText weight="semi-bold">Total</UiText>
						<UiText size="large" weight="bold">{{ guides.length }}</UiText>
					</div>
					<div
						v-for="group in grouped_guides"
						:key="group.label"
						class="guide-landing-stat"
					>
						<UiText weight="semi-bold">{{ group.label }}</UiText>
						<UiText size="large" weight="bold">{{ group.items.length }}</UiText>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import type { Component } from 'vue';

definePageMeta({
	layout: 'no-layout',
});

type GuideSection = 'basics' | 'typography' | 'actions' | 'form' | 'feedback' | 'layout';

type GuideItem = {
	name: string;
	section: GuideSection;
	component: Component;
};

type GuideGroup = {
	label: string;
	items: GuideItem[];
};

const section_order: GuideSection[] = ['basics', 'typography', 'actions', 'form', 'feedback', 'layout'];

const section_labels: Record<GuideSection, string> = {
	basics: 'Basics',
	typography: 'Typography',
	actions: 'Actions',
	form: 'Form Controls',
	feedback: 'Feedback',
	layout: 'Layout',
};

const section_lookup: Record<string, GuideSection> = {
	GettingStarted: 'basics',
	Conventions: 'basics',
	PageExample: 'basics',
	Heading: 'typography',
	Text: 'typography',
	Button: 'actions',
	Segmented: 'actions',
	Modal: 'actions',
	DeleteConfirmModal: 'actions',
	Input: 'form',
	FileInput: 'form',
	Textarea: 'form',
	Select: 'form',
	Checkbox: 'form',
	Radio: 'form',
	FormField: 'form',
	Badge: 'feedback',
	Toast: 'feedback',
	Tooltip: 'feedback',
	Skeleton: 'feedback',
	LoadingOverlay: 'feedback',
	Icon: 'layout',
	Logo: 'layout',
	SocialIcon: 'layout',
	Flag: 'layout',
	LinearWrapper: 'layout',
};

const modules = import.meta.glob<{
	default: Component;
}>(
	'~/components/features/dev/guide/Guide*.vue',
	{ eager: true },
);

const guides: GuideItem[] = Object.entries(modules).map(
	([path, module]) => {
		const name = path
			.split('/')
			.pop()
			?.replace('.vue', '')
			.replace(/^Guide/, '')
			?? 'Unknown';

		return {
			name,
			section: section_lookup[name] ?? 'layout',
			component: module.default,
		};
	},
).sort((a, b) => {
	const section_diff = section_order.indexOf(a.section) - section_order.indexOf(b.section);
	if (section_diff !== 0) return section_diff;
	return a.name.localeCompare(b.name);
});

const search_query = ref('');
const active_component = shallowRef<Component | null>(null);
const active_guide_name = ref('');
const guide_usage_snippets: Record<string, string> = {
	Badge: `<UiBadge variant="tonal" tone="success">Active</UiBadge>`,
	Button: `<UiButton variant="filled" tone="default" @click="onSubmit">
  Save
</UiButton>`,
	Checkbox: `<UiCheckbox v-model="accepted">
  Accept terms
</UiCheckbox>`,
	DeleteConfirmModal: `<UiDeleteConfirmModal
  :model-value="open"
  title="Delete item"
  description="This action cannot be undone."
  cancel-label="Cancel"
  confirm-label="Delete"
  @cancel="open = false"
  @confirm="handleDelete"
/>`,
	Flag: `<UiFlag code="us" :size="24" />`,
	FormField: `<UiFormField label="Email" required>
  <template #default="{ inputId, describedBy }">
    <UiInput
      :id="inputId"
      v-model="email"
      type="email"
      :aria-describedby="describedBy || undefined"
    />
  </template>
</UiFormField>`,
	Heading: `<UiHeading variant="4" weight="bold">
  Section Title
</UiHeading>`,
	Icon: `<UiIcon name="regular-search" :size="20" />`,
	Input: `<UiInput
  v-model="keyword"
  type="search"
  placeholder="Search..."
/>`,
	FileInput: `<UiFileInput
  :multiple="true"
  :accepted-formats="['png', 'jpg', 'pdf']"
  @change="(files) => {
    console.log(files)
  }"
/>`,
	LinearWrapper: `<UiLinearWrapper :gap="12" align="center">
  <UiBadge>Item A</UiBadge>
  <UiBadge>Item B</UiBadge>
</UiLinearWrapper>`,
	LoadingOverlay: `<UiLoadingOverlay
  :visible="loading"
  label="Loading"
  position="fixed"
/>`,
	Logo: `<UiLogo
  name="musticker"
  variant="full"
  color="colored"
  size="lg"
/>`,
	Modal: `<UiModal v-model="open" title="Edit Profile">
  <UiText>Modal content here.</UiText>
</UiModal>`,
	Radio: `<UiRadio
  v-model="plan"
  name="plan"
  value="pro"
  label="Pro Plan"
/>`,
	Segmented: `<UiSegmented
  v-model="unit"
  :options="[
    { label: 'mm', value: 'mm' },
    { label: 'cm', value: 'cm' }
  ]"
/>`,
	Select: `<UiSelect
  v-model="country"
  :options="countryOptions"
  placeholder="Select country"
/>`,
	Skeleton: `<UiSkeleton height="16px" width="70%" />`,
	SocialIcon: `<UiSocialIcon name="facebook" variant="colored" size="md" />`,
	Text: `<UiText size="small" weight="regular">
  Helper message
</UiText>`,
	Textarea: `<UiTextarea
  v-model="notes"
  :rows="4"
  placeholder="Type your notes..."
/>`,
	Toast: `<UiToast
  :visible="visible"
  tone="success"
  title="Saved"
  message="Changes have been updated."
  @close="visible = false"
/>`,
	Tooltip: `<UiTooltip :open="open" side="top" align="center" tone="neutral">
  <template #trigger>
    <UiButton @click="open = !open">Toggle tooltip</UiButton>
  </template>
  <UiText size="small">Tooltip content</UiText>
</UiTooltip>`,
};
const active_usage_snippet = computed(() => {
	const name = active_guide_name.value;
	if (!name) return '';
	return guide_usage_snippets[name] ?? '';
});

const filtered_guides = computed(() => {
	const keyword = search_query.value.trim().toLowerCase();
	if (!keyword) return guides;
	return guides.filter(item =>
		item.name.toLowerCase().includes(keyword),
	);
});

const grouped_guides = computed<GuideGroup[]>(() => {
	return section_order
		.map((section) => {
			const items = filtered_guides.value.filter(item => item.section === section);
			if (!items.length) return null;

			return {
				label: section_labels[section],
				items,
			};
		})
		.filter((group): group is GuideGroup => group !== null);
});

function selectGuide(item: GuideItem) {
	active_component.value = item.component;
	active_guide_name.value = item.name;
}
</script>

<style lang="scss" scoped>
.guide-page {
	min-height: 100vh;
	background: var(--bg-page, #f8fafc);
	font-family: var(--font-base);
}

.guide-nav {
	position: fixed;
	top: 0;
	left: 0;
	width: 260px;
	height: 100vh;
	overflow-y: auto;
	padding: 20px 16px;
	border-right: 1px solid var(--border-default, #e4e7ec);
	background: var(--contrast-light, #fff);
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.guide-nav-title {
	text-align: center;
	padding-bottom: 12px;
	border-bottom: 1px solid var(--border-default, #e4e7ec);
	letter-spacing: 0.08em;
	color: var(--text-secondary);
}

.guide-nav-search {
	width: 100%;
	height: 36px;
	padding: 0 12px;
	border: 1px solid var(--border-default, #e4e7ec);
	border-radius: 8px;
	font-size: 13px;
	font-family: var(--font-base);
	background: var(--bg-page, #f8fafc);
	color: var(--text-primary);
	outline: none;

	&:focus {
		border-color: var(--brand-primary);
	}
}

.guide-nav-group {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.guide-nav-group-label {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 6px 8px;
	font-size: 11px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--text-muted, #667085);
}

.guide-nav-group-count {
	font-size: 10px;
	padding: 1px 6px;
	border-radius: 999px;
	background: var(--bg-muted, #f2f4f7);
	color: var(--text-secondary);
}

.guide-nav-item {
	display: block;
	width: 100%;
	padding: 7px 10px;
	border: 0;
	border-radius: 6px;
	background: transparent;
	font-size: 13px;
	font-weight: 500;
	font-family: var(--font-base);
	color: var(--text-primary);
	text-align: left;
	cursor: pointer;
	transition: background 120ms ease;

	&:hover {
		background: var(--bg-muted, #f2f4f7);
	}

	&.is-active {
		background: var(--text-primary, #111);
		color: var(--contrast-light, #fff);
	}
}

.guide-nav-empty {
	padding: 8px;
	font-size: 12px;
	color: var(--text-muted);
}

.guide-content {
	margin-left: 260px;
	padding: 28px 36px 80px;
	max-width: 960px;
}

.guide-content-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	gap: 16px;
	padding-bottom: 20px;
	margin-bottom: 28px;
	border-bottom: 1px solid var(--border-default, #e4e7ec);
}

.guide-landing {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 40px 0;
}

.guide-landing-stats {
	display: flex;
	gap: 24px;
	margin-top: 12px;
}

.guide-landing-stat {
	padding: 16px 20px;
	border: 1px solid var(--border-default, #e4e7ec);
	border-radius: 10px;
	background: var(--contrast-light, #fff);
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 100px;
}

.guide-usage {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 16px;
}

.guide-code {
	margin: 0;
	padding: 14px;
	border-radius: 10px;
	border: 1px solid #1f2937;
	background: #0f172a;
	color: #e5e7eb;
	font-size: 12px;
	line-height: 1.45;
	overflow-x: auto;
}

:deep(.guide-section) {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

:deep(.guide-demo) {
	padding: 20px;
	border: 1px solid var(--border-default, #e4e7ec);
	border-radius: 10px;
	background: var(--contrast-light, #fff);
	display: flex;
	flex-direction: column;
	gap: 12px;
}

:deep(.guide-demo-row) {
	display: flex;
	gap: 12px;
	align-items: center;
	flex-wrap: wrap;
}

:deep(.guide-table) {
	width: 100%;
	border-collapse: collapse;
	font-size: 13px;

	th,
	td {
		padding: 10px 12px;
		border: 1px solid var(--border-default, #e4e7ec);
		text-align: left;
		vertical-align: top;
	}

	th {
		background: var(--bg-muted, #f6f8fa);
		font-weight: 600;
		font-size: 12px;
	}

	code {
		padding: 2px 6px;
		border-radius: 4px;
		background: var(--bg-muted, #eef2f6);
		font-size: 12px;
	}
}
</style>
