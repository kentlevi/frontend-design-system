<template>
	<div :class="['mu-input-container', { readonly: props.readonly, disabled: props.disabled }]">
		<label v-if="$slots['label']" :for="props.id" class="mu-input-label">
			<slot name="label" />
		</label>

		<div
			:class="['mu-input', `mu-input--${props.size}`]"
			:data-state="state !== 'default' ? state : null"
			:data-readonly="props.readonly || null"
			:data-disabled="props.disabled || null"
			@click="focusInput"
		>
			<!-- Left Icon/Prefix Slot -->
			<span v-if="$slots['prefix'] || $slots['inner-left']" class="mu-input-icon">
				<slot name="prefix" />
				<slot name="inner-left" />
			</span>

			<!-- Native Input -->
			<input
				:id="props.id"
				v-model="model"
				:class="['mu-input-field', props.inputClass]"
				:type="props.type"
				:name="props.name"
				:placeholder="props.placeholder"
				:autocomplete="props.autocomplete"
				:required="props.required"
				:readonly="props.readonly"
				:disabled="props.disabled"
				@input="onChangeHandler"
				@focus="handleFocus"
				@blur="handleBlur"
				ref="input_ref"
			>

			<!-- Right Icon/Suffix Slot -->
			<span v-if="$slots['suffix'] || $slots['inner-right']" class="mu-input-icon">
				<slot name="suffix" />
				<slot name="inner-right" />
			</span>
		</div>

		<!-- Error Message -->
		<p v-if="hasError" class="mu-input-error">
			<slot name="error" />
		</p>
	</div>
</template>

<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
})

type Size = 'lg' | 'md' | 'sm'
type State = 'default' | 'error' | 'success'

interface Props {
	name: string
	id: string
	type?: string
	placeholder?: string
	autocomplete?: string
	modelValue?: string | number | null
	hasError?: boolean
	required?: boolean
	readonly?: boolean
	disabled?: boolean
	size?: Size
	state?: State
	inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
	type: 'text',
	placeholder: '',
	autocomplete: 'on',
	modelValue: '',
	hasError: false,
	required: false,
	readonly: false,
	disabled: false,
	size: 'md',
	state: 'default',
	inputClass: '',
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: string | number | null): void
}>()

const input_ref = ref<HTMLInputElement | null>(null)
const is_focused = ref(false)

const model = computed({
	get: () => props.modelValue ?? '',
	set: (val: string | number | null) => {
		emit('update:modelValue', val)
	},
})

const state = computed<State>(() => {
	if (props.hasError) return 'error'
	return props.state
})

function onChangeHandler(event: Event) {
	const target = event.target as HTMLInputElement
	emit('update:modelValue', target.value)
}

function handleFocus() {
	is_focused.value = true
}

function handleBlur() {
	is_focused.value = false
}

function focusInput() {
	if (props.disabled || props.readonly) return
	input_ref.value?.focus()
}

defineExpose({
	input_ref,
})
</script>

<style scoped lang="scss">
.mu-input-container {
	display: flex;
	flex-direction: column;
	gap: var(--space-xs);

	&.disabled {
		.mu-input {
			pointer-events: none;
		}
	}
}

.mu-input-label {
	display: block;
	font-size: var(--body-sm);
	font-weight: 500;
	color: var(--text-primary);
	cursor: pointer;
}

.mu-input {
	display: flex;
	align-items: center;
	gap: var(--space-xs);
	padding-inline: var(--space-md);

	border-radius: var(--radius-md);
	border: 1px solid var(--border-default);
	background: var(--bg-page);
	cursor: text;

	transition:
		border-color 0.15s ease,
		box-shadow 0.15s ease,
		background 0.15s ease;

	/* Sizes */
	&--lg {
		height: var(--space-3xl);
	}

	&--md {
		height: var(--space-2xl);
	}

	&--sm {
		height: var(--space-xl);
	}

	/* States - Hover & Focus */
	&:hover:not([data-disabled='true']):not([data-state='error']):not([data-state='success']),
	&:focus-within:not([data-disabled='true']):not([data-state='error']):not([data-state='success']) {
		border-color: var(--border-strong);
	}

	/* Error State */
	&[data-state='error'],
	&[data-state='error']:hover:not([data-disabled='true']) {
		border-color: var(--error);
	}

	/* Success State */
	&[data-state='success'],
	&[data-state='success']:hover:not([data-disabled='true']) {
		border-color: var(--success);
	}

	/* Disabled State */
	&[data-disabled='true'] {
		background: var(--gray-20);
		border-color: var(--gray-50);
		box-shadow: none;
		cursor: not-allowed;
	}

	/* Readonly State */
	&[data-readonly='true']:not([data-disabled='true']) {
		background: var(--surface-subtle);
	}
}

.mu-input-field {
	flex: 1;
	min-width: 0;
	border: none;
	outline: none;
	background: transparent;

	font-family: var(--font-base);
	font-size: var(--body-base);
	line-height: var(--type-line-100);
	color: var(--text-primary);

	&::placeholder {
		color: var(--text-muted);
	}

	.mu-input[data-disabled='true'] & {
		color: var(--text-muted);
		cursor: not-allowed;
	}
}

.mu-input-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-xs);
	flex: 0 0 auto;
	min-width: 24px;
	min-height: 24px;
	color: var(--text-muted);

	width: auto;
	height: auto;
}

.mu-input-error {
	font-size: var(--body-sm);
	color: var(--error);
	margin: 0;
	padding-top: var(--space-xs);
}
</style>
