<script setup lang="ts">
import { computed } from 'vue';
import UiIcon from '@/components/ui/Icon.vue';
import type { icons } from '~/data/ui/icons';

type Size = 'lg' | 'md' | 'sm';
type State = 'default' | 'error' | 'success';
type Icon = 'mail' | 'search' | 'user' | null;
type IconName = keyof typeof icons;

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
        placeholder?: string;
        size?: Size;
        state?: State;
        iconLeft?: Icon;
        iconRight?: Icon;
        readonly?: boolean;
        disabled?: boolean;
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
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const iconMap: Record<Exclude<Icon, null>, IconName> = {
    mail: 'strong-envelope',
    search: 'strong-search',
    user: 'strong-user',
};

const leftIcon = computed<IconName | null>(() =>
    props.iconLeft ? iconMap[props.iconLeft] : null
);

const rightIcon = computed<IconName | null>(() =>
    props.iconRight ? iconMap[props.iconRight] : null
);

function onInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function focusInput() {
    if (props.disabled || props.readonly) return;
    inputRef.value?.focus();
}
</script>

<template>
    <div
        class="ui-input"
        :data-size="size"
        :data-state="state !== 'default' ? state : null"
        :data-readonly="readonly || null"
        :data-disabled="disabled || null"
        @click="focusInput"
    >
        <span v-if="$slots['icon-left'] || leftIcon" class="ui-input-icon">
            <slot name="icon-left">
                <UiIcon :name="leftIcon" :size="16" decorative />
            </slot>
        </span>

        <input
            ref="inputRef"
            class="ui-input-field"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :readonly="readonly"
            :disabled="disabled"
            @input="onInput"
        />

        <span v-if="$slots['icon-right'] || rightIcon" class="ui-input-icon">
            <slot name="icon-right">
                <UiIcon :name="rightIcon" :size="16" decorative />
            </slot>
        </span>
    </div>
</template>
