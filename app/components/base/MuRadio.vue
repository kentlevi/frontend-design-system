<template>
	<div
		:class="[
			'm-radio',
			`m-radio--${resolved_size}`,
			`m-radio--variant-${resolved_variant}`,
			{
				'm-radio--checked': checked,
				'm-radio--disabled': resolved_disabled,
			},
		]"
	>
		<label class="m-radio-label">
			<input
				type="radio"
				class="m-radio-input"
				:name="resolved_name"
				:value="props.value"
				:checked="checked"
				:disabled="resolved_disabled"
				@change="onChangeHandler"
			>
			<span class="m-radio-icon" aria-hidden="true">
				<span v-if="resolved_variant === 'check'" class="m-radio-check-icon" />
				<span v-else class="m-radio-dot" />
			</span>
			<slot />
		</label>
	</div>
</template>

<script setup lang="ts">
type RadioModelValue = string | number | boolean | null
type RadioValue = string | number | boolean
type RadioSize = 'sm' | 'md'
type RadioVariant = 'default' | 'check'
type RadioGroupContext = {
	selected_value: Ref<RadioModelValue>
	selectValue: (_value: RadioValue) => void
	name: ComputedRef<string | undefined>
	disabled: ComputedRef<boolean>
	size: ComputedRef<RadioSize>
}

interface Props {
	modelValue?: RadioModelValue
	value: RadioValue
	name?: string
	size?: RadioSize
	disabled?: boolean
	variant?: RadioVariant
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: null,
	name: undefined,
	size: undefined,
	disabled: false,
	variant: undefined,
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: RadioModelValue): void
	(_e: 'change', _value: RadioValue): void
}>()

const radio_group = inject<RadioGroupContext | null>('radio-group', null)

const checked = computed(() => {
	const selected_value = radio_group
		? radio_group.selected_value.value
		: props.modelValue

	return selected_value === props.value
})

const resolved_size = computed<RadioSize>(() =>
	(props.size ?? radio_group?.size.value ?? 'sm') === 'md' ? 'md' : 'sm',
)

const resolved_name = computed(() => props.name ?? radio_group?.name.value)
const resolved_disabled = computed(() => Boolean(props.disabled || radio_group?.disabled.value))
const resolved_variant = computed<RadioVariant>(() => props.variant ?? 'default')

function onChangeHandler(event: Event) {
	const target = event.target as HTMLInputElement
	if (resolved_disabled.value || !target.checked) return

	if (radio_group) {
		radio_group.selectValue(props.value)
		emit('change', props.value)
		return
	}

	emit('update:modelValue', props.value)
	emit('change', props.value)
}
</script>

<style scoped lang="scss">
.m-radio {
	display: inline-flex;
	color: var(--text-primary);

	.m-radio-label {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
	}

	.m-radio-input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.m-radio-icon {
		display: inline-grid;
		place-items: center;
		flex-shrink: 0;
		border: 1px solid var(--gray-50);
		border-radius: 999px;
		background: var(--contrast-light);
		transition: background-color 0.18s ease, border-color 0.18s ease;
	}

	.m-radio-dot {
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: transparent;
		transition: background-color 0.18s ease;
	}

	&--sm {
		.m-radio-label {
			gap: 8px;
		}

		.m-radio-icon {
			width: 16px;
			height: 16px;
		}

		.m-radio-dot {
			width: 6px;
			height: 6px;
		}
	}

	&--md {
		.m-radio-icon {
			width: 20px;
			height: 20px;
		}
	}

	&--checked {
		.m-radio-icon {
			border-color: var(--gray-100);
			background: var(--gray-100);
		}

		.m-radio-dot {
			background: var(--contrast-light);
		}
	}

	&:not(.m-radio--disabled):focus-within {
		.m-radio-icon {
			outline: 2px solid rgb(42, 47, 61, 0.16);
			outline-offset: 2px;
		}
	}

	&--disabled {
		opacity: 0.5;

		.m-radio-label {
			cursor: not-allowed;
		}
	}

	&--variant-check {
		.m-radio-icon {
			border-radius: 4px;
		}

		.m-radio-check-icon {
			width: 9px;
			height: 5px;
			border-left: 2px solid var(--contrast-light);
			border-bottom: 2px solid var(--contrast-light);
			transform: rotate(-45deg) translateY(-1px);
			opacity: 0;
			transition: opacity 0.18s ease;
		}
	}

	&--variant-check.m-radio--checked {
		.m-radio-check-icon {
			opacity: 1;
		}
	}
}
</style>