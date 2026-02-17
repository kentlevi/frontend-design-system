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
    <div class="auth-login-segment">
        <button
            type="button"
            :class="{ active: memberType === 'member' }"
            @click="emit('update:memberType', 'member')"
        >
            {{ t('auth.login.member') }}
        </button>
        <button
            type="button"
            :class="{ active: memberType === 'non-member' }"
            @click="emit('update:memberType', 'non-member')"
        >
            {{ t('auth.login.nonMember') }}
        </button>
    </div>
</template>
