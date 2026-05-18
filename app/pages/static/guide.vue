<template>
	<div class="guide-page">
		<nav class="guide-nav">
			<MuHeading variant="6" weight="bold" class="guide-nav-title">
				MUSTICKER UI
			</MuHeading>

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
					<MuText size="xsmall" color="var(--text-secondary)">Frontend UI Guide</MuText>
					<MuHeading variant="5" weight="bold">
						{{ active_guide_name || 'Select a component' }}
					</MuHeading>
				</div>
				<MuText size="small" color="var(--text-secondary)">
					{{ filtered_guides.length }} / {{ guides.length }} guide entries
				</MuText>
			</header>

			<div v-if="active_usage_snippet" class="guide-usage">
				<MuHeading variant="6" weight="bold">How to use</MuHeading>
				<pre class="guide-code guide-usage__playground-snippet"><code>{{ active_usage_snippet }}</code></pre>
			</div>

			<component
				:is="active_component"
				v-if="active_component"
			/>

			<div v-else class="guide-landing">
				<MuHeading variant="4" weight="bold">Musticker Frontend UI</MuHeading>
				<MuText color="var(--text-secondary)">
					Internal reference for reusable UI components.
					Select a component from the sidebar to view its documentation.
				</MuText>

				<div class="guide-landing-stats">
					<div class="guide-landing-stat">
						<MuText weight="semi-bold">Total</MuText>
						<MuText size="large" weight="bold">{{ guides.length }}</MuText>
					</div>
					<div
						v-for="group in grouped_guides"
						:key="group.label"
						class="guide-landing-stat"
					>
						<MuText weight="semi-bold">{{ group.label }}</MuText>
						<MuText size="large" weight="bold">{{ group.items.length }}</MuText>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import type { Component } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

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
	Card: 'layout',
	Segmented: 'actions',
	Modal: 'actions',
	DeleteConfirmModal: 'actions',
	Input: 'form',
	MuInput: 'form',
	MuSearch: 'form',
	MuCheckbox: 'form',
	FileInput: 'form',
	Textarea: 'form',
	Select: 'form',
	Checkbox: 'form',
	Radio: 'form',
	MuRadio: 'form',
	MuRadioGroup: 'form',
	MuSwitch: 'form',
	MuTabs: 'actions',
	MuTab: 'actions',
	Calendar: 'form',
	FormField: 'form',
	Badge: 'feedback',
	Toast: 'feedback',
	Tooltip: 'feedback',
	MuTooltip: 'feedback',
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
	Card: `<MuCard variant="default" padding="md" radius="md" bordered="default">
  <UiText size="small">Card content</UiText>
</MuCard>`,
	Calendar: `<MuCalendar
  v-model="selectedDate"
  :marker-dates="[new Date()]"
  :disabled-weekdays="[7]"
  :columns="2"
/>`,
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
	FileInput: `<MuFileInput
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
	MuInput: `<MuInput
  id="email"
  name="email"
  v-model="email"
  type="email"
  placeholder="example@mail.com"
>
  <template #label>Email Address</template>
</MuInput>`,
	MuSearch: `<MuSearch
  v-model="keyword"
  placeholder="Search orders..."
  clearable
  class="account-orders-search"
>
  <template #left>
    <UiIcon name="regular-search" :size="24" color="var(--text-primary)" />
  </template>
</MuSearch>`,
	MuCheckbox: `<MuCheckbox v-model="accepted" variant="check">
  Accept terms
</MuCheckbox>

<MuCheckbox v-model="partiallySelected" variant="minus">
  Some items selected
</MuCheckbox>`,
	MuRadio: `<MuRadio
  v-model="contactMethod"
  name="contact-method"
  value="email"
>
  Email
</MuRadio>`,
	MuRadioGroup: `<MuRadioGroup v-model="plan" name="plan">
  <MuRadio value="starter">Starter</MuRadio>
  <MuRadio value="pro">Pro</MuRadio>
  <MuRadio value="enterprise">Enterprise</MuRadio>
</MuRadioGroup>`,
	MuSwitch: `<MuSwitch v-model="is_dark_background">
  <MuText size="small">Dark Background</MuText>
</MuSwitch>

<!-- label-inside variant -->
<MuSwitch v-model="is_dark_background" variant="label-inside">
  <template #inactive-text>OFF</template>
  <template #active-text>ON</template>
</MuSwitch>`,
	MuTabs: `<MuTabs v-model="activeTab">
  <MuTab value="orders">
    <UiIcon name="regular-package-open" :size="24" />
    <span class="m-tab-label">Orders</span>
  </MuTab>
  <MuTab value="coupons">
    <UiIcon name="regular-ticket" :size="24" />
    <span class="m-tab-label">Coupons</span>
  </MuTab>
</MuTabs>`,
	MuTab: `<MuTab
  value="orders"
  to="/kr/account/orders"
>
  <span class="m-tab-label">Orders</span>
</MuTab>

<MuTab
  value="external"
  href="https://musticker.com"
  target="_blank"
  rel="nofollow"
>
  <span class="m-tab-label">External</span>
</MuTab>`,
	Radio: `<UiRadio
  v-model="plan"
  name="plan"
  value="pro"
  label="Pro Plan"
/>`,
	Segmented: `<MuSegmented
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
	MuTooltip: `<!-- mount once at app/layout root -->
<MuTooltip />

<!-- anywhere else -->
<script setup lang="ts">
const { showTooltip, hideTooltip } = useMuTooltip()
<\/script>

<template>
  <button
    @mouseenter="showTooltip($event, 'Helpful hint', 'top')"
    @mouseleave="hideTooltip"
    @focus="showTooltip($event, 'Helpful hint', 'top')"
    @blur="hideTooltip"
  >
    Hover me
  </button>
<\/template>`,
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

const playground_snippet_selector = '[class$="__playground-snippet"]';
const playground_copy_button_class = 'guide-playground-copy-btn';
const bound_snippets = new WeakSet<HTMLElement>();
let playground_observer: MutationObserver | null = null;

function getPlaygroundSnippetText(snippet: HTMLElement): string {
	const clone = snippet.cloneNode(true) as HTMLElement;
	const copied_button = clone.querySelector(`.${playground_copy_button_class}`);
	copied_button?.remove();
	return clone.textContent?.trim() ?? '';
}

async function copyToClipboard(value: string): Promise<boolean> {
	if (!import.meta.client) return false;

	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch (_error) {
		void _error;
	}

	try {
		const textarea = document.createElement('textarea');
		textarea.value = value;
		textarea.setAttribute('readonly', '');
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		const copied = document.execCommand('copy');
		document.body.removeChild(textarea);
		return copied;
	} catch {
		return false;
	}
}

function bindPlaygroundCopyButton(snippet: HTMLElement) {
	if (bound_snippets.has(snippet)) return;
	bound_snippets.add(snippet);

	const button = document.createElement('button');
	button.type = 'button';
	button.className = playground_copy_button_class;
	button.textContent = 'Copy';

	button.addEventListener('click', async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const code = getPlaygroundSnippetText(snippet);
		const copied = await copyToClipboard(code);
		button.textContent = copied ? 'Copied' : 'Failed';
		button.classList.toggle('is-copied', copied);

		window.setTimeout(() => {
			button.textContent = 'Copy';
			button.classList.remove('is-copied');
		}, 1400);
	});

	snippet.appendChild(button);
}

function attachPlaygroundCopyButtons() {
	if (!import.meta.client) return;

	const guide_content = document.querySelector('.guide-content');
	if (!guide_content) return;

	guide_content
		.querySelectorAll<HTMLElement>(playground_snippet_selector)
		.forEach(bindPlaygroundCopyButton);
}

onMounted(() => {
	if (!import.meta.client) return;

	nextTick(() => {
		attachPlaygroundCopyButtons();

		const guide_content = document.querySelector('.guide-content');
		if (!guide_content) return;

		playground_observer = new MutationObserver(() => {
			attachPlaygroundCopyButtons();
		});

		playground_observer.observe(guide_content, {
			childList: true,
			subtree: true,
		});
	});
});

onBeforeUnmount(() => {
	if (playground_observer) {
		playground_observer.disconnect();
		playground_observer = null;
	}
});

function selectGuide(item: GuideItem) {
	active_component.value = item.component;
	active_guide_name.value = item.name;

	if (!import.meta.client) return;
	nextTick(() => {
		attachPlaygroundCopyButtons();
	});
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

:deep([class$='__playground-snippet']) {
	position: relative;
}

:deep(.guide-usage__playground-snippet) {
	padding: 40px 14px 14px;
}

:deep(.guide-playground-copy-btn) {
	position: absolute;
	top: 8px;
	right: 8px;
	z-index: 3;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 6px 10px;
	border-radius: 6px;
	border: 1px solid rgba(255, 255, 255, 0.28);
	background: rgba(255, 255, 255, 0.08);
	color: #f8fafc;
	font-size: 11px;
	font-weight: 600;
	font-family: var(--font-base);
	line-height: 1;
	cursor: pointer;
	transition: background 120ms ease, border-color 120ms ease, color 120ms ease;

	&:hover {
		background: rgba(255, 255, 255, 0.18);
		border-color: rgba(255, 255, 255, 0.42);
	}

	&.is-copied {
		background: #15803d;
		border-color: #15803d;
		color: #ffffff;
	}
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