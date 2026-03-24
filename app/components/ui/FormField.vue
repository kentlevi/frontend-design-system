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
		<div :class="['ui-form-field-head', props.headClass]">
			<label v-if="label" :for="resolvedInputId" :class="['ui-form-field-label', props.labelClass]">
				<slot name="label" :required="required"><span :class="['ui-form-field-label-text', props.labelTextClass]">{{ label }}</span><span
					v-if="required && showRequiredMark"
					class="ui-form-field-required"
					aria-hidden="true"
				>*</span></slot>
			</label>
			<slot name="label-right">
				<span
					v-if="error"
					:id="resolvedErrorId"
					:class="['ui-form-field-error', props.errorClass]"
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
			<p v-if="hint" :id="resolvedHintId" :class="['ui-form-field-hint', props.hintClass]">
				{{ hint }}
			</p>
		</slot>
	</div>
</template>