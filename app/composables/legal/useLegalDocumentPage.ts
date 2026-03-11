import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
	normalizeLegalSections,
	toMessageArray,
} from '~/helpers/legal/legalDocument.helper';
import type {
	LegalSection,
	RawLegalSection,
} from '~/types/legal/legalDocument';

export function useLegalDocumentPage(document_key: 'terms' | 'privacy') {
	const { t, tm, rt } = useI18n();

	const active_topic_id = ref('');
	const manual_active_topic_id = ref('');
	const sidebar_nav_element = ref<HTMLElement | null>(null);
	const active_indicator_style = ref({
		transform: 'translate3d(0, 0, 0)',
		width: '0px',
		height: '0px',
		opacity: '0',
	});
	let scroll_spy_raf_id: number | null = null;

	const document_base_key = computed(() => `legal.${document_key}`);
	const title_prefix = computed(() => t(`${document_base_key.value}.titlePrefix`));
	const title_suffix = computed(() => t(`${document_base_key.value}.titleSuffix`));
	const has_split_title = computed(
		() =>
			title_prefix.value !== `${document_base_key.value}.titlePrefix` &&
			title_suffix.value !== `${document_base_key.value}.titleSuffix`
	);

	function resolveMessage(value: unknown) {
		if (typeof value === 'string') return value;
		return rt(value as Parameters<typeof rt>[0]);
	}

	const sections = computed(
		() =>
			normalizeLegalSections(
				toMessageArray(tm(`${document_base_key.value}.sections`) as RawLegalSection[]) as RawLegalSection[],
				document_key,
				resolveMessage
			) as LegalSection[]
	);

	const topics = computed(() =>
		sections.value.map((section) => ({
			id: section.id,
			title: section.title.replace(/^\d+\.\s*/, ''),
		}))
	);

	function setInitialActiveTopic() {
		active_topic_id.value = sections.value[0]?.id || '';
	}

	function clearManualActiveTopic() {
		manual_active_topic_id.value = '';
	}

	function updateActiveIndicator() {
		if (!import.meta.client) return;

		const nav_element = sidebar_nav_element.value;
		const active_link_element = active_topic_id.value
			? nav_element?.querySelector<HTMLElement>(`a[href="#${CSS.escape(active_topic_id.value)}"]`) || null
			: null;

		if (!nav_element || !active_link_element) {
			active_indicator_style.value = {
				transform: 'translate3d(0, 0, 0)',
				width: '0px',
				height: '0px',
				opacity: '0',
			};
			return;
		}

		const nav_rect = nav_element.getBoundingClientRect();
		const link_rect = active_link_element.getBoundingClientRect();

		active_indicator_style.value = {
			transform: `translate3d(0, ${link_rect.top - nav_rect.top}px, 0)`,
			width: `${link_rect.width}px`,
			height: `${link_rect.height}px`,
			opacity: '1',
		};
	}

	function scrollToTopicSection(topic_id: string) {
		if (!import.meta.client) return;

		const section_element = document.getElementById(topic_id);
		if (!section_element) return;

		const top_offset = 132;
		const target_top = section_element.getBoundingClientRect().top + window.scrollY - top_offset;

		window.scrollTo({
			top: Math.max(target_top, 0),
			behavior: 'smooth',
		});
	}

	function handleTopicClick(event: MouseEvent, topic_id: string) {
		event.preventDefault();
		manual_active_topic_id.value = topic_id;
		active_topic_id.value = topic_id;
		scrollToTopicSection(topic_id);
		window.history.replaceState(null, '', `#${topic_id}`);
	}

	function syncActiveTopicFromScroll() {
		if (!import.meta.client) return;

		if (manual_active_topic_id.value) {
			active_topic_id.value = manual_active_topic_id.value;
			return;
		}

		const document_height = document.documentElement.scrollHeight;
		const viewport_bottom = window.scrollY + window.innerHeight;
		const is_at_page_bottom = viewport_bottom >= document_height - 2;
		const last_section = sections.value.at(-1);
		const last_section_element = last_section
			? document.getElementById(last_section.id)
			: null;
		const last_section_top = last_section_element?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
		const last_section_visible_anchor = window.innerHeight * 0.6;

		if (is_at_page_bottom && last_section?.id && last_section_element && last_section_top <= last_section_visible_anchor) {
			active_topic_id.value = last_section.id;
			return;
		}

		const scroll_anchor = 156;
		let next_active_id = sections.value[0]?.id || '';

		for (const section of sections.value) {
			const element = document.getElementById(section.id);
			if (!element) continue;

			const { top } = element.getBoundingClientRect();
			if (top <= scroll_anchor) {
				next_active_id = section.id;
			} else {
				break;
			}
		}

		active_topic_id.value = next_active_id;
	}

	function queueScrollSpySync() {
		if (!import.meta.client) return;
		if (scroll_spy_raf_id !== null) return;

		scroll_spy_raf_id = window.requestAnimationFrame(() => {
			scroll_spy_raf_id = null;
			syncActiveTopicFromScroll();
			updateActiveIndicator();
		});
	}

	onMounted(() => {
		setInitialActiveTopic();
		void nextTick(() => {
			syncActiveTopicFromScroll();
			updateActiveIndicator();
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

		if (scroll_spy_raf_id !== null) {
			window.cancelAnimationFrame(scroll_spy_raf_id);
			scroll_spy_raf_id = null;
		}
	});

	watch(
		() => `${document_key}:${sections.value.map((section) => section.id).join('|')}`,
		() => {
			setInitialActiveTopic();
			if (!import.meta.client) return;

			void nextTick(() => {
				syncActiveTopicFromScroll();
				updateActiveIndicator();
			});
		}
	);

	watch(active_topic_id, () => {
		if (!import.meta.client) return;

		void nextTick(() => {
			updateActiveIndicator();
		});
	});

	return {
		t,
		tm,
		documentBaseKey: document_base_key,
		titlePrefix: title_prefix,
		titleSuffix: title_suffix,
		hasSplitTitle: has_split_title,
		resolveMessage: resolveMessage,
		sections,
		topics,
		activeTopicId: active_topic_id,
		sidebarNavElement: sidebar_nav_element,
		activeIndicatorStyle: active_indicator_style,
		handleTopicClick: handleTopicClick,
	};
}