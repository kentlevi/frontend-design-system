<script setup lang="ts">
import {
	useControlAttrs,
	useControlTestId,
	useRootAttrs,
} from '~/helpers/ui/uiControlAttrs.helper';

type Size = 'md' | 'sm';
type State = 'default' | 'error' | 'success';

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		modelValue?: string | number | boolean | null;
		value?: string | number | boolean;
		name?: string;
		label?: string;
		disabled?: boolean;
		size?: Size;
		state?: State;
	}>(),
	{
		modelValue: null,
		value: true,
		name: '',
		label: '',
		disabled: false,
		size: 'md',
		state: 'default',
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | number | boolean): void;
	(e: 'change', value: string | number | boolean): void;
}>();

const attrs = useAttrs();
const test_id = useControlTestId(attrs);
const root_attrs = useRootAttrs(attrs, test_id);
const input_attrs = useControlAttrs(attrs, test_id);
const is_checked = computed(() => props.modelValue === props.value);

function onChange() {
	emit('update:modelValue', props.value);
	emit('change', props.value);
}
</script>

<template>
	<label
		v-bind="root_attrs"
		class="ui-radio"
		:data-size="props.size"
		:data-state="props.state !== 'default' ? props.state : null"
		:data-disabled="props.disabled || null"
		:data-checked="is_checked || null"
	>
		<input
			v-bind="input_attrs"
			class="ui-radio-input"
			type="radio"
			:name="props.name || undefined"
			:checked="is_checked"
			:value="props.value"
			:disabled="props.disabled"
			@change="onChange"
		>
		<span class="ui-radio-control" aria-hidden="true">
			<span class="ui-radio-dot" />
		</span>
		<span v-if="$slots.default || props.label" class="ui-radio-label">
			<slot>{{ props.label }}</slot>
		</span>
	</label>
</template>