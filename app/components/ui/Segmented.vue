<script setup lang="ts">
type SegmentedValue = string | number;
type SegmentedSize = 'sm' | 'md' | 'lg';

interface SegmentedOption<T = SegmentedValue> {
	label: string;
	value: T;
	disabled?: boolean;
}

const props = withDefaults(
	defineProps<{
		modelValue: SegmentedValue;
		options: SegmentedOption[];
		disabled?: boolean;
		full?: boolean;
		fit?: boolean;
		size?: SegmentedSize;
	}>(),
	{
		disabled: false,
		full: false,
		fit: false,
		size: 'md',
	},
);

const emit = defineEmits<{
	'update:modelValue': [v: SegmentedValue];
	'change': [v: SegmentedValue];
}>();

const segment_button_style = computed(() => {
	if (props.fit) {
		return {
			flex: '0 0 auto',
			width: 'auto',
			maxWidth: 'none',
		};
	}

	const count = Math.max(props.options.length, 1);
	const width = `${100 / count}%`;

	return {
		flex: '1 1 0%',
		width,
		maxWidth: width,
	};
});

function select(opt: SegmentedOption) {
	if (props.disabled || opt.disabled) return;
	if (opt.value === props.modelValue) return;

	emit('update:modelValue', opt.value);
	emit('change', opt.value);
}
</script>

<template>
	<div
		class="ui-segmented"
		:data-size="size"
		:data-full="full ? 'true' : undefined"
		:data-fit="fit ? 'true' : undefined"
		:data-disabled="disabled ? 'true' : undefined"
		role="group"
	>
		<button
			v-for="opt in options"
			:key="String(opt.value)"
			class="ui-segmented-btn"
			:data-active="opt.value === modelValue ? 'true' : undefined"
			:style="segment_button_style"
			type="button"
			:disabled="disabled || opt.disabled"
			:aria-pressed="opt.value === modelValue ? 'true' : 'false'"
			@click="select(opt)"
		>
			<slot
				name="option"
				:option="opt"
				:is_active="opt.value === modelValue"
				:is_disabled="Boolean(disabled || opt.disabled)"
			>
				{{ opt.label }}
			</slot>
		</button>
	</div>
</template>
