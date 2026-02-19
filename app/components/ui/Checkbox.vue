<script setup lang="ts">
type Size = 'md' | 'sm';
type State = 'default' | 'error' | 'success';

const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        label?: string;
        disabled?: boolean;
        size?: Size;
        state?: State;
    }>(),
    {
        modelValue: false,
        label: '',
        disabled: false,
        size: 'md',
        state: 'default',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

function onChange(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).checked);
}
</script>

<template>
    <label
        class="ui-checkbox"
        :data-size="props.size"
        :data-state="props.state !== 'default' ? props.state : null"
        :data-disabled="props.disabled || null"
    >
        <input
            class="ui-checkbox-input"
            type="checkbox"
            :checked="props.modelValue"
            :disabled="props.disabled"
            @change="onChange"
        />
        <span class="ui-checkbox-box" aria-hidden="true" />
        <span v-if="$slots.default || props.label" class="ui-checkbox-label">
            <slot>{{ props.label }}</slot>
        </span>
    </label>
</template>
