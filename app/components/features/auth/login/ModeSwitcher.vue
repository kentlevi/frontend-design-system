<script setup lang="ts">
import { useLoginCard } from '~/composables/features/account/orders/auth/login/useLoginCard';

const { translate, member_type, setMemberType } = useLoginCard()
</script>

<template>
	<div class="auth-login-segment" data-testid="auth-login-mode-switch">
		<UiButton
			variant="ghost"
			tone="neutral"
			size="sm"
			class="auth-login-segment-button"
			:class="{ 'auth-login-segment-button-active': member_type === 'member' }"
			:data-testid="
				member_type === 'member'
					? 'auth-login-mode-member-active-button'
					: 'auth-login-mode-member-inactive-button'
			"
			@click="setMemberType('member')"
		>
			{{ translate('auth.login.member') }}
		</UiButton>
		<UiButton
			variant="ghost"
			tone="neutral"
			size="sm"
			class="auth-login-segment-button"
			:class="{
				'auth-login-segment-button-active': member_type === 'non-member',
			}"
			:data-testid="
				member_type === 'non-member'
					? 'auth-login-mode-non-member-active-button'
					: 'auth-login-mode-non-member-inactive-button'
			"
			@click="setMemberType('non-member')"
		>
			{{ translate('auth.login.nonMember') }}
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