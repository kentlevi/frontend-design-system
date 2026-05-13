<script setup lang="ts">
import type { Ref } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

type TabValue = string | number;
type ButtonTarget = '_self' | '_blank' | '_parent' | '_top';

interface Props {
	value: TabValue;
	selected?: boolean;
	disabled?: boolean;
	to?: RouteLocationRaw;
	href?: string;
	target?: ButtonTarget;
	rel?: string;
}

const props = withDefaults(defineProps<Props>(), {
	selected: false,
	disabled: false,
	to: undefined,
	href: '',
	target: undefined,
	rel: '',
});

const emit = defineEmits<{
	(e: 'click', value: TabValue): void;
}>();

const tabs = inject('mu-tabs') as
	| {
		selectTab: (_value: TabValue) => void;
		model: Ref<TabValue | null>;
	}
	| undefined;

const is_selected = computed(() => {
	if (!tabs) return props.selected;
	return tabs.model.value === props.value;
});

const has_to = computed(() => Boolean(props.to));
const has_href = computed(() => !has_to.value && Boolean(props.href));
const resolved_to = computed<RouteLocationRaw>(() => props.to || '/');
const resolved_href = computed(() => props.href || '#');
const resolved_rel = computed(() => {
	if (props.target !== '_blank') return props.rel || undefined;

	const rel_parts = new Set((props.rel || '').split(/\s+/).filter(Boolean));
	rel_parts.add('noopener');
	rel_parts.add('noreferrer');
	return Array.from(rel_parts).join(' ');
});

function handleClick(event: MouseEvent) {
	if (props.disabled) {
		event.preventDefault();
		event.stopPropagation();
		return;
	}

	tabs?.selectTab(props.value);
	emit('click', props.value);
}

onMounted(() => {
	if (props.selected && tabs && tabs.model.value === null) {
		tabs.selectTab(props.value);
	}
});
</script>

<template>
	<NuxtLink
		v-if="has_to"
		:to="resolved_to"
		:target="props.target || undefined"
		:rel="resolved_rel"
		class="m-tab"
		:class="{ 'is-selected': is_selected }"
		:aria-disabled="props.disabled || undefined"
		:tabindex="props.disabled ? -1 : undefined"
		@click="handleClick"
	>
		<slot />
	</NuxtLink>

	<a
		v-else-if="has_href"
		:href="resolved_href"
		:target="props.target || undefined"
		:rel="resolved_rel"
		class="m-tab"
		:class="{ 'is-selected': is_selected }"
		:aria-disabled="props.disabled || undefined"
		:tabindex="props.disabled ? -1 : undefined"
		@click="handleClick"
	>
		<slot />
	</a>

	<button
		v-else
		type="button"
		class="m-tab"
		:class="{ 'is-selected': is_selected }"
		:disabled="props.disabled"
		@click.prevent="handleClick"
	>
		<slot />
	</button>
</template>