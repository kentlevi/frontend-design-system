<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        label?: string;
        forId?: string;
        error?: string;
        hint?: string;
        required?: boolean;
        showRequiredMark?: boolean;
        inputId?: string;
        errorId?: string;
        hintId?: string;
        errorTestId?: string;
    }>(),
    {
        label: '',
        forId: '',
        error: '',
        hint: '',
        required: false,
        showRequiredMark: false,
        inputId: '',
        errorId: '',
        hintId: '',
        errorTestId: '',
    }
);

const fallbackId = useId();
const resolvedInputId = computed(() => props.inputId || props.forId || `field-${fallbackId}`);
const resolvedErrorId = computed(() => props.errorId || `${resolvedInputId.value}-error`);
const resolvedHintId = computed(() => props.hintId || `${resolvedInputId.value}-hint`);
const resolvedErrorTestId = computed(() => props.errorTestId || 'ui-form-field-error-message');
const describedBy = computed(() => {
    const ids: string[] = [];
    if (props.hint) ids.push(resolvedHintId.value);
    if (props.error) ids.push(resolvedErrorId.value);
    return ids.join(' ');
});
</script>

<template>
    <div class="ui-form-field">
        <div class="ui-form-field-head">
            <label v-if="label" :for="resolvedInputId" class="ui-form-field-label">
                <slot name="label" :required="required">
                    {{ label }}
                    <span
                        v-if="required && showRequiredMark"
                        class="ui-form-field-required"
                        aria-hidden="true"
                    >
                        *
                    </span>
                </slot>
            </label>
            <slot name="label-right">
                <span
                    v-if="error"
                    :id="resolvedErrorId"
                    class="ui-form-field-error"
                    :data-testid="resolvedErrorTestId"
                >
                    {{ error }}
                </span>
            </slot>
        </div>
        <slot
            :input-id="resolvedInputId"
            :described-by="describedBy"
            :error-id="resolvedErrorId"
            :hint-id="resolvedHintId"
            :required="required"
        />
        <slot name="hint" :hint-id="resolvedHintId">
            <p v-if="hint" :id="resolvedHintId" class="ui-form-field-hint">
                {{ hint }}
            </p>
        </slot>
    </div>
</template>

<style scoped lang="scss">
.ui-form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ui-form-field-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.ui-form-field-label {
    margin: 0;
}

.ui-form-field-required {
    margin-left: 2px;
}

.ui-form-field-error {
    display: block;
    overflow: visible;
    color: var(--error);
    font-size: var(--type-size-100);
    font-weight: var(--font-weight-semibold);
    line-height: var(--type-line-100);
}

.ui-form-field-hint {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
}
</style>
