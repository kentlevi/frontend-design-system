<script setup lang="ts">
import type { StyleValue } from 'vue';

type TabValue = string | number | null;

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		modelValue?: TabValue;
		gap?: number;
		direction?: 'row' | 'column';
	}>(),
	{
		modelValue: null,
		gap: 12,
		direction: 'row',
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: TabValue): void;
	(e: 'change', value: TabValue): void;
}>();

const attrs = useAttrs();

const model = computed({
	get: () => props.modelValue,
	set: (value: TabValue) => {
		emit('update:modelValue', value);
		emit('change', value);
	}
});

function selectTab(value: string | number) {
	model.value = value;
}

provide('mu-tabs', {
	selectTab,
	model,
});

const root_attrs = computed(() => {
	const { class: _class_name, style: _style, ...rest } = attrs;
	return rest;
});

const root_class = computed(() => ['m-tabs', attrs.class]);

const root_style = computed<StyleValue>(() => {
	const style_parts: StyleValue[] = [
		{
			'--m-tabs-gap': `${props.gap}px`,
		},
	];

	if (attrs.style) {
		style_parts.push(attrs.style as StyleValue);
	}

	return style_parts;
});
</script>

<template>
	<nav
		v-bind="root_attrs"
		:class="root_class"
		:data-direction="props.direction"
		:style="root_style"
	>
		<slot />
	</nav>
</template>