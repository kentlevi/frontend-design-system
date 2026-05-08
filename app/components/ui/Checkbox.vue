<script setup lang="ts">
import UiIcon from '~/components/ui/Icon.vue';
import type { StyleValue } from 'vue';

type Size = 'md' | 'sm';
type State = 'default' | 'error' | 'success';

defineOptions({
    inheritAttrs: false,
});

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
const attrs = useAttrs();

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

function onChange(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).checked);
}
</script>

<template>
    <label
        v-bind="root_attrs"
        class="ui-checkbox"
        :data-size="props.size"
        :data-state="props.state !== 'default' ? props.state : null"
        :data-disabled="props.disabled || null"
    >
        <input
            v-bind="input_attrs"
            class="ui-checkbox-input"
            type="checkbox"
            :checked="props.modelValue"
            :disabled="props.disabled"
            @change="onChange"
        >
        <span class="ui-checkbox-box" aria-hidden="true">
            <UiIcon
                name="strong-check"
                :size="16"
                color="var(--text-inverse)"
                decorative
                class="ui-checkbox-icon"
            />
        </span>
        <span v-if="$slots.default || props.label" class="ui-checkbox-label">
            <slot>{{ props.label }}</slot>
        </span>
    </label>
</template>
