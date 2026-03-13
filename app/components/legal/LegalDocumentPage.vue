<script setup lang="ts">
import { useLegalDocumentPage } from '~/composables/legal/useLegalDocumentPage';
import {
	getBulletContent,
	parseEmphasisSegments,
	toMessageArray,
} from '~/helpers/legal/legalDocument.helper';

const props = defineProps<{
	documentKey: 'terms' | 'privacy';
}>();

const {
	t,
	tm,
	documentBaseKey,
	titlePrefix,
	titleSuffix,
	hasSplitTitle,
	resolveMessage,
	sections,
	topics,
	activeTopicId,
	sidebarNavElement,
	activeIndicatorStyle,
	handleTopicClick,
} = useLegalDocumentPage(props.documentKey);

function usePlainBulletText(sectionId: string) {
	return sectionId === 'procedure-and-method-of-destruction' || sectionId === 'privacy-section-5';
}

function useSecondaryBulletMarkers(sectionId: string) {
	return sectionId === 'procedure-and-method-of-destruction' || sectionId === 'privacy-section-5';
}

function getRenderableBulletContent(sectionId: string, value: string) {
	if (usePlainBulletText(sectionId)) {
		return {
			label: '',
			segments: parseEmphasisSegments(value),
		};
	}

	return getBulletContent(value);
}

function hasRenderableBulletLabel(sectionId: string, value: string) {
	return !usePlainBulletText(sectionId) && getBulletContent(value).label.length > 0;
}

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
							<template
								v-for="(segment, segmentIndex) in parseEmphasisSegments(resolveMessage(paragraph))"
								:key="`${documentKey}-intro-${index}-segment-${segmentIndex}`"
							>
								<strong v-if="segment.bold" class="legal-inline-emphasis">{{ segment.text }}</strong>
								<template v-else>{{ segment.text }}</template>
							</template>
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
						<nav
							ref="sidebarNavElement"
							class="legal-sidebar-nav"
							:aria-label="t(`${documentBaseKey}.topicsLabel`)"
						>
							<span
								class="legal-sidebar-indicator"
								:style="activeIndicatorStyle"
								aria-hidden="true"
							/>
							<a
								v-for="topic in topics"
								:key="topic.id"
								:href="`#${topic.id}`"
								class="legal-sidebar-link"
								:class="{ 'is-active': activeTopicId === topic.id }"
								@click="handleTopicClick($event, topic.id)"
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

						<div
							v-if="section.paragraphs?.length || section.bullets?.length"
							class="legal-section-block legal-section-block--content"
							:class="{ 'legal-section-block--compact': section.id === 'contact-information' }"
						>
							<div
								v-if="section.paragraphs?.length"
								class="legal-section-block legal-section-block--paragraphs"
							>
								<p
									v-for="(paragraph, paragraphIndex) in section.paragraphs"
									:key="`${section.id}-paragraph-${paragraphIndex}`"
									class="legal-section-paragraph"
								>
									<template v-if="getBulletContent(paragraph).label">
										<strong class="legal-inline-label">{{ getBulletContent(paragraph).label }}</strong>
									</template>
									<template
										v-for="(segment, segmentIndex) in getBulletContent(paragraph).segments"
										:key="`${section.id}-paragraph-${paragraphIndex}-segment-${segmentIndex}`"
									>
										<strong v-if="segment.bold" class="legal-inline-emphasis">{{ segment.text }}</strong>
										<template v-else>{{ segment.text }}</template>
									</template>
								</p>
							</div>

							<ul
								v-if="section.bullets?.length"
								class="legal-section-list"
								:class="{ 'legal-section-list--secondary-markers': useSecondaryBulletMarkers(section.id) }"
							>
								<li
									v-for="(bullet, bulletIndex) in section.bullets"
									:key="`${section.id}-bullet-${bulletIndex}`"
									class="legal-section-list-item"
									:class="{ 'legal-section-list-item--labeled': hasRenderableBulletLabel(section.id, bullet.text) }"
								>
									<template v-if="usePlainBulletText(section.id)">
										{{ bullet.text }}
									</template>
									<template v-else>
										<template v-if="hasRenderableBulletLabel(section.id, bullet.text)">
											<strong class="legal-inline-label">{{ getRenderableBulletContent(section.id, bullet.text).label }}</strong>
										</template>
										<template
											v-for="(segment, segmentIndex) in getRenderableBulletContent(section.id, bullet.text).segments"
											:key="`${section.id}-bullet-${bulletIndex}-segment-${segmentIndex}`"
										>
											<strong v-if="segment.bold" class="legal-inline-emphasis">{{ segment.text }}</strong>
											<template v-else>{{ segment.text }}</template>
										</template>
									</template>
									<ul v-if="bullet.items?.length" class="legal-section-list legal-section-list--nested">
										<li
											v-for="(item, itemIndex) in bullet.items"
											:key="`${section.id}-bullet-${bulletIndex}-item-${itemIndex}`"
											class="legal-section-list-item"
										>
											<template
												v-for="(segment, segmentIndex) in parseEmphasisSegments(item)"
												:key="`${section.id}-bullet-${bulletIndex}-item-${itemIndex}-segment-${segmentIndex}`"
											>
												<strong v-if="segment.bold" class="legal-inline-emphasis">{{ segment.text }}</strong>
												<template v-else>{{ segment.text }}</template>
											</template>
										</li>
									</ul>
								</li>
							</ul>
						</div>

						<div v-if="section.groups?.length" class="legal-section-block legal-section-block--groups">
							<div
								v-for="(group, groupIndex) in section.groups"
								:key="`${section.id}-group-${groupIndex}`"
								class="legal-section-group"
							>
								<p
									v-if="group.title"
									class="legal-section-group-title"
								>
									<template
										v-for="(segment, segmentIndex) in parseEmphasisSegments(group.title)"
										:key="`${section.id}-group-${groupIndex}-title-${segmentIndex}`"
									>
										<strong v-if="segment.bold" class="legal-inline-emphasis">{{ segment.text }}</strong>
										<template v-else>{{ segment.text }}</template>
									</template>
								</p>
								<ul
									v-if="group.items.length"
									class="legal-section-list legal-section-list--grouped"
									:class="{ 'legal-section-list--secondary-markers': useSecondaryBulletMarkers(section.id) }"
								>
									<li
										v-for="(item, itemIndex) in group.items"
										:key="`${section.id}-group-${groupIndex}-item-${itemIndex}`"
										class="legal-section-list-item"
										:class="{ 'legal-section-list-item--labeled': hasRenderableBulletLabel(section.id, item.text) }"
									>
										<template v-if="usePlainBulletText(section.id)">
											{{ item.text }}
										</template>
										<template v-else>
											<template v-if="hasRenderableBulletLabel(section.id, item.text)">
												<strong class="legal-inline-label">{{ getRenderableBulletContent(section.id, item.text).label }}</strong>
											</template>
											<template
												v-for="(segment, segmentIndex) in getRenderableBulletContent(section.id, item.text).segments"
												:key="`${section.id}-group-${groupIndex}-item-${itemIndex}-segment-${segmentIndex}`"
											>
												<strong v-if="segment.bold" class="legal-inline-emphasis">{{ segment.text }}</strong>
												<template v-else>{{ segment.text }}</template>
											</template>
										</template>
										<ul v-if="item.items?.length" class="legal-section-list legal-section-list--nested">
											<li
												v-for="(nestedItem, nestedItemIndex) in item.items"
												:key="`${section.id}-group-${groupIndex}-item-${itemIndex}-nested-${nestedItemIndex}`"
												class="legal-section-list-item"
											>
												<template
													v-for="(segment, segmentIndex) in parseEmphasisSegments(nestedItem)"
													:key="`${section.id}-group-${groupIndex}-item-${itemIndex}-nested-${nestedItemIndex}-segment-${segmentIndex}`"
												>
													<strong v-if="segment.bold" class="legal-inline-emphasis">{{ segment.text }}</strong>
													<template v-else>{{ segment.text }}</template>
												</template>
											</li>
										</ul>
									</li>
								</ul>
							</div>
						</div>

						<template v-if="section.table">
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
							<p
								v-if="section.table.note"
								class="legal-section-table-note"
							>
								<template
									v-for="(segment, segmentIndex) in parseEmphasisSegments(section.table.note)"
									:key="`${section.id}-table-note-${segmentIndex}`"
								>
									<strong v-if="segment.bold" class="legal-inline-emphasis">{{ segment.text }}</strong>
									<template v-else>{{ segment.text }}</template>
								</template>
							</p>
						</template>
					</section>
				</div>
			</div>
		</section>
	</main>
</template>

<style scoped lang="scss">
.legal-page {
	background: var(--bg-page);

	.legal-hero {
		background: var(--brand-primary);
		padding: 72px 24px 56px;

		.legal-hero-shell {
			width: min(1200px, 100%);
			margin: 0 auto;
		}

		.legal-heading-group {
			display: grid;
			gap: 12px;
		}

		.legal-title {

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

			.legal-introduction-copy {

				font-size: var(--type-size-300);
				line-height: var(--type-line-300);
				color: var(--text-primary);
			}
		}
	}

	.legal-content {
		padding: 80px 24px 96px;

		.legal-content-shell {
			width: min(1200px, 100%);
			margin: 0 auto;
			display: grid;
			grid-template-columns: 282px minmax(0, 1fr);
			gap: 40px;
			align-items: start;
		}

		.legal-sidebar {
			position: sticky;
			top: 48px;

			.legal-sidebar-card {
				border: 1px solid var(--border-default);
				border-radius: 12px;
				background: var(--contrast-light);
				overflow: hidden;
			}

			.legal-sidebar-title {

				padding: 16px 32px;
				font-size: var(--type-size-300);
				line-height: var(--type-line-300);
				font-weight: var(--font-weight-semibold);
				color: var(--text-primary);
			}

			.legal-sidebar-nav {
				position: relative;
				display: flex;
				flex-direction: column;

				.legal-sidebar-indicator {
					position: absolute;
					top: 0;
					left: 0;
					background: var(--gray-20);
					transition:
						transform 0.24s ease,
						width 0.24s ease,
						height 0.24s ease,
						opacity 0.2s ease;
					pointer-events: none;
				}

				.legal-sidebar-link {
					position: relative;
					z-index: 1;
					padding: 8px 32px;
					color: var(--text-secondary);
					text-decoration: none;
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					transition: background-color 0.16s ease, color 0.16s ease;
					overflow-wrap: anywhere;

					&.is-active,
					&:hover,
					&:focus-visible {
						color: var(--text-primary);
					}

					&.is-active {
						font-weight: var(--font-weight-semibold);
					}
				}
			}
		}

		.legal-sections {
			display: grid;

			.legal-section {
				padding: 0 0 32px;
				border-bottom: 1px solid var(--border-default);
				display: grid;
				gap: 16px;

				&:last-child {
					border-bottom: 0;
				}

				+ .legal-section {
					padding-top: 32px;
				}

				.legal-section-title {

					font-size: var(--type-size-400);
					line-height: var(--type-line-400);
					font-weight: var(--font-weight-bold);
					color: var(--text-primary);
				}

				.legal-section-block {
					display: grid;

					&.legal-section-block--content {
						gap: 0;
					}

					&.legal-section-block--paragraphs {
						gap: 0;
					}

					&.legal-section-block--compact {
						gap: 0;
					}

					&.legal-section-block--groups {
						gap: 0;
					}
				}

				.legal-section-paragraph {

					font-size: var(--type-size-200);
					line-height: var(--type-line-200);
					color: var(--text-primary);
				}

				.legal-section-list {

					padding-left: 28px;
					list-style: disc;
					display: grid;
					gap: 0;

					&.legal-section-list--grouped {
						margin-top: 0;
					}

					&.legal-section-list--secondary-markers {
						.legal-section-list-item::marker,
						.legal-section-list-item.legal-section-list-item--labeled::marker {
							color: var(--text-tertiary, var(--text-secondary));
							font-size: 0.72em;
						}
					}

					&.legal-section-list--nested {
						padding-left: 20px;
						.legal-section-list-item {
							font-size: var(--type-size-200);
						}
					}

					.legal-section-list-item {
						font-size: var(--type-size-200);
						line-height: var(--type-line-200);
						color: var(--text-secondary);


						&::marker {
							color: var(--text-tertiary, var(--text-secondary));
							font-size: 0.72em;
						}

						&.legal-section-list-item--labeled::marker {
							color: var(--text-primary);
							font-size: 1em;
						}
					}
				}

				.legal-inline-label,
				.legal-inline-emphasis {
					font-weight: var(--font-weight-bold);
					color: var(--text-primary);
				}

				.legal-section-group {
					display: grid;
					gap: 0;

					.legal-section-group-title {

						font-size: var(--type-size-200);
						line-height: var(--type-line-200);
						font-weight: var(--font-weight-bold);
						color: var(--text-primary);
					}
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

					.legal-section-table-head {
						padding: 12px 24px;
						background: var(--gray-30);
						border-right: 1px solid var(--border-default);
						text-align: left;
						font-size: var(--type-size-200);
						line-height: var(--type-line-200);
						font-weight: var(--font-weight-semibold);
						color: var(--text-primary);

						&:last-child {
							border-right: 0;
						}
					}

					.legal-section-table-cell {
						padding: 10px 24px;
						border-top: 1px solid var(--border-default);
						border-right: 1px solid var(--border-default);
						font-size: var(--type-size-200);
						line-height: var(--type-line-200);
						color: var(--text-primary);
						vertical-align: top;

						&:last-child {
							border-right: 0;
						}
					}
				}

				.legal-section-table-note {

					font-size: var(--type-size-200);
					line-height: var(--type-line-200);
					font-weight: var(--font-weight-bold);
					color: var(--text-primary);
				}
			}
		}
	}
}

@media (max-width: 980px) {
	.legal-page {
		.legal-content {
			.legal-content-shell {
				grid-template-columns: 1fr;
				gap: 28px;
			}

			.legal-sidebar {
				position: static;

				.legal-sidebar-nav {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
				}
			}
		}
	}
}

@media (max-width: 760px) {
	.legal-page {
		.legal-hero {
			padding: 48px 16px 32px;

			.legal-title {
				font-size: var(--type-size-500);
				line-height: var(--type-line-500);
			}
		}

		.legal-content {
			padding: 24px 16px 56px;

			.legal-sidebar {
				.legal-sidebar-nav {
					grid-template-columns: 1fr;
				}
			}

			.legal-sections {
				.legal-section {
					.legal-section-table {
						.legal-section-table-head,
						.legal-section-table-cell {
							padding: 12px 14px;
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
						}
					}
				}
			}
		}
	}
}
</style>