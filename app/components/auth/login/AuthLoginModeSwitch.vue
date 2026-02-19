<script setup lang="ts">
import type { LoginMemberType } from '@/composables/auth/useLoginForm';

const { t } = useI18n();

defineProps<{
    memberType: LoginMemberType;
}>();

const emit = defineEmits<{
    (e: 'update:memberType', value: LoginMemberType): void;
}>();
</script>

<template>
    <div class="auth-login-segment" data-testid="auth-login-mode-switch">
        <button
            type="button"
            class="auth-login-segment-button"
            :class="{ 'auth-login-segment-button-active': memberType === 'member' }"
            data-testid="auth-login-mode-member"
            @click="emit('update:memberType', 'member')"
        >
            {{ t('auth.login.member') }}
        </button>
        <button
            type="button"
            class="auth-login-segment-button"
            :class="{
                'auth-login-segment-button-active': memberType === 'non-member',
            }"
            data-testid="auth-login-mode-non-member"
            @click="emit('update:memberType', 'non-member')"
        >
            {{ t('auth.login.nonMember') }}
        </button>
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
        height: 50px;
        border: 0;
        background: transparent;
        font-size: 14px;
        font-weight: 700;
        color: var(--text-primary);
        cursor: pointer;

        &.auth-login-segment-button-active {
            background: var(--brand-primary);
        }
    }
}
</style>
