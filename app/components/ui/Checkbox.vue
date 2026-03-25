<script setup lang="ts">
import UiIcon from '~/components/ui/Icon.vue';
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
		modelValue?: boolean;
		label?: string;
		disabled?: boolean;
		size?: Size;
		state?: State;
		boxClass?: string;
		iconClass?: string;
		labelClass?: string;
	}>(),
	{
		modelValue: false,
		label: '',
		disabled: false,
		size: 'md',
		state: 'default',
		boxClass: '',
		iconClass: '',
		labelClass: '',
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();
const attrs = useAttrs();

const test_id = useControlTestId(attrs);
const root_attrs = useRootAttrs(attrs, test_id);
const input_attrs = useControlAttrs(attrs, test_id);

function onChange(event: Event) {
	emit('update:modelValue', (event.target as HTMLInputElement).checked);
}
</script>

<template>
	<label
		v-bind="root_attrs"
		class="ui-checkbox"
		:data-size="props.size"
		:data-state="props.state !== 'default' ? props.state : null"
		:data-disabled="props.disabled || null"
	>
		<input
			v-bind="input_attrs"
			class="ui-checkbox-input"
			type="checkbox"
			:checked="props.modelValue"
			:disabled="props.disabled"
			@change="onChange"
		>
		<span :class="['ui-checkbox-box', props.boxClass]" aria-hidden="true">
			<UiIcon
				name="strong-check"
				:size="16"
				color="var(--text-inverse)"
				decorative
				:class="['ui-checkbox-icon', props.iconClass]"
			/>
		</span>
		<span v-if="$slots.default || props.label" :class="['ui-checkbox-label', props.labelClass]">
			<slot>{{ props.label }}</slot>
		</span>
	</label>
</template>