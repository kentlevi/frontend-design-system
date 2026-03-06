<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type LegalSectionGroup = {
	title?: string;
	items: string[];
};

type LegalSectionTable = {
	headers: string[];
	rows: string[][];
	note?: string;
};

type LegalSection = {
	id: string;
	title: string;
	paragraphs?: string[];
	bullets?: string[];
	groups?: LegalSectionGroup[];
	table?: LegalSectionTable;
};

type RawLegalSectionGroup = {
	title?: unknown;
	items?: unknown[];
};

type RawLegalSectionTable = {
	headers?: unknown[];
	rows?: unknown[][];
	note?: unknown;
};

type RawLegalSection = {
	id?: unknown;
	title?: unknown;
	paragraphs?: unknown[];
	bullets?: unknown[];
	groups?: RawLegalSectionGroup[];
	table?: RawLegalSectionTable;
};

const props = defineProps<{
	documentKey: 'terms' | 'privacy';
}>();

const { t, tm, rt } = useI18n();

const activeTopicId = ref('');
const manualActiveTopicId = ref('');
let scrollSpyRafId: number | null = null;

const documentBaseKey = computed(() => `legal.${props.documentKey}`);
const titlePrefix = computed(() => t(`${documentBaseKey.value}.titlePrefix`));
const titleSuffix = computed(() => t(`${documentBaseKey.value}.titleSuffix`));
const hasSplitTitle = computed(
	() =>
		titlePrefix.value !== `${documentBaseKey.value}.titlePrefix` &&
		titleSuffix.value !== `${documentBaseKey.value}.titleSuffix`
);

function resolveMessage(value: unknown) {
	if (typeof value === 'string') return value;
	return rt(value as Parameters<typeof rt>[0]);
}

function toMessageArray(value: unknown) {
	return Array.isArray(value) ? value : [];
}

const sections = computed(
	() =>
		toMessageArray(tm(`${documentBaseKey.value}.sections`) as RawLegalSection[]).map(
			(section, index) => ({
				id:
					typeof section.id === 'string'
						? section.id
						: `${props.documentKey}-section-${index + 1}`,
				title: resolveMessage(section.title),
				paragraphs: (section.paragraphs || []).map(resolveMessage),
				bullets: (section.bullets || []).map(resolveMessage),
				groups: (section.groups || []).map((group) => ({
					title: group.title ? resolveMessage(group.title) : undefined,
					items: (group.items || []).map(resolveMessage),
				})),
				table: section.table
					? {
						headers: (section.table.headers || []).map(resolveMessage),
						rows: (section.table.rows || []).map((row) => row.map(resolveMessage)),
						note: section.table.note ? resolveMessage(section.table.note) : undefined,
					}
					: undefined,
			})
		) as LegalSection[]
);

const topics = computed(() =>
	sections.value.map((section) => ({
		id: section.id,
		title: section.title.replace(/^\d+\.\s*/, ''),
	}))
);

function setInitialActiveTopic() {
	activeTopicId.value = sections.value[0]?.id || '';
}

function clearManualActiveTopic() {
	manualActiveTopicId.value = '';
}

function handleTopicClick(topicId: string) {
	manualActiveTopicId.value = topicId;
	activeTopicId.value = topicId;
}

function syncActiveTopicFromScroll() {
	if (!import.meta.client) return;
	if (manualActiveTopicId.value) {
		activeTopicId.value = manualActiveTopicId.value;
		return;
	}
	const documentHeight = document.documentElement.scrollHeight;
	const viewportBottom = window.scrollY + window.innerHeight;
	const isAtPageBottom = viewportBottom >= documentHeight - 2;
	const lastSection = sections.value.at(-1);
	const lastSectionElement = lastSection
		? document.getElementById(lastSection.id)
		: null;
	const lastSectionTop = lastSectionElement?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
	const lastSectionVisibleAnchor = window.innerHeight * 0.6;
	if (isAtPageBottom && lastSectionElement && lastSectionTop <= lastSectionVisibleAnchor) {
		activeTopicId.value = lastSection.id;
		return;
	}

	const scrollAnchor = 156;
	let nextActiveId = sections.value[0]?.id || '';

	for (const section of sections.value) {
		const element = document.getElementById(section.id);
		if (!element) continue;
		const { top } = element.getBoundingClientRect();
		if (top <= scrollAnchor) {
			nextActiveId = section.id;
		} else {
			break;
		}
	}

	activeTopicId.value = nextActiveId;
}

function queueScrollSpySync() {
	if (!import.meta.client) return;
	if (scrollSpyRafId !== null) return;
	scrollSpyRafId = window.requestAnimationFrame(() => {
		scrollSpyRafId = null;
		syncActiveTopicFromScroll();
	});
}

onMounted(() => {
	setInitialActiveTopic();
	void nextTick(() => {
		syncActiveTopicFromScroll();
		window.addEventListener('scroll', queueScrollSpySync, { passive: true });
		window.addEventListener('resize', queueScrollSpySync);
		window.addEventListener('wheel', clearManualActiveTopic, { passive: true });
		window.addEventListener('touchmove', clearManualActiveTopic, { passive: true });
		window.addEventListener('keydown', clearManualActiveTopic);
	});
});

onBeforeUnmount(() => {
	if (!import.meta.client) return;
	window.removeEventListener('scroll', queueScrollSpySync);
	window.removeEventListener('resize', queueScrollSpySync);
	window.removeEventListener('wheel', clearManualActiveTopic);
	window.removeEventListener('touchmove', clearManualActiveTopic);
	window.removeEventListener('keydown', clearManualActiveTopic);
	if (scrollSpyRafId !== null) {
		window.cancelAnimationFrame(scrollSpyRafId);
		scrollSpyRafId = null;
	}
});

watch(
	() => `${props.documentKey}:${sections.value.map((section) => section.id).join('|')}`,
	() => {
		setInitialActiveTopic();
		if (!import.meta.client) return;
		void nextTick(() => {
			syncActiveTopicFromScroll();
		});
	}
);
</script>

<template>
	<main class="legal-page" :data-testid="`${documentKey}-page`">
		<section class="legal-hero" :data-testid="`${documentKey}-hero`">
			<div class="legal-hero-shell">
				<div class="legal-hero-copy">
					<div class="legal-heading-group">
						<h1 class="legal-title">
							<template v-if="hasSplitTitle">
								<span class="legal-title-primary">{{ titlePrefix }}</span>
								<span class="legal-title-secondary">{{ titleSuffix }}</span>
							</template>
							<template v-else>
								{{ t(`${documentBaseKey}.title`) }}
							</template>
						</h1>
						<p class="legal-updated">
							{{ t(`${documentBaseKey}.lastUpdatedLabel`) }}
							<span class="legal-updated-date">{{ t(`${documentBaseKey}.lastUpdatedDate`) }}</span>
						</p>
					</div>
					<div class="legal-introduction">
						<p
							v-for="(paragraph, index) in toMessageArray(tm(`${documentBaseKey}.introduction`))"
							:key="`${documentKey}-intro-${index}`"
							class="legal-introduction-copy"
						>
							{{ resolveMessage(paragraph) }}
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="legal-content" :data-testid="`${documentKey}-content`">
			<div class="legal-content-shell">
				<aside class="legal-sidebar" :data-testid="`${documentKey}-sidebar`">
					<div class="legal-sidebar-card">
						<p class="legal-sidebar-title">{{ t(`${documentBaseKey}.topicsLabel`) }}</p>
						<nav class="legal-sidebar-nav" :aria-label="t(`${documentBaseKey}.topicsLabel`)">
							<a
								v-for="topic in topics"
								:key="topic.id"
								:href="`#${topic.id}`"
								class="legal-sidebar-link"
								:class="{ 'is-active': activeTopicId === topic.id }"
								@click="handleTopicClick(topic.id)"
							>
								{{ topic.title }}
							</a>
						</nav>
					</div>
				</aside>

				<div class="legal-sections" :data-testid="`${documentKey}-sections`">
					<section
						v-for="section in sections"
						:id="section.id"
						:key="section.id"
						class="legal-section"
					>
						<h2 class="legal-section-title">{{ section.title }}</h2>

						<div v-if="section.paragraphs?.length" class="legal-section-paragraphs">
							<p
								v-for="(paragraph, paragraphIndex) in section.paragraphs"
								:key="`${section.id}-paragraph-${paragraphIndex}`"
								class="legal-section-paragraph"
							>
								{{ paragraph }}
							</p>
						</div>

						<ul v-if="section.bullets?.length" class="legal-section-list">
							<li
								v-for="(bullet, bulletIndex) in section.bullets"
								:key="`${section.id}-bullet-${bulletIndex}`"
								class="legal-section-list-item"
							>
								{{ bullet }}
							</li>
						</ul>

						<div v-if="section.groups?.length" class="legal-section-groups">
							<div
								v-for="(group, groupIndex) in section.groups"
								:key="`${section.id}-group-${groupIndex}`"
								class="legal-section-group"
							>
								<p v-if="group.title" class="legal-section-group-title">
									{{ group.title }}
								</p>
								<ul v-if="group.items.length" class="legal-section-list legal-section-list--grouped">
									<li
										v-for="(item, itemIndex) in group.items"
										:key="`${section.id}-group-${groupIndex}-item-${itemIndex}`"
										class="legal-section-list-item"
									>
										{{ item }}
									</li>
								</ul>
							</div>
						</div>

						<div v-if="section.table" class="legal-section-table-wrap">
							<div class="legal-section-table-card">
								<table class="legal-section-table">
									<thead>
										<tr>
											<th
												v-for="(header, headerIndex) in section.table.headers"
												:key="`${section.id}-table-header-${headerIndex}`"
												class="legal-section-table-head"
												scope="col"
											>
												{{ header }}
											</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="(row, rowIndex) in section.table.rows"
											:key="`${section.id}-table-row-${rowIndex}`"
										>
											<td
												v-for="(value, valueIndex) in row"
												:key="`${section.id}-table-row-${rowIndex}-value-${valueIndex}`"
												class="legal-section-table-cell"
											>
												{{ value }}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<p v-if="section.table.note" class="legal-section-table-note">
								{{ section.table.note }}
							</p>
						</div>
					</section>
				</div>
			</div>
		</section>
	</main>
</template>

<style scoped lang="scss">
.legal-page {
	background: var(--bg-page);
}

.legal-hero {
	background: var(--brand-primary);
	padding: 72px 24px 56px;
}

.legal-hero-shell,
.legal-content-shell {
	width: min(1200px, 100%);
	margin: 0 auto;
}

.legal-heading-group {
	display: grid;
	gap: 12px;
}

.legal-title {
	margin: 0;
	font-size: var(--type-size-650);
	line-height: var(--type-line-650);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.legal-title-primary,
.legal-title-secondary {
	display: inline;
}

.legal-title-secondary {
	font-weight: var(--font-weight-regular);
}

.legal-updated {
	font-size: var(--type-size-300);
	line-height: var(--type-line-300);
	color: var(--text-primary);
	font-weight: var(--font-weight-bold);
}

.legal-updated-date {
	color: var(--text-primary);
	font-weight: var(--font-weight-regular);
}

.legal-introduction {
	display: grid;
	margin-top: 28px;
}

.legal-introduction-copy {
	margin: 0;
	font-size: var(--type-size-300);
	line-height: var(--type-line-300);
	color: var(--text-primary);
}

.legal-content {
	padding: 80px 24px 96px;
}

.legal-content-shell {
	display: grid;
	grid-template-columns: 282px minmax(0, 1fr);
	gap: 40px;
	align-items: start;
}

.legal-sidebar {
	position: sticky;
	top: 48px;
}

.legal-sidebar-card {
	border: 1px solid var(--border-default);
	border-radius: 12px;
	background: var(--contrast-light);
	overflow: hidden;
}

.legal-sidebar-title {
	margin: 0;
	padding: 16px 32px;
	font-size: var(--type-size-300);
	line-height: var(--type-line-300);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

.legal-sidebar-nav {
	display: flex;
	flex-direction: column;
}

.legal-sidebar-link {
	padding: 8px 32px;
	color: var(--text-secondary);
	text-decoration: none;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	transition: background-color 0.16s ease, color 0.16s ease;
	overflow-wrap: anywhere;
}

.legal-sidebar-link.is-active {
	background: var(--gray-20);
	color: var(--text-primary);
	font-weight: var(--font-weight-semibold);
}

.legal-sidebar-link:hover,
.legal-sidebar-link:focus-visible {
	background: var(--gray-20);
	color: var(--text-primary);
}

.legal-sections {
	display: grid;
}

.legal-section {
	padding: 0 0 32px;
	border-bottom: 1px solid var(--border-default);
}

.legal-section + .legal-section {
	padding-top: 32px;
}

.legal-section-title {
	margin: 0;
	font-size: var(--type-size-300);
	line-height: var(--type-line-300);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.legal-section-paragraphs {
	display: grid;
	gap: 12px;
	margin-top: 16px;
}

.legal-section-paragraph {
	margin: 0;
	font-size: var(--type-size-100);
	line-height: var(--type-line-200);
	color: var(--text-primary);
}

.legal-section-list {
	margin: 16px 0 0;
	padding-left: 18px;
	display: grid;
	gap: 8px;
}

.legal-section-list--grouped {
	margin-top: 8px;
}

.legal-section-list-item {
	font-size: var(--type-size-100);
	line-height: var(--type-line-200);
	color: var(--text-primary);
}

.legal-section-groups {
	display: grid;
	gap: 16px;
	margin-top: 16px;
}

.legal-section-group-title {
	margin: 0;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

.legal-section-table-wrap {
	display: grid;
	gap: 12px;
	margin-top: 20px;
}

.legal-section-table-card {
	border: 1px solid var(--border-default);
	border-radius: 10px;
	overflow: hidden;
	background: var(--contrast-light);
}

.legal-section-table {
	width: 100%;
	border-collapse: collapse;
}

.legal-section-table-head {
	padding: 14px 22px;
	background: var(--gray-20);
	border-right: 1px solid var(--border-default);
	text-align: left;
	font-size: var(--type-size-200);
	line-height: var(--type-line-200);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

.legal-section-table-head:last-child {
	border-right: 0;
}

.legal-section-table-cell {
	padding: 14px 22px;
	border-top: 1px solid var(--border-default);
	border-right: 1px solid var(--border-default);
	font-size: var(--type-size-200);
	line-height: var(--type-line-200);
	color: var(--text-primary);
	vertical-align: top;
}

.legal-section-table-cell:last-child {
	border-right: 0;
}

.legal-section-table-note {
	margin: 0;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

@media (max-width: 980px) {
	.legal-content-shell {
		grid-template-columns: 1fr;
		gap: 28px;
	}

	.legal-sidebar {
		position: static;
	}

	.legal-sidebar-nav {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}
}

@media (max-width: 760px) {
	.legal-hero {
		padding: 48px 16px 32px;
	}

	.legal-content {
		padding: 24px 16px 56px;
	}

	.legal-title {
		font-size: var(--type-size-500);
		line-height: var(--type-line-500);
	}

	.legal-sidebar-nav {
		grid-template-columns: 1fr;
	}

	.legal-section-table-head,
	.legal-section-table-cell {
		padding: 12px 14px;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}
}
</style>