<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const STORAGE_KEY = 'dev-onboarding-dismissed-v1';

const isVisible = ref(false);
const currentHost = computed(() => {
    if (typeof window === 'undefined') return 'localhost';
    return window.location.host;
});

function dismiss() {
    isVisible.value = false;
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, '1');
    }
}

onMounted(() => {
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === '1';
    isVisible.value = !dismissed;
});
</script>

<template>
    <div v-if="isVisible" class="dev-onboarding" role="dialog" aria-modal="true" aria-label="Developer onboarding">
        <div class="dev-onboarding-card">
            <p class="dev-onboarding-kicker">Development Mode</p>
            <h2 class="dev-onboarding-title">Local onboarding checklist</h2>
            <ul class="dev-onboarding-list">
                <li>App host: <code>{{ currentHost }}</code></li>
                <li>Use `npm run dev` to keep hot-reload enabled.</li>
                <li>For external testing, run tunnel against port `3000`.</li>
                <li>Guide pages are available at <code>/guide</code> (if enabled on this branch).</li>
            </ul>
            <div class="dev-onboarding-actions">
                <button type="button" class="dev-onboarding-button" @click="dismiss">
                    Dismiss
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dev-onboarding {
    position: fixed;
    inset: 0;
    z-index: 2200;
    background: rgba(8, 12, 20, 0.56);
    display: grid;
    place-items: center;
    padding: 24px;
}

.dev-onboarding-card {
    width: min(620px, 100%);
    border-radius: 16px;
    background: var(--bg-surface);
    color: var(--text-primary);
    border: 1px solid var(--border-default);
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
    padding: 24px;
}

.dev-onboarding-kicker {
    margin: 0;
    color: var(--text-secondary);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.dev-onboarding-title {
    margin: 8px 0 16px;
    font-size: 24px;
    line-height: 1.2;
}

.dev-onboarding-list {
    margin: 0 0 20px;
    padding-left: 20px;
    display: grid;
    gap: 8px;
}

.dev-onboarding-actions {
    display: flex;
    justify-content: flex-end;
}

.dev-onboarding-button {
    border: 1px solid var(--border-default);
    background: var(--button-filled-bg);
    color: var(--button-filled-text);
    border-radius: 10px;
    padding: 10px 14px;
    cursor: pointer;
    font-weight: 600;
}

.dev-onboarding-button:hover {
    filter: brightness(0.96);
}

code {
    background: var(--bg-muted);
    border-radius: 6px;
    padding: 1px 6px;
    font-size: 12px;
}
</style>
