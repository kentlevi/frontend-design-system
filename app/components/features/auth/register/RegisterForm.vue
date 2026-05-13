<script lang="ts" setup>
import MuInput from '~/components/base/MuInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import Checkbox from '~/components/ui/Checkbox.vue';
import { useRegisterCard } from '~/composables/features/account/orders/auth/register/useRegisterCard';

const {
	translate,

	register_form,
	show_password,
	togglePassword,

	first_name_error,
	first_name_error_message,
	email_error,
	email_error_message,
	password_error,
	password_error_message,
	terms_error,
	terms_error_message,
} = useRegisterCard();
</script>

<template>
	<MuLinearWrapper direction="column" gap="16px">
		<MuLinearWrapper direction="row" gap="16px" width="100%" class="auth-register-name-row">
			<MuLinearWrapper direction="column" gap="8px" width="100%">
				<MuLinearWrapper justify="space-between">
					<MuText weight="semi-bold">
						{{ translate('auth.register.firstName') }}
					</MuText>
					<MuText size="small" color="error">
						{{ first_name_error_message }}
					</MuText>
				</MuLinearWrapper>
				<MuInput
					:placeholder="translate('auth.register.enterFirstName')"
					type="text"
					name="first_name"
					id="register-first-name"
					:has-error="first_name_error"
					v-model="register_form.first_name"
				/>
			</MuLinearWrapper>

			<MuLinearWrapper direction="column" gap="8px" width="100%">
				<MuText weight="semi-bold">
					{{ translate('auth.register.lastNameOptionalLabel') }}
				</MuText>
				<MuInput
					:placeholder="translate('auth.register.enterLastName')"
					type="text"
					name="last_name"
					id="register-last-name"
					v-model="register_form.last_name"
				/>
			</MuLinearWrapper>
		</MuLinearWrapper>

		<MuLinearWrapper direction="column" gap="8px" width="100%">
			<MuLinearWrapper justify="space-between">
				<MuText weight="semi-bold">
					{{ translate('auth.register.email') }}
				</MuText>
				<MuText size="small" color="error">
					{{ email_error_message }}
				</MuText>
			</MuLinearWrapper>
			<MuInput
				:placeholder="translate('auth.register.enterEmail')"
				type="email"
				name="email"
				id="register-email"
				:has-error="email_error"
				v-model="register_form.email"
			/>
		</MuLinearWrapper>

		<MuLinearWrapper direction="column" gap="8px" width="100%">
			<MuLinearWrapper justify="space-between">
				<MuText weight="semi-bold">
					{{ translate('auth.register.password') }}
				</MuText>
				<MuText size="small" color="error">
					{{ password_error_message }}
				</MuText>
			</MuLinearWrapper>
			<MuInput
				:placeholder="translate('auth.register.enterPassword')"
				:type="show_password ? 'text' : 'password'"
				name="password"
				id="register-password"
				:has-error="password_error"
				v-model="register_form.password"
			>
				<template #inner-right>
					<UiButton
						variant="ghost"
						tone="neutral"
						size="sm"
						class="auth-register-password-toggle"
						:aria-label="translate('auth.login.togglePassword')"
						:sr-label="translate('auth.login.togglePassword')"
						icon-only
						:no-hover="true"
						:icon="show_password ? 'regular-eye' : 'regular-eye-slash'"
						:icon-size="24"
						@click="togglePassword"
					/>
				</template>
			</MuInput>
			<MuText size="small" color="var(--text-secondary)">
				{{ translate('auth.register.passwordHint') }}
			</MuText>
		</MuLinearWrapper>

		<MuLinearWrapper direction="column" gap="8px">
			<MuLinearWrapper justify="space-between" align="flex-start" gap="12px">
				<MuLinearWrapper direction="row" gap="8px" align="center">
					<Checkbox v-model="register_form.agree_terms" :has-error="terms_error" />
					<MuText size="small">
						{{ translate('auth.register.agreePrefix') }}
						<NuxtLink to="/terms-of-use" class="auth-register-policy-link">
							{{ translate('auth.register.terms') }}
						</NuxtLink>
						{{ translate('auth.register.and') }}
						<NuxtLink to="/privacy-policy" class="auth-register-policy-link">
							{{ translate('auth.register.privacy') }}
						</NuxtLink>.
					</MuText>
				</MuLinearWrapper>
				<MuText v-if="terms_error" size="small" color="error">
					{{ terms_error_message }}
				</MuText>
			</MuLinearWrapper>

			<MuLinearWrapper direction="row" gap="8px" align="center">
				<Checkbox v-model="register_form.opt_in_promos" />
				<MuText size="small">
					{{ translate('auth.register.promoOptIn') }}
				</MuText>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style lang="scss">
.auth-register-name-row {
	@media (max-width: 760px) {
		flex-direction: column;
	}
}

.auth-register-policy-link {
	color: var(--text-primary);
	font-weight: var(--font-weight-bold);
}
</style>
