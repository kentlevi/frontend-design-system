<template>
	<div
		class="m-radio-group"
		role="radiogroup"
		:aria-disabled="props.disabled || undefined"
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
type RadioModelValue = string | number | boolean | null
type RadioValue = string | number | boolean
type RadioSize = 'sm' | 'md'

interface Props {
	modelValue?: RadioModelValue
	name?: string
	disabled?: boolean
	size?: RadioSize
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: null,
	name: undefined,
	disabled: false,
	size: 'sm',
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: RadioModelValue): void
}>()

const selected_value = ref<RadioModelValue>(props.modelValue)

watch(
	() => props.modelValue,
	(value) => {
		selected_value.value = value
	},
)

function selectValue(value: RadioValue) {
	selected_value.value = value
	emit('update:modelValue', value)
}

provide('radio-group', {
	selected_value,
	selectValue,
	name: computed(() => props.name),
	disabled: computed(() => props.disabled),
	size: computed(() => props.size),
})
</script>