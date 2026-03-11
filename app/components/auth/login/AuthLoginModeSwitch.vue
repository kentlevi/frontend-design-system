<script setup lang="ts">
import type { LoginMemberType } from '~/composables/auth/useLoginForm';

const { t } = useI18n();

defineProps<{
	memberType: LoginMemberType;
}>();

const emit = defineEmits<{
	(e: 'update:member-type', value: LoginMemberType): void;
}>();
</script>

<template>
	<div class="auth-login-segment" data-testid="auth-login-mode-switch">
		<UiButton
			variant="ghost"
			tone="neutral"
			size="sm"
			class="auth-login-segment-button"
			:class="{ 'auth-login-segment-button-active': memberType === 'member' }"
			:data-testid="
				memberType === 'member'
					? 'auth-login-mode-member-active-button'
					: 'auth-login-mode-member-inactive-button'
			"
			@click="emit('update:member-type', 'member')"
		>
			{{ t('auth.login.member') }}
		</UiButton>
		<UiButton
			variant="ghost"
			tone="neutral"
			size="sm"
			class="auth-login-segment-button"
			:class="{
				'auth-login-segment-button-active': memberType === 'non-member',
			}"
			:data-testid="
				memberType === 'non-member'
					? 'auth-login-mode-non-member-active-button'
					: 'auth-login-mode-non-member-inactive-button'
			"
			@click="emit('update:member-type', 'non-member')"
		>
			{{ t('auth.login.nonMember') }}
		</UiButton>
	</div>
</template>

<style lang="scss">
.auth-login-segment {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--brand-primary);
    border-radius: 999px;
    overflow: hidden;

    .auth-login-segment-button {
        --btn-soft: transparent;

        min-height: 38px;
        border-radius: 0;
        box-shadow: none;
        font-size: var(--type-size-100);
        font-weight: var(--font-weight-bold);
        line-height: var(--type-line-100);
        color: var(--text-primary);

        &:hover:not(:disabled) {
            --btn-soft: var(--gold-10);
        }

        &.auth-login-segment-button-active,
        &.auth-login-segment-button-active:hover:not(:disabled) {
            background: var(--brand-primary);
        }
    }
}
</style>