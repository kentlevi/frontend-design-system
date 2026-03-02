<script setup lang="ts">
type State = 'default' | 'error' | 'success';

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        placeholder?: string;
        state?: State;
        readonly?: boolean;
        disabled?: boolean;
        maxLength?: number;
        rows?: number;
        resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    }>(),
    {
        modelValue: '',
        placeholder: '',
        state: 'default',
        readonly: false,
        disabled: false,
        maxLength: undefined,
        rows: 4,
        resize: 'vertical',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

function onInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLTextAreaElement).value);
}
</script>

<template>
    <div
        class="ui-textarea"
        :data-state="props.state !== 'default' ? props.state : null"
        :data-readonly="props.readonly || null"
        :data-disabled="props.disabled || null"
    >
        <textarea
            class="ui-textarea-field"
            :value="props.modelValue"
            :placeholder="props.placeholder"
            :readonly="props.readonly"
            :disabled="props.disabled"
            :maxlength="props.maxLength"
            :rows="props.rows"
            :style="{ resize: props.resize }"
            @input="onInput"
        />
    </div>
</template>
