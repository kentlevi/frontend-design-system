<script setup lang="ts">
import { computed } from 'vue';
import UiIcon from '@/components/ui/Icon.vue';
import type { icons } from '~/data/ui/icons';
import type { StyleValue } from 'vue';

type Size = 'lg' | 'md' | 'sm';
type State = 'default' | 'error' | 'success';
type Icon = 'mail' | 'search' | 'user' | null;
type IconName = keyof typeof icons;

defineOptions({
    inheritAttrs: false,
});

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
const attrs = useAttrs();

const inputRef = ref<HTMLInputElement | null>(null);

const iconMap: Record<Exclude<Icon, null>, IconName> = {
    mail: 'strong-envelope',
    search: 'strong-search',
    user: 'strong-user',
};

const left_icon = computed<IconName | null>(() =>
    props.iconLeft ? iconMap[props.iconLeft] : null
);

const right_icon = computed<IconName | null>(() =>
    props.iconRight ? iconMap[props.iconRight] : null
);
const test_id = computed(() => String(attrs['data-testid'] || '').trim());
const root_attrs = computed(() => {
    const { class: className, style, 'data-testid': _testId } = attrs;
    return {
        class: className,
        style: style as StyleValue,
        ...(test_id.value ? { 'data-testid': test_id.value } : {}),
    };
});
const input_attrs = computed(() => {
    const { class: _className, style: _style, 'data-testid': _testId, ...rest } = attrs;
    return {
        ...rest,
        ...(test_id.value ? { 'data-testid': `${test_id.value}-control` } : {}),
    };
});

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
            ref="inputRef"
            class="ui-input-field"
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
