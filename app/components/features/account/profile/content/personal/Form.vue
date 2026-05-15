<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useProfilePersonalForm } from '~/composables/account/profile/useProfilePersonalForm';
import { useProfilePersonalFormUI } from '~/composables/account/profile/useProfilePersonalFormUI';

const {
	email,
	social,

	form_state,
	field_errors,
	dynamic_profile_fields,
	has_changes,
	is_updating,

	submitPersonalForm,
	openEmailChangeModal,
} = useProfilePersonalForm()

const { translate } = useProfilePersonalFormUI()
</script>

<template>
	<div class="account-profile-grid" data-testid="account-profile-form">
		<div v-for="field in dynamic_profile_fields" :key="field.id">
			<UiFormField
				:error="field_errors[`fields.${field.field_key}`]"
				:label="field.field_label"
				:required="Boolean(field.is_required)"
			>
				<template #label>
					<span class="ui-form-field-label-text">{{ field.field_label }}</span>
					<span v-if="!field.is_required" class="account-profile-optional">
						({{ translate('account.profile.optional') }})
					</span>
				</template>
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						v-model="form_state.fields[field.field_key]"
						:state="field_errors[`fields.${field.field_key}`] ? 'error' : 'default'"
						type="text"
						:aria-describedby="describedBy || undefined"
						:data-testid="`account-profile-${field.field_key}`"
					/>
				</template>
			</UiFormField>
		</div>

		<UiFormField
			class="account-profile-grid-full"
			:label="translate('account.profile.emailAddress')"
			:required="true"
		>
			<template #default="{ inputId, describedBy }">
				<div class="account-profile-email-input-wrap">
					<UiInput
						:id="inputId"
						:model-value="email"
						type="email"
						:aria-describedby="describedBy || undefined"
						:disabled="true"
						input-class="account-profile-email-input-field--locked"
						data-testid="account-profile-email"
					/>
					<UiButton
						type="button"
						variant="ghost"
						tone="neutral"
						size="sm"
						:no-hover="true"
						class="account-profile-email-change-button"
						data-testid="account-profile-email-change-button"
						@click="openEmailChangeModal"
					>
						{{ translate('account.profile.change') }}
					</UiButton>
				</div>
				<MuText v-if="social" color="text-secondary" class="account-profile-email-helper-text">
					{{ translate('account.profile.socialLoginLinked', { provider: capitalizeFirst(social) }) }}
				</MuText>
			</template>
		</UiFormField>
	</div>

	<MuLinearWrapper class="account-profile-actions-right" data-testid="account-profile-save-wrap" justify="flex-end">
		<UiButton
			variant="filled"
			tone="neutral"
			size="md"
			:disabled="!has_changes || is_updating"
			data-testid="account-profile-save-button"
			@click="submitPersonalForm"
		>
			{{ translate('account.profile.saveChanges') }}
		</UiButton>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-profile-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;

	.account-profile-grid-full {
		grid-column: 1 / -1;
	}

	.account-profile-optional {
		color: var(--text-muted);
		font-weight: var(--font-weight-regular);
	}
}

.account-profile-email-helper-text {
	margin: 0;
}

.account-profile-social-text {
	color: var(--azure-base);
	font-weight: var(--font-weight-semibold);
}

.account-profile-email-input-wrap {
	position: relative;
}

.account-profile-email-change-button {
	position: absolute;
	top: 50%;
	right: 12px;
	transform: translateY(-50%);
	z-index: 1;
	min-height: 32px;
	padding: 0 8px;
	color: var(--text-primary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
	--btn-border: transparent;
}

:deep(.ui-input[data-disabled="true"] .ui-input-field.account-profile-email-input-field--locked) {
	padding-right: 92px;
	color: var(--text-primary);
}
</style>