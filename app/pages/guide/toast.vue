<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import UiToast from '@/components/ui/Toast.vue';
import { copyTextToClipboard } from '@/utils/clipboard';

type ToastTone = 'primary' | 'success' | 'warning' | 'error' | 'info';

const tone = ref<ToastTone>('primary');
const message = ref('Your password has been successfully updated.');
const dismissible = ref(true);
const visible = ref(false);
const durationMs = ref(3500);
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let copiedTimer: ReturnType<typeof setTimeout> | null = null;
const copied = ref(false);
const copiedText = ref('');

const toneOptions: Array<{ label: string; value: ToastTone }> = [
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'warning', value: 'warning' },
    { label: 'error', value: 'error' },
    { label: 'info', value: 'info' },
];

const snippet = computed(
    () =>
        `<UiToast :visible="true" tone="${tone.value}" :dismissible="${dismissible.value}" message="${message.value}" />`
);

const durationModel = computed<string>({
    get: () => String(durationMs.value),
    set: (value) => {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
            durationMs.value = parsed;
        }
    },
});

function clearHideTimer() {
    if (!hideTimer) return;
    clearTimeout(hideTimer);
    hideTimer = null;
}

function clearCopiedTimer() {
    if (!copiedTimer) return;
    clearTimeout(copiedTimer);
    copiedTimer = null;
}

function showToast() {
    clearHideTimer();
    visible.value = true;

    if (durationMs.value <= 0) return;
    hideTimer = setTimeout(() => {
        visible.value = false;
    }, durationMs.value);
}

function hideToast() {
    clearHideTimer();
    visible.value = false;
}

async function copySnippet() {
    try {
        await copyTextToClipboard(snippet.value);
        copiedText.value = snippet.value;
        copied.value = true;
        clearCopiedTimer();
        copiedTimer = setTimeout(() => {
            copied.value = false;
            copiedText.value = '';
        }, 1000);
    } catch {}
}

function previewTone(nextTone: ToastTone, nextMessage: string) {
    tone.value = nextTone;
    message.value = nextMessage;
    showToast();
}

function getVariantMessage(label: string) {
    return `${label} message`;
}

onBeforeUnmount(() => {
    clearHideTimer();
    clearCopiedTimer();
});
</script>

<template>
    <section class="guide-wrapper guide-toast">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Toast</h1>
            <p class="guide-description">
                Lightweight, non-blocking feedback for success, warning,
                informational, and error updates.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Variants</h2>
            <div class="guide-row">
                <UiButton
                    v-for="option in toneOptions"
                    :key="option.value"
                    variant="outline"
                    tone="neutral"
                    size="md"
                    class="guide-toast-trigger"
                    :data-swatch-tone="option.value"
                    @click="previewTone(option.value, getVariantMessage(option.label))"
                >
                    <span>Show {{ option.label }}</span>
                    <span class="guide-toast-trigger-swatch" aria-hidden="true" />
                </UiButton>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Interactive Playground</h2>
            <div class="guide-toast-playground">
                <label class="guide-toast-control">
                    <span>Tone</span>
                    <UiSelect v-model="tone" :options="toneOptions" />
                </label>

                <label class="guide-toast-control">
                    <span>Message</span>
                    <UiInput v-model="message" type="text" />
                </label>

                <label class="guide-toast-control">
                    <span>Auto-hide (ms)</span>
                    <UiInput v-model="durationModel" type="text" />
                </label>

                <label class="guide-toast-control guide-toast-control--checkbox">
                    <span>Dismissible</span>
                    <UiCheckbox v-model="dismissible" />
                </label>

                <div class="guide-toast-actions">
                    <UiButton variant="filled" tone="neutral" size="md" @click="showToast">
                        Show Toast
                    </UiButton>
                    <UiButton variant="outline" tone="neutral" size="md" @click="hideToast">
                        Hide Toast
                    </UiButton>
                    <UiButton variant="outline" tone="neutral" size="md" @click="copySnippet">
                        Copy Toast Snippet
                    </UiButton>
                </div>
            </div>
        </section>

        <UiToast
            :visible="visible"
            :tone="tone"
            :message="message"
            :dismissible="dismissible"
            @close="hideToast"
        />

        <Teleport to="body">
            <transition name="guide-copy-toast">
                <div
                    v-if="copied && copiedText"
                    class="guide-copy-toast"
                    role="status"
                    aria-live="polite"
                >
                    <strong class="guide-copy-toast-text">{{ copiedText }}</strong>
                </div>
            </transition>
        </Teleport>
    </section>
</template>

<style scoped lang="scss">
.guide-toast-playground {
    display: grid;
    gap: 12px;
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 14px;
    background: var(--bg-surface);
}

.guide-toast-control {
    display: grid;
    gap: 6px;
    font-size: 12px;
    line-height: 16px;
    color: var(--text-secondary);
}

.guide-toast-control--checkbox {
    width: fit-content;
}

.guide-toast-actions {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 8px;
}

.guide-toast-trigger {
    min-width: 120px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.guide-toast-trigger-swatch {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--text-muted);
}

.guide-toast-trigger[data-swatch-tone='primary'] .guide-toast-trigger-swatch {
    background: var(--brand-primary);
}

.guide-toast-trigger[data-swatch-tone='success'] .guide-toast-trigger-swatch {
    background: var(--success);
}

.guide-toast-trigger[data-swatch-tone='warning'] .guide-toast-trigger-swatch {
    background: #f59e0b;
}

.guide-toast-trigger[data-swatch-tone='error'] .guide-toast-trigger-swatch {
    background: #ef4444;
}

.guide-toast-trigger[data-swatch-tone='info'] .guide-toast-trigger-swatch {
    background: #3b82f6;
}

</style>
