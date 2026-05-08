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
		headClass?: string;
		labelClass?: string;
		labelTextClass?: string;
		errorClass?: string;
		hintClass?: string;
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
		headClass: '',
		labelClass: '',
		labelTextClass: '',
		errorClass: '',
		hintClass: '',
	}
);

const fallbackId = useId();
const resolved_input_id = computed(() => props.inputId || props.forId || `field-${fallbackId}`);
const resolved_error_id = computed(() => props.errorId || `${resolved_input_id.value}-error`);
const resolved_hint_id = computed(() => props.hintId || `${resolved_input_id.value}-hint`);
const resolved_error_test_id = computed(() => props.errorTestId || 'ui-form-field-error-message');
const described_by = computed(() => {
	const ids: string[] = [];
	if (props.hint) ids.push(resolved_hint_id.value);
	if (props.error) ids.push(resolved_error_id.value);
	return ids.join(' ');
});
</script>

<template>
	<div class="ui-form-field">
		<div :class="['ui-form-field-head', props.headClass]">
			<label v-if="label" :for="resolved_input_id" :class="['ui-form-field-label', props.labelClass]">
				<slot name="label" :required="required"><span :class="['ui-form-field-label-text', props.labelTextClass]">{{ label }}</span><span
					v-if="required && showRequiredMark"
					class="ui-form-field-required"
					aria-hidden="true"
				>*</span></slot>
			</label>
			<slot name="label-right">
				<span
					v-if="error"
					:id="resolved_error_id"
					:class="['ui-form-field-error', props.errorClass]"
					:data-testid="resolved_error_test_id"
				>
					{{ error }}
				</span>
			</slot>
		</div>
		<slot
			:input-id="resolved_input_id"
			:described-by="described_by"
			:error-id="resolved_error_id"
			:hint-id="resolved_hint_id"
			:required="required"
		/>
		<slot name="hint" :hint-id="resolved_hint_id">
			<p v-if="hint" :id="resolved_hint_id" :class="['ui-form-field-hint', props.hintClass]">
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

    display: inline-flex;
    align-items: center;
}

.ui-form-field-required {
    color: var(--error);
}

.ui-form-field-error {
    display: block;
    overflow: visible;
    color: var(--error);
    font-size: var(--type-size-100);
    font-weight: var(--font-weight-regular);
    line-height: var(--type-line-100);
}

.ui-form-field-hint {

    color: var(--text-secondary);
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
}
</style>