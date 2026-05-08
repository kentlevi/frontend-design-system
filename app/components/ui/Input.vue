<script setup lang="ts">
import { computed } from 'vue';
import UiIcon from '@/components/ui/Icon.vue';
import type { icons } from '~/data/ui/icons';
import {
	useControlAttrs,
	useControlTestId,
	useRootAttrs,
} from '~/helpers/ui/uiControlAttrs.helper';

type Size = 'lg' | 'md' | 'sm';
type State = 'default' | 'error' | 'success';
type Icon = 'mail' | 'search' | 'user' | null;
type IconName = keyof typeof icons;

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		modelValue?: string | number;
		type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
		placeholder?: string;
		size?: Size;
		state?: State;
		iconLeft?: Icon;
		iconRight?: Icon;
		readonly?: boolean;
		disabled?: boolean;
		inputClass?: string;
	}>(),
	{
		modelValue: '',
		type: 'text',
		placeholder: '',
		size: 'md',
		state: 'default',
		iconLeft: null,
		iconRight: null,
		readonly: false,
		disabled: false,
		inputClass: '',
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();
const attrs = useAttrs();

const input_ref = ref<HTMLInputElement | null>(null);

const icon_map: Record<Exclude<Icon, null>, IconName> = {
	mail: 'strong-envelope',
	search: 'strong-search',
	user: 'strong-user',
};

const left_icon = computed<IconName | null>(() =>
	props.iconLeft ? icon_map[props.iconLeft] : null
);

const right_icon = computed<IconName | null>(() =>
	props.iconRight ? icon_map[props.iconRight] : null
);
const test_id = useControlTestId(attrs);
const root_attrs = useRootAttrs(attrs, test_id);
const input_attrs = useControlAttrs(attrs, test_id);

function onInput(event: Event) {
	emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function focusInput() {
	if (props.disabled || props.readonly) return;
	input_ref.value?.focus();
}
</script>

<template>
	<div
		v-bind="root_attrs"
		class="ui-input"
		:data-size="size"
		:data-state="state !== 'default' ? state : null"
		:data-readonly="readonly || null"
		:data-disabled="disabled || null"
		@click="focusInput"
	>
		<span v-if="$slots['icon-left'] || left_icon" class="ui-input-icon">
			<slot name="icon-left">
				<UiIcon v-if="left_icon" :name="left_icon" :size="24" decorative />
			</slot>
		</span>

		<input
			v-bind="input_attrs"
			ref="input_ref"
			:class="['ui-input-field', props.inputClass]"
			:type="type"
			:value="modelValue"
			:placeholder="placeholder"
			:readonly="readonly"
			:disabled="disabled"
			@input="onInput"
		>

		<span v-if="$slots['icon-right'] || right_icon" class="ui-input-icon">
			<slot name="icon-right">
				<UiIcon v-if="right_icon" :name="right_icon" :size="16" decorative />
			</slot>
		</span>
	</div>
</template>