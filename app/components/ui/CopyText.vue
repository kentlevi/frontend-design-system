<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { copyTextToClipboard } from '@/utils/clipboard';

const props = defineProps<{
    text: string;
    as?: string;
}>();

const attrs = useAttrs();
const copied = ref(false);

async function copy() {
    try {
        await copyTextToClipboard(props.text);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 900);
    } catch {}
}

function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        copy();
    }
}
</script>

<template>
    <component
        :is="as || 'div'"
        v-bind="attrs"
        role="button"
        tabindex="0"
        :title="`Copy ${text}`"
        @click="copy"
        @keydown="onKeydown"
    >
        <slot />
    </component>

    <Teleport to="body">
        <transition name="ui-copy-toast">
            <div
                v-if="copied"
                class="ui-copy-toast"
                role="status"
                aria-live="polite"
            >
                <strong class="ui-copy-toast-text">{{ text }}</strong>
            </div>
        </transition>
    </Teleport>
</template>

<style scoped lang="scss">
.ui-copy-toast {
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    z-index: 1200;
    border-radius: 8px;
    border: 1px solid var(--border-default);
    background: var(--bg-surface);
    color: var(--text-primary);
    padding: 10px 12px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.14);
    font-size: 12px;
    line-height: 18px;
}

.ui-copy-toast-text {
    font-family: monospace;
    font-weight: 600;
}

.ui-copy-toast-enter-active,
.ui-copy-toast-leave-active {
    transition:
        opacity 0.16s ease,
        transform 0.16s ease;
}

.ui-copy-toast-enter-from,
.ui-copy-toast-leave-to {
    opacity: 0;
    transform: translate(-50%, 8px);
}
</style>
