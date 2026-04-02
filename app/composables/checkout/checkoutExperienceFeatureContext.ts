import { inject, provide, type InjectionKey } from 'vue';
import type { useCheckoutExperience } from '~/composables/checkout/useCheckoutExperience';

export type CheckoutExperienceFeatureContext = ReturnType<typeof useCheckoutExperience>;

const checkout_experience_feature_context_key: InjectionKey<CheckoutExperienceFeatureContext> = Symbol('checkout-experience-feature-context');

export function provideCheckoutExperienceFeatureContext(context: CheckoutExperienceFeatureContext) {
	provide(checkout_experience_feature_context_key, context);
}

export function useCheckoutExperienceFeatureContext() {
	const context = inject(checkout_experience_feature_context_key);

	if (!context) {
		throw new Error('Checkout experience feature context is not available.');
	}

	return context;
}