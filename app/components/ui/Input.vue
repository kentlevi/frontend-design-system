<script setup lang="ts">
import { computed } from 'vue';

type Size = 'lg' | 'md' | 'sm';
type State = 'default' | 'error' | 'success';
type Icon = 'mail' | 'search' | 'user' | null;

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        placeholder?: string;
        size?: Size;
        state?: State;
        iconLeft?: Icon;
        iconRight?: Icon;
        disabled?: boolean;
    }>(),
    {
        modelValue: '',
        placeholder: '',
        size: 'md',
        state: 'default',
        iconLeft: null,
        iconRight: null,
        disabled: false,
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const iconMap: Record<string, string> = {
    mail: '✉',
    search: '🔍',
    user: '👤',
};

const leftIcon = computed(() =>
    props.iconLeft ? (iconMap[props.iconLeft] ?? '') : null
);

const rightIcon = computed(() =>
    props.iconRight ? (iconMap[props.iconRight] ?? '') : null
);

function onInput(e: Event) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
}
</script>

<template>
    <div
        class="ui-input"
        :data-size="size"
        :data-state="state !== 'default' ? state : null"
        :data-disabled="disabled || null"
    >
        <span v-if="leftIcon" class="ui-input-icon">
            <slot name="icon-left">{{ leftIcon }}</slot>
        </span>

        <input
            class="ui-input-field"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            @input="onInput"
        />

        <span v-if="rightIcon" class="ui-input-icon">
            <slot name="icon-right">{{ rightIcon }}</slot>
        </span>
    </div>
</template>
