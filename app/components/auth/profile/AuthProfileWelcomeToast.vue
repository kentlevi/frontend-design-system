<script setup lang="ts">
withDefaults(
    defineProps<{
        visible: boolean;
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
    <Transition name="profile-toast">
        <div v-if="visible" class="auth-profile-toast" data-testid="auth-profile-toast">
            <UiIcon name="strong-check-circle" :size="18" />
            <span>{{ $t('auth.profile.toast') }}</span>
            <button type="button" data-testid="auth-profile-toast-close-button" @click="emit('close')">
                <UiIcon name="strong-times" :size="14" />
            </button>
        </div>
    </Transition>
</template>

<style lang="scss">
.auth-profile-toast {
    position: fixed;
    left: 50%;
    bottom: 120px;
    transform: translateX(-50%);
    background: var(--brand-primary);
    color: var(--text-primary);
    border-radius: 8px;
    border: 1px solid
        color-mix(in srgb, var(--brand-primary) 72%, var(--text-primary));
    min-width: 460px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    z-index: 30;

    button {
        border: 0;
        background: transparent;
        color: inherit;
        display: grid;
        place-items: center;
        cursor: pointer;
    }
}

.profile-toast-enter-active,
.profile-toast-leave-active {
    transition: opacity 0.2s ease;
}

.profile-toast-enter-from,
.profile-toast-leave-to {
    opacity: 0;
}

@media (max-width: 860px) {
    .auth-profile-toast {
        min-width: 0;
        width: calc(100vw - 24px);
        bottom: 84px;
    }
}
</style>
