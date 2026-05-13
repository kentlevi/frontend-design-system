<template>
	<div
		:class="[
			'm-checkbox',
			`m-checkbox--variant-${props.variant}`,
			{ 'm-checkbox--checked': model },
		]"
		:data-size="props.size"
		:data-state="props.state !== 'default' ? props.state : null"
		:data-disabled="props.disabled || null"
	>
		<label class="m-checkbox-label">
			<input
				type="checkbox"
				class="m-checkbox-input"
				:checked="model"
				:disabled="props.disabled"
				@change="onChangeHandler"
			>
			<span class="m-checkbox-box" aria-hidden="true">
				<span class="m-checkbox-icon" />
			</span>
			<slot />
		</label>
	</div>
</template>

<script setup lang="ts">
type CheckboxSize = 'md' | 'sm'
type CheckboxState = 'default' | 'error' | 'success'
type CheckboxVariant = 'check' | 'minus'

interface Props {
	modelValue?: boolean
	disabled?: boolean
	size?: CheckboxSize
	state?: CheckboxState
	variant?: CheckboxVariant
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: undefined,
	disabled: false,
	size: 'md',
	state: 'default',
	variant: 'check',
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: boolean): void
}>()

const internal_model = ref(props.modelValue ?? false)

watch(
	() => props.modelValue,
	(value) => {
		if (typeof value === 'boolean') {
			internal_model.value = value
		}
	},
)

const model = computed(() =>
	typeof props.modelValue === 'boolean'
		? props.modelValue
		: internal_model.value,
)

function onChangeHandler(event: Event) {
	const target = event.target as HTMLInputElement
	internal_model.value = target.checked
	emit('update:modelValue', target.checked)
}
</script>

<style scoped lang="scss">
.m-checkbox {
	display: inline-flex;
	color: var(--text-secondary);
	font-family: var(--font-base);

	.m-checkbox-label {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		cursor: pointer;
		user-select: none;
	}

	.m-checkbox-input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}

	.m-checkbox-box {
		width: 20px;
		height: 20px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		background: var(--contrast-light);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.m-checkbox-icon {
		width: 9px;
		height: 5px;
		border-left: 2px solid var(--text-inverse);
		border-bottom: 2px solid var(--text-inverse);
		opacity: 0;
		transform: rotate(-45deg) translateY(-1px) scale(0.84);
		transition:
			opacity 0.12s ease,
			transform 0.12s ease;
	}

	.m-checkbox-input:focus-visible + .m-checkbox-box {
		border-color: var(--brand-primary);
		box-shadow: 0 0 0 2px var(--brand-primary);
	}

	.m-checkbox-input:checked + .m-checkbox-box {
		border-color: var(--text-primary);
		background: var(--text-primary);
	}

	.m-checkbox-input:checked + .m-checkbox-box .m-checkbox-icon {
		opacity: 1;
		transform: rotate(-45deg) translateY(-1px) scale(1);
	}

	&[data-size='sm'] {
		.m-checkbox-box {
			width: 18px;
			height: 18px;
		}

		.m-checkbox-label {
			font-size: var(--body-small);
			line-height: var(--body-small-line);
		}
	}

	&[data-state='error'] {
		.m-checkbox-box {
			border-color: var(--error);
		}
	}

	&[data-state='success'] {
		.m-checkbox-box {
			border-color: var(--success);
		}
	}

	&[data-disabled='true'] {
		cursor: not-allowed;
		color: var(--text-muted);

		.m-checkbox-label {
			cursor: not-allowed;
		}

		.m-checkbox-box {
			background: var(--bg-muted);
			border-color: var(--border-default);
		}
	}

	&--variant-minus {
		.m-checkbox-icon {
			width: 10px;
			height: 2px;
			border: 0;
			border-radius: 999px;
			background: var(--text-inverse);
			transform: scale(0.84);
		}

		.m-checkbox-input:checked + .m-checkbox-box .m-checkbox-icon {
			transform: scale(1);
		}
	}
}
</style>