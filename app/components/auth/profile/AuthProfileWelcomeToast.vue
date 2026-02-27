<script setup lang="ts">
withDefaults(
    defineProps<{
        visible?: boolean;
    }>(),
    {
        visible: false,
    }
);

const emit = defineEmits<{
    (event: 'close'): void;
}>();
</script>

<template>
    <UiToast
        :visible="visible"
        tone="success"
        :message="$t('auth.profile.toast')"
        data-testid="auth-profile-toast"
        @close="emit('close')"
    />
</template>
