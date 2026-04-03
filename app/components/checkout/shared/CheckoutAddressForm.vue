<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Props {
	provinceOptions: Array<{ label: string; value: string }>;
	size?: 'sm' | 'md' | 'lg';
	hidePhone?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	size: 'md',
	hidePhone: false,
});

const fullName = defineModel<string>('fullName', { default: '' });
const company = defineModel<string>('company', { default: '' });
const address1 = defineModel<string>('address1', { default: '' });
const address2 = defineModel<string>('address2', { default: '' });
const province = defineModel<string>('province', { default: '' });
const city = defineModel<string>('city', { default: '' });
const postalCode = defineModel<string>('postalCode', { default: '' });
const phone = defineModel<string>('phone', { default: '' });

const { t } = useI18n();
</script>

<template>
	<div class="checkout-address-form">
		<div class="checkout-member-field-grid">
			<UiFormField :label="t('checkout.guest.fields.fullName.label')" :required="true" :show-required-mark="true" head-class="checkout-form-field-head" label-class="checkout-form-field-label" label-text-class="checkout-form-field-label-text">
				<UiInput v-model="fullName" :size="props.size" :placeholder="t('checkout.guest.fields.fullName.placeholder')" />
			</UiFormField>
			<UiFormField :label="t('checkout.guest.fields.company.label')" head-class="checkout-form-field-head" label-class="checkout-form-field-label" label-text-class="checkout-form-field-label-text">
				<UiInput v-model="company" :size="props.size" :placeholder="t('checkout.guest.fields.company.placeholder')" />
			</UiFormField>
		</div>
		<UiFormField :label="t('checkout.guest.fields.streetAddress.label')" :required="true" :show-required-mark="true" head-class="checkout-form-field-head" label-class="checkout-form-field-label" label-text-class="checkout-form-field-label-text">
			<div class="checkout-member-field-stack">
				<UiInput v-model="address1" :size="props.size" :placeholder="t('checkout.guest.fields.streetAddress.line1Placeholder')" />
				<UiInput v-model="address2" :size="props.size" :placeholder="t('checkout.guest.fields.streetAddress.line2Placeholder')" />
			</div>
		</UiFormField>

		<div class="checkout-member-field-grid">
			<UiFormField :label="t('checkout.guest.fields.city.label')" :required="true" :show-required-mark="true" head-class="checkout-form-field-head" label-class="checkout-form-field-label" label-text-class="checkout-form-field-label-text">
				<UiInput v-model="city" :size="props.size" :placeholder="t('checkout.guest.fields.city.placeholder')" />
			</UiFormField>
			<UiFormField
				:label="t('checkout.guest.fields.province.label')"
				:required="true"
				:show-required-mark="true"
				head-class="checkout-form-field-head"
				label-class="checkout-form-field-label"
				label-text-class="checkout-form-field-label-text"
			>
				<UiSelect
					v-model="province"
					:options="props.provinceOptions"
					:placeholder="t('checkout.guest.fields.province.placeholder')"
					class="checkout-member-select"
					trigger-class="checkout-member-select-trigger"
				/>
			</UiFormField>
		</div>

		<div class="checkout-member-field-grid">
			<UiFormField :label="t('checkout.guest.fields.postalCode.label')" :required="true" :show-required-mark="true" head-class="checkout-form-field-head" label-class="checkout-form-field-label" label-text-class="checkout-form-field-label-text">
				<UiInput v-model="postalCode" :size="props.size" :placeholder="t('checkout.guest.fields.postalCode.placeholder')" />
			</UiFormField>
			<UiFormField v-if="!props.hidePhone" :label="t('checkout.guest.fields.phone.label')" :required="true" :show-required-mark="true" head-class="checkout-form-field-head" label-class="checkout-form-field-label" label-text-class="checkout-form-field-label-text">
				<UiInput
					v-model="phone"
					:size="props.size"
					class="checkout-member-phone-input"
					input-class="checkout-member-phone-input-field"
					:placeholder="t('checkout.guest.fields.phone.placeholder')"
				/>
			</UiFormField>
		</div>
	</div>
</template>

<style scoped lang="scss">
.checkout-address-form {
	display: flex;
	flex-direction: column;
	gap: 14px;

	.checkout-member-field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}

	.checkout-member-field-stack {
		display: grid;
		gap: 14px;
	}

	.checkout-member-phone-input {
		width: 100%;
	}

	:deep(.checkout-member-select-trigger) {
		height: 40px;
		border: 1px solid var(--gray-40);
		border-radius: 8px;
		box-shadow: none;

		&:hover,
		&:focus-visible {
			border-color: var(--gray-60);
		}
	}
}

@media (max-width: 760px) {
	.checkout-address-form {
		.checkout-member-field-grid {
			grid-template-columns: 1fr;
		}
	}
}
</style>