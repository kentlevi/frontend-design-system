<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import ForgotPasswordModal from '~/components/features/account/profile/modals/ForgotPasswordModal.vue';
import SetupPasswordModal from '~/components/features/account/profile/modals/SetupPasswordModal.vue';
import { useForgotPasswordForm } from '~/composables/account/profile/useForgotPasswordForm';
import { usePasswordForm } from '~/composables/account/profile/usePasswordForm';
import { useSocialAccount } from '~/composables/account/profile/useSocialAccount';
import { useSetupPassword } from '~/composables/account/profile/useSetupPassword';

const { t: translate } = useI18n();
withDefaults(defineProps<{
	loading?: boolean;
}>(), {
	loading: false,
});
const { social } = useSocialAccount();

const {
	current_password,
	new_password,
	new_password_confirmation,
	current_password_error,
	pair_password_error,

	is_change_password_enabled,

	current_password_visible,
	new_password_visible,
	new_password_confirmation_visible,

	clearNewPasswordPairErrors,
	onChangePassword,
} = usePasswordForm()

const {
	setup_password_error,
	is_setup_password_enabled,
	setup_password,
	setup_password_confirmation,
	setup_password_visible,
	setup_password_confirmation_visible,
	is_setup_password_modal_open,
	has_password,

	clearSetupPasswordPairErrors,
	onSetupPassword,
	openSetupPasswordModal,
	closeSetupPasswordModal,
} = useSetupPassword()

const {
	is_forgot_password_modal_open,
	forgot_password_request_send,

	sendForgotPasswordEmail,
	closeForgotPasswordModal
} = useForgotPasswordForm()
</script>

<template>
	<div class="account-profile-section" data-testid="account-profile-password-section">
		<MuLinearWrapper v-if="loading" class="account-profile-section-copy" direction="column" :gap="4">
			<UiSkeleton width="92px" height="36px" border-radius="8px" />
			<UiSkeleton width="100%" height="20px" border-radius="8px" />
			<UiSkeleton width="86%" height="20px" border-radius="8px" />
		</MuLinearWrapper>
		<MuLinearWrapper v-else class="account-profile-section-copy" direction="column" :gap="4">
			<MuHeading class="account-profile-section-title">{{ translate('account.profile.password') }}</MuHeading>
			<MuText class="account-profile-section-description">{{ translate('account.profile.passwordDesc') }}</MuText>
		</MuLinearWrapper>

		<FeaturesAccountProfileContentPasswordSkeleton v-if="loading" />

		<FeaturesAccountProfileContentPasswordSetupPrompt
			v-else-if="social && !has_password"
			@open-setup="openSetupPasswordModal"
		/>

		<FeaturesAccountProfileContentPasswordChangeForm
			v-else
			v-model:current-password="current_password"
			v-model:new-password="new_password"
			v-model:new-password-confirmation="new_password_confirmation"
			v-model:current-password-visible="current_password_visible"
			v-model:new-password-visible="new_password_visible"
			v-model:new-password-confirmation-visible="new_password_confirmation_visible"
			v-model:current-password-error="current_password_error"
			:pair-password-error="pair_password_error"
			:is-change-password-enabled="is_change_password_enabled"
			@clear-pair-errors="clearNewPasswordPairErrors"
			@change-password="onChangePassword"
			@forgot-password="sendForgotPasswordEmail"
		/>
	</div>

	<ForgotPasswordModal
		:model-value="is_forgot_password_modal_open"
		:request-sent="forgot_password_request_send"
		@update:model-value="$event ? (is_forgot_password_modal_open = true) : closeForgotPasswordModal()"
		@close="closeForgotPasswordModal"
	/>

	<SetupPasswordModal
		:model-value="is_setup_password_modal_open"
		:password="setup_password"
		:password-confirmation="setup_password_confirmation"
		:password-error="setup_password_error"
		:password-visible="setup_password_visible"
		:password-confirmation-visible="setup_password_confirmation_visible"
		:is-submit-enabled="is_setup_password_enabled"
		@update:model-value="$event ? (is_setup_password_modal_open = true) : closeSetupPasswordModal()"
		@update:password="setup_password = $event"
		@update:password-confirmation="setup_password_confirmation = $event"
		@update:password-visible="setup_password_visible = $event"
		@update:password-confirmation-visible="setup_password_confirmation_visible = $event"
		@clear-errors="clearSetupPasswordPairErrors"
		@submit="onSetupPassword"
		@close="closeSetupPasswordModal"
	/>
</template>