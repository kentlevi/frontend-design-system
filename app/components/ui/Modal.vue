<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        title?: string;
        closeOnBackdrop?: boolean;
        closeOnEsc?: boolean;
        width?: string;
        padding?: string;
        gap?: string;
        align?: 'top' | 'center';
        modalClass?: string;
    }>(),
    {
        modelValue: false,
        title: '',
        closeOnBackdrop: true,
        closeOnEsc: true,
        width: '560px',
        padding: '40px',
        gap: '18px',
        align: 'top',
        modalClass: '',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'close'): void;
}>();

const modalStyle = computed(() => ({
    '--ui-modal-width': props.width,
    '--ui-modal-padding': props.padding,
    '--ui-modal-gap': props.gap,
}));

function closeModal() {
    emit('update:modelValue', false);
    emit('close');
}

function onBackdropClick(event: MouseEvent) {
    if (!props.closeOnBackdrop) return;
    if (event.target !== event.currentTarget) return;
    closeModal();
}

function onKeydown(event: KeyboardEvent) {
    if (!props.closeOnEsc || !props.modelValue) return;
    if (event.key !== 'Escape') return;
    closeModal();
}

watch(
    () => props.modelValue,
    (isOpen) => {
        if (typeof document === 'undefined') return;
        document.body.classList.toggle('has-ui-modal-open', Boolean(isOpen));
    }
);

onMounted(() => {
    window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
    if (typeof document !== 'undefined') {
        document.body.classList.remove('has-ui-modal-open');
    }
});
</script>

<template>
    <Teleport to="body">
        <Transition name="ui-modal-fade">
            <div
                v-if="modelValue"
                class="ui-modal-overlay"
                :class="{ 'ui-modal-overlay--center': align === 'center' }"
                role="presentation"
                @click="onBackdropClick"
            >
                <div
                    :class="['ui-modal', modalClass]"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="title || 'Modal'"
                    :style="modalStyle"
                >
                    <header
                        v-if="title || $slots.header || $slots.actions"
                        class="ui-modal-header"
                    >
                        <div class="ui-modal-header-main">
                            <slot name="header">
                                <h3 v-if="title" class="ui-modal-title">
                                    {{ title }}
                                </h3>
                            </slot>
                        </div>

                        <div class="ui-modal-header-actions">
                            <slot name="actions" />
                            <button
                                type="button"
                                class="ui-modal-close"
                                aria-label="Close modal"
                                @click="closeModal"
                            >
                                <UiIcon
                                    name="regular-times"
                                    :size="24"
                                    color="#000000"
                                />
                            </button>
                        </div>
                    </header>

                    <div class="ui-modal-body">
                        <slot />
                    </div>

                    <footer v-if="$slots.footer" class="ui-modal-footer">
                        <slot name="footer" />
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
