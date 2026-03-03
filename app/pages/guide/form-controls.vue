<script setup lang="ts">
import { computed, ref } from 'vue';
import GuideCopy from '@/components/guide/GuideCopy.vue';
import UiCheckbox from '@/components/ui/Checkbox.vue';
import UiInput from '@/components/ui/Input.vue';
import UiSelect from '@/components/ui/Select.vue';
import UiTextarea from '@/components/ui/Textarea.vue';

const inputValue = ref('');
const textareaValue = ref('');
const validationInputSuccess = ref('hello@musticker.com');
const validationInputError = ref('invalid-email');
const validationTextareaError = ref('Need at least 20 characters.');
const inputReadonlyValue = ref('Readonly value');
const textareaReadonlyValue = ref('Readonly notes');
const textareaCountValue = ref('');
const textareaCountLimit = 120;
const selectedSize = ref<string | number>('md');
const selectedToken = ref<string | number>('text-primary');
const copyMode = ref<'off' | 'on'>('off');
const checkboxA = ref(false);
const checkboxB = ref(true);
const textareaCount = computed(() => textareaCountValue.value.length);
const textareaCountTone = computed(() =>
    textareaCount.value >= textareaCountLimit - 20
        ? 'guide-form-controls-helper-warning'
        : ''
);

function onCopyModeClick(nextMode: 'off' | 'on') {
    copyMode.value =
        copyMode.value === nextMode
            ? nextMode === 'on'
                ? 'off'
                : 'on'
            : nextMode;
}

const sizeOptions = [
    { label: 'Small', value: 'sm', description: 'Compact controls' },
    { label: 'Medium', value: 'md', description: 'Default size' },
    { label: 'Large', value: 'lg', description: 'Spacious controls' },
];

const tokenOptions = [
    { label: 'bg-page', value: 'bg-page' },
    { label: 'bg-surface', value: 'bg-surface' },
    { label: 'bg-muted', value: 'bg-muted' },
    { label: 'bg-inverse', value: 'bg-inverse' },
    { label: 'text-primary', value: 'text-primary' },
    { label: 'text-secondary', value: 'text-secondary' },
    { label: 'text-muted', value: 'text-muted' },
    { label: 'brand-primary', value: 'brand-primary' },
];
</script>

<template>
    <section class="guide-wrapper guide-form-controls">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Form Controls</h1>
            <p class="guide-description">
                Reusable input, textarea, and checkbox controls for auth and forms.
            </p>
            <div class="guide-form-controls-copy-toggle">
                <div class="guide-form-controls-copy-switch" role="radiogroup" aria-label="Copy mode">
                    <span
                        class="guide-form-controls-copy-switch-indicator"
                        :class="{ 'is-copy': copyMode === 'on' }"
                        aria-hidden="true"
                    />
                    <button
                        type="button"
                        class="guide-form-controls-copy-switch-option"
                        :class="{ 'is-active': copyMode === 'off' }"
                        role="radio"
                        :aria-checked="copyMode === 'off'"
                        @click="onCopyModeClick('off')"
                    >
                        OFF
                    </button>
                    <button
                        type="button"
                        class="guide-form-controls-copy-switch-option"
                        :class="{ 'is-active': copyMode === 'on' }"
                        role="radio"
                        :aria-checked="copyMode === 'on'"
                        @click="onCopyModeClick('on')"
                    >
                        COPY
                    </button>
                </div>
            </div>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Input</h2>
            <div class="guide-grid guide-grid-auto guide-grid-min-240">
                <GuideCopy
                    component="UiInput"
                    :props="{ placeholder: 'Email address' }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiInput v-model="inputValue" placeholder="Email address" />
                </GuideCopy>

                <GuideCopy
                    component="UiInput"
                    :props="{ placeholder: 'Search', iconLeft: 'search' }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiInput placeholder="Search" icon-left="search" />
                </GuideCopy>

                <GuideCopy
                    component="UiInput"
                    :props="{ placeholder: 'Field error', state: 'error' }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiInput placeholder="Field error" state="error" />
                </GuideCopy>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Validation + Helper Text</h2>
            <div class="guide-grid guide-grid-auto guide-grid-min-240">
                <GuideCopy
                    component="UiInput"
                    :props="{
                        modelValue: validationInputSuccess,
                        state: 'success',
                        placeholder: 'Email address',
                    }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <div class="guide-form-controls-field">
                        <UiInput
                            v-model="validationInputSuccess"
                            state="success"
                            placeholder="Email address"
                        />
                        <p class="guide-form-controls-helper guide-form-controls-helper-success">
                            Looks good. You can continue.
                        </p>
                    </div>
                </GuideCopy>

                <GuideCopy
                    component="UiInput"
                    :props="{
                        modelValue: validationInputError,
                        state: 'error',
                        placeholder: 'Email address',
                    }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <div class="guide-form-controls-field">
                        <UiInput
                            v-model="validationInputError"
                            state="error"
                            placeholder="Email address"
                        />
                        <p class="guide-form-controls-helper guide-form-controls-helper-error">
                            Enter a valid email format.
                        </p>
                    </div>
                </GuideCopy>

                <GuideCopy
                    component="UiTextarea"
                    :props="{
                        modelValue: validationTextareaError,
                        state: 'error',
                        placeholder: 'Write details',
                    }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <div class="guide-form-controls-field">
                        <UiTextarea
                            v-model="validationTextareaError"
                            state="error"
                            placeholder="Write details"
                        />
                        <p class="guide-form-controls-helper guide-form-controls-helper-error">
                            Add more detail before submitting.
                        </p>
                    </div>
                </GuideCopy>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Textarea</h2>
            <div class="guide-grid guide-grid-auto guide-grid-min-240">
                <GuideCopy
                    component="UiTextarea"
                    :props="{ placeholder: 'Special instructions...' }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiTextarea
                        v-model="textareaValue"
                        placeholder="Special instructions..."
                    />
                </GuideCopy>

                <GuideCopy
                    component="UiTextarea"
                    :props="{ placeholder: 'Field error', state: 'error' }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiTextarea placeholder="Field error" state="error" />
                </GuideCopy>

                <GuideCopy
                    component="UiTextarea"
                    :props="{ placeholder: 'Disabled', disabled: true }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiTextarea placeholder="Disabled" :disabled="true" />
                </GuideCopy>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Readonly vs Disabled</h2>
            <div class="guide-grid guide-grid-auto guide-grid-min-240">
                <GuideCopy
                    component="UiInput"
                    :props="{ modelValue: inputReadonlyValue, readonly: true }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <div class="guide-form-controls-field">
                        <UiInput v-model="inputReadonlyValue" :readonly="true" />
                        <p class="guide-form-controls-helper">
                            Readonly: value can be selected and copied.
                        </p>
                    </div>
                </GuideCopy>

                <GuideCopy
                    component="UiInput"
                    :props="{ modelValue: 'Disabled value', disabled: true }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <div class="guide-form-controls-field">
                        <UiInput model-value="Disabled value" :disabled="true" />
                        <p class="guide-form-controls-helper">
                            Disabled: not interactive.
                        </p>
                    </div>
                </GuideCopy>

                <GuideCopy
                    component="UiTextarea"
                    :props="{
                        modelValue: textareaReadonlyValue,
                        readonly: true,
                    }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <div class="guide-form-controls-field">
                        <UiTextarea
                            v-model="textareaReadonlyValue"
                            :readonly="true"
                        />
                        <p class="guide-form-controls-helper">
                            Readonly textarea supports text selection.
                        </p>
                    </div>
                </GuideCopy>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Character Count</h2>
            <div class="guide-grid guide-grid-auto guide-grid-min-240">
                <GuideCopy
                    component="UiTextarea"
                    :props="{
                        modelValue: textareaCountValue,
                        maxLength: textareaCountLimit,
                    }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <div class="guide-form-controls-field">
                        <UiTextarea
                            v-model="textareaCountValue"
                            placeholder="Special instructions..."
                            :max-length="textareaCountLimit"
                        />
                        <p
                            class="guide-form-controls-helper"
                            :class="textareaCountTone"
                        >
                            {{ textareaCount }} / {{ textareaCountLimit }} characters
                        </p>
                    </div>
                </GuideCopy>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Select</h2>
            <div class="guide-grid guide-grid-auto guide-grid-min-240">
                <GuideCopy
                    component="UiSelect"
                    :props="{
                        modelValue: selectedSize,
                        options: sizeOptions,
                    }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiSelect
                        v-model="selectedSize"
                        :options="sizeOptions"
                        placeholder="Select size"
                    />
                </GuideCopy>

                <GuideCopy
                    component="UiSelect"
                    :props="{
                        modelValue: selectedToken,
                        options: tokenOptions,
                        searchable: true,
                    }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiSelect
                        v-model="selectedToken"
                        :options="tokenOptions"
                        :searchable="true"
                        placeholder="Search var or hex"
                    />
                </GuideCopy>

                <GuideCopy
                    component="UiSelect"
                    :props="{
                        options: sizeOptions,
                        disabled: true,
                    }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiSelect
                        :model-value="null"
                        :options="sizeOptions"
                        :disabled="true"
                        placeholder="Disabled"
                    />
                </GuideCopy>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Checkbox</h2>
            <div class="guide-grid guide-grid-auto guide-grid-min-240">
                <GuideCopy
                    component="UiCheckbox"
                    :props="{ label: 'Remember me' }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiCheckbox v-model="checkboxA" label="Remember me" />
                </GuideCopy>

                <GuideCopy
                    component="UiCheckbox"
                    :props="{ label: 'Subscribe to updates', modelValue: true }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiCheckbox
                        v-model="checkboxB"
                        label="Subscribe to updates"
                    />
                </GuideCopy>

                <GuideCopy
                    component="UiCheckbox"
                    :props="{ label: 'Disabled option', disabled: true }"
                    :copy-enabled="copyMode === 'on'"
                >
                    <UiCheckbox label="Disabled option" :disabled="true" />
                </GuideCopy>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-form-controls {
    .guide-form-controls-field {
        width: 100%;
        display: grid;
        gap: 8px;
    }

    .guide-form-controls-helper {
        margin: 0;
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--text-secondary);
    }

    .guide-form-controls-helper-success {
        color: var(--success);
    }

    .guide-form-controls-helper-error {
        color: var(--error);
    }

    .guide-form-controls-helper-warning {
        color: var(--brand-primary);
    }

    .guide-form-controls-copy-toggle {
        margin-top: 12px;
        display: inline-flex;
        align-items: center;
        gap: 14px;
    }

    .guide-form-controls-copy-switch {
        position: relative;
        display: inline-grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        padding: 4px;
        border-radius: 999px;
        border: 1px solid var(--border-default);
        background: var(--bg-muted);
        width: fit-content;
        overflow: hidden;
    }

    .guide-form-controls-copy-switch-indicator {
        position: absolute;
        top: 4px;
        left: 4px;
        width: calc((100% - 8px) / 2);
        height: calc(100% - 8px);
        border-radius: 999px;
        background: var(--bg-page);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        transition: transform 0.22s ease;
    }

    .guide-form-controls-copy-switch-indicator.is-copy {
        transform: translateX(100%);
    }

    .guide-form-controls-copy-switch-option {
        min-width: 64px;
        height: 30px;
        position: relative;
        z-index: 1;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: var(--text-secondary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition:
            background 0.2s ease,
            color 0.2s ease,
            box-shadow 0.2s ease;

        &.is-active {
            color: var(--text-primary);
            font-weight: var(--font-weight-semibold);
        }
    }

    :deep(.guide-copy) {
        width: 100%;
        justify-content: flex-start;
        overflow: visible;
    }

    :deep(.guide-copy:hover) {
        transform: none;
        opacity: 1;
    }

    :deep(.ui-select) {
        width: 100%;
    }

    :deep(.ui-select-menu) {
        z-index: 300;
    }

    :deep(.guide-copy :disabled) {
        pointer-events: none;
    }
}
</style>
