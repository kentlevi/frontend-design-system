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
const testId = useControlTestId(attrs);
const rootAttrs = useRootAttrs(attrs, testId);
const inputAttrs = useControlAttrs(attrs, testId);
const isChecked = computed(() => props.modelValue === props.value);

function onChange() {
	emit('update:modelValue', props.value);
	emit('change', props.value);
}
</script>

<template>
	<label
		v-bind="rootAttrs"
		class="ui-radio"
		:data-size="props.size"
		:data-state="props.state !== 'default' ? props.state : null"
		:data-disabled="props.disabled || null"
		:data-checked="isChecked || null"
	>
		<input
			v-bind="inputAttrs"
			class="ui-radio-input"
			type="radio"
			:name="props.name || undefined"
			:checked="isChecked"
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

<style scoped lang="scss">
.ui-radio {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	color: var(--text-primary);
	cursor: pointer;

	.ui-radio-input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.ui-radio-control {
		width: 20px;
		height: 20px;
		border-radius: 999px;
		border: 1px solid var(--gray-50);
		background: var(--contrast-light);
		display: inline-grid;
		place-items: center;
		flex-shrink: 0;
		transition: background-color 0.18s ease, border-color 0.18s ease;

		.ui-radio-dot {
			width: 8px;
			height: 8px;
			border-radius: 999px;
			background: transparent;
			transition: background-color 0.18s ease;
		}
	}

	.ui-radio-label {
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
		font-weight: var(--font-weight-semibold);
	}

	&[data-size='sm'] {
		gap: 8px;

		.ui-radio-control {
			width: 16px;
			height: 16px;

			.ui-radio-dot {
				width: 6px;
				height: 6px;
			}
		}

		.ui-radio-label {
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
		}
	}

	&[data-checked='true'] {
		.ui-radio-control {
			border-color: var(--gray-100);
			background: var(--gray-100);

			.ui-radio-dot {
				background: var(--contrast-light);
			}
		}
	}

	&[data-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&[data-state='error'] {
		.ui-radio-control {
			border-color: var(--error);
		}
	}

	&:focus-within {
		.ui-radio-control {
			outline: 2px solid rgb(42, 47, 61, 0.16);
			outline-offset: 2px;
		}
	}
}
</style>