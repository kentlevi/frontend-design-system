<script setup lang="ts">
import type { StyleValue } from 'vue';
import MuInput from '~/components/base/MuInput.vue';
import UiIcon from '~/components/ui/Icon.vue';

type SearchValue = string | null;
type SearchSize = 'sm' | 'md' | 'lg';
type SearchWidth = number | string | null;

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		id?: string;
		name?: string;
		modelValue?: SearchValue;
		placeholder?: string;
		autocomplete?: string;
		required?: boolean;
		hasError?: boolean;
		size?: SearchSize;
		clearable?: boolean;
		width?: SearchWidth;
		disabled?: boolean;
		readonly?: boolean;
	}>(),
	{
		id: 'search-input',
		name: 'search',
		modelValue: '',
		placeholder: 'Search',
		autocomplete: 'off',
		required: false,
		hasError: false,
		size: 'md',
		clearable: false,
		width: null,
		disabled: false,
		readonly: false,
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: SearchValue): void;
	(e: 'search', value: SearchValue): void;
	(e: 'clear'): void;
	(e: 'enter'): void;
}>();

const attrs = useAttrs();

const has_value = computed(() => Boolean((props.modelValue ?? '').trim()));

const root_class = computed(() => ['m-search', attrs.class]);

const width_style = computed<StyleValue | undefined>(() => {
	if (props.width === null || props.width === undefined) {
		return undefined;
	}

	const width = typeof props.width === 'number'
		? `${props.width}px`
		: props.width;

	return { width };
});

const root_style = computed<StyleValue | undefined>(() => {
	const style_parts: StyleValue[] = [];
	if (attrs.style) style_parts.push(attrs.style as StyleValue);
	if (width_style.value) style_parts.push(width_style.value);
	return style_parts.length ? style_parts : undefined;
});

const root_attrs = computed(() => {
	const { class: _class_name, style: _style, ...rest } = attrs;
	return rest;
});

function onModelUpdate(value: string | number | null) {
	const next_value = value === null ? null : String(value);
	emit('update:modelValue', next_value);
	emit('search', next_value);
}

function clearSearch() {
	emit('update:modelValue', '');
	emit('search', '');
	emit('clear');
}

function onEnter() {
	emit('enter');
}
</script>

<template>
	<div
		v-bind="root_attrs"
		:class="root_class"
		:style="root_style"
		@keydown.enter="onEnter"
	>
		<MuInput
			:id="props.id"
			:name="props.name"
			:model-value="props.modelValue ?? ''"
			type="search"
			:placeholder="props.placeholder"
			:size="props.size"
			:has-error="props.hasError"
			:readonly="props.readonly"
			:disabled="props.disabled"
			:autocomplete="props.autocomplete"
			:required="props.required"
			@update:model-value="onModelUpdate"
		>
			<template v-if="$slots.left || $slots['icon-left']" #inner-left>
				<slot name="left" />
				<slot name="icon-left" />
			</template>

			<template v-if="$slots.right || $slots['icon-right'] || (props.clearable && has_value)" #inner-right>
				<slot name="right" />
				<slot name="icon-right" />
				<button
					v-if="props.clearable && has_value"
					type="button"
					class="m-search__clear"
					@click="clearSearch"
				>
					<UiIcon
						name="light-times-circle"
						:size="24"
						color="var(--text-primary)"
						decorative
					/>
				</button>
			</template>
		</MuInput>
	</div>
</template>

<style scoped lang="scss">
.m-search {
	:deep(.mu-input-field) {
		&::-webkit-search-cancel-button {
			-webkit-appearance: none;
			display: none;
		}
	}

	.m-search__clear {
		border: 0;
		background: transparent;
		padding: 0;
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: opacity 0.2s ease;

		&:hover {
			opacity: 0.7;
		}
	}
}
</style>