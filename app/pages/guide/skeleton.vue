<script setup lang="ts">
import { ref } from 'vue';

const isLoading = ref(true);

const toggleLoading = () => {
    isLoading.value = !isLoading.value;
};
</script>

<template>
    <section class="guide-wrapper guide-skeleton">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">Skeleton</h1>
            <p class="guide-description">
                Loading placeholders that preserve layout while async content resolves.
            </p>
        </header>

        <section class="guide-section">
            <div class="guide-skeleton-toolbar">
                <UiBadge variant="tonal" :tone="isLoading ? 'warning' : 'success'">
                    {{ isLoading ? 'Loading state' : 'Loaded state' }}
                </UiBadge>
                <UiButton
                    size="sm"
                    tone="neutral"
                    variant="outline"
                    data-testid="skeleton-toggle-loading"
                    @click="toggleLoading"
                >
                    Toggle
                </UiButton>
            </div>
            <h2 class="guide-section-title">Card Skeleton</h2>
            <div
                class="guide-skeleton-grid"
                :data-testid="isLoading ? 'skeleton-list-loading' : 'skeleton-list-loaded'"
            >
                <template v-if="isLoading">
                    <article
                        v-for="index in 3"
                        :key="index"
                        class="guide-skeleton-card"
                        aria-hidden="true"
                        data-testid="skeleton-card-item"
                    >
                        <div class="guide-skeleton-media"></div>
                        <div class="guide-skeleton-line guide-skeleton-line-title"></div>
                        <div class="guide-skeleton-line"></div>
                        <div class="guide-skeleton-line guide-skeleton-line-short"></div>
                    </article>
                </template>
                <template v-else>
                    <article v-for="index in 3" :key="`loaded-${index}`" class="guide-loaded-card">
                        <div class="guide-loaded-card-media" aria-hidden="true"></div>
                        <h3>Sticker Pack {{ index }}</h3>
                        <p>Durable premium print with water-resistant finish.</p>
                        <UiButton size="sm" tone="neutral">View</UiButton>
                    </article>
                </template>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">List Skeleton</h2>
            <div class="guide-skeleton-list">
                <template v-if="isLoading">
                    <article
                        v-for="index in 4"
                        :key="`row-${index}`"
                        class="guide-skeleton-list-item"
                        aria-hidden="true"
                    >
                        <div class="guide-skeleton-avatar"></div>
                        <div class="guide-skeleton-list-copy">
                            <div class="guide-skeleton-line guide-skeleton-line-title"></div>
                            <div class="guide-skeleton-line guide-skeleton-line-short"></div>
                        </div>
                        <div class="guide-skeleton-pill"></div>
                    </article>
                </template>
                <template v-else>
                    <article
                        v-for="index in 4"
                        :key="`ready-row-${index}`"
                        class="guide-loaded-list-item"
                    >
                        <div class="guide-loaded-avatar"></div>
                        <div class="guide-loaded-list-copy">
                            <strong>Order #{{ 3100 + index }}</strong>
                            <p>Artwork approved and queued for print.</p>
                        </div>
                        <UiBadge variant="tonal" tone="success">Ready</UiBadge>
                    </article>
                </template>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Header Search Skeleton (Site Example)</h2>
            <div class="guide-header-search-demo">
                <template v-if="isLoading">
                    <div class="guide-header-search-skeleton" data-testid="guide-header-search-loading">
                        <article
                            v-for="index in 3"
                            :key="`header-skeleton-${index}`"
                            class="guide-header-search-skeleton-item"
                            :data-testid="`guide-header-search-loading-item-${index}`"
                            aria-hidden="true"
                        >
                            <div class="guide-header-search-skeleton-thumb" />
                            <div class="guide-header-search-skeleton-copy">
                                <div class="guide-header-search-skeleton-title" />
                                <div class="guide-header-search-skeleton-line" />
                            </div>
                        </article>
                    </div>
                </template>
                <template v-else>
                    <div class="guide-header-search-results">
                        <article
                            v-for="index in 3"
                            :key="`header-result-${index}`"
                            class="guide-header-search-result-item"
                        >
                            <div class="guide-header-search-result-thumb" />
                            <div class="guide-header-search-result-copy">
                                <strong>Sticker product result {{ index }}</strong>
                                <p>Fast turnaround and premium print finish.</p>
                            </div>
                        </article>
                    </div>
                </template>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-skeleton-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
}

.guide-skeleton-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.guide-skeleton-card,
.guide-skeleton-list-item {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background: var(--gray-10);
}

.guide-skeleton-card {
    padding: 14px;
    display: grid;
    gap: 10px;
}

.guide-skeleton-media,
.guide-skeleton-line,
.guide-skeleton-avatar,
.guide-skeleton-pill {
    background: linear-gradient(
        90deg,
        var(--gray-20) 25%,
        var(--gray-30) 37%,
        var(--gray-40) 63%
    );
    background-size: 300% 100%;
    animation: guide-skeleton-shimmer 1.1s linear infinite;
}

.guide-skeleton-media {
    height: 122px;
    border-radius: 10px;
}

.guide-skeleton-line {
    height: 10px;
    border-radius: 999px;
}

.guide-skeleton-line-title {
    width: 72%;
}

.guide-skeleton-line-short {
    width: 46%;
}

.guide-skeleton-list {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    overflow: hidden;
    background: var(--surface-card);
}

.guide-skeleton-list-item {
    border: 0;
    border-bottom: 1px solid var(--border-default);
    border-radius: 0;
    padding: 12px;
    display: grid;
    grid-template-columns: 42px 1fr 84px;
    align-items: center;
    gap: 12px;
}

.guide-skeleton-list-item:last-child {
    border-bottom: 0;
}

.guide-skeleton-avatar {
    width: 42px;
    height: 42px;
    border-radius: 10px;
}

.guide-skeleton-list-copy {
    display: grid;
    gap: 8px;
}

.guide-skeleton-pill {
    width: 84px;
    height: 20px;
    border-radius: 999px;
}

.guide-loaded-card {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background: var(--surface-card);
    padding: 14px;
    display: grid;
    gap: 10px;

    h3 {
        margin: 0;
        font-size: 16px;
        line-height: 28px;
        color: var(--text-primary);
    }

    p {
        margin: 0;
        font-size: 14px;
        line-height: 24px;
        color: var(--text-secondary);
    }
}

.guide-loaded-card-media {
    width: 100%;
    height: 122px;
    border-radius: 10px;
    background: var(--gray-20);
    border: 1px solid var(--gray-30);
}

.guide-loaded-list-item {
    border-bottom: 1px solid var(--border-default);
    padding: 12px;
    display: grid;
    grid-template-columns: 42px 1fr auto;
    align-items: center;
    gap: 12px;
}

.guide-loaded-list-item:last-child {
    border-bottom: 0;
}

.guide-loaded-avatar {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: var(--gray-20);
    border: 1px solid var(--gray-30);
}

.guide-loaded-list-copy {
    display: grid;
    gap: 4px;

    strong {
        font-size: 14px;
        line-height: 20px;
        color: var(--text-primary);
    }

    p {
        margin: 0;
        font-size: 13px;
        line-height: 18px;
        color: var(--text-secondary);
    }
}

.guide-header-search-demo {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background: var(--surface-card);
    overflow: hidden;
}

.guide-header-search-skeleton {
    display: grid;
    gap: 12px;
    padding: 20px;
}

.guide-header-search-skeleton-item,
.guide-header-search-result-item {
    min-height: 128px;
    border-radius: 12px;
    background: var(--gray-10);
    padding: 20px 24px;
    display: grid;
    grid-template-columns: 100px 1fr;
    align-items: center;
    gap: 20px;
}

.guide-header-search-skeleton-thumb,
.guide-header-search-skeleton-title,
.guide-header-search-skeleton-line {
    border-radius: 8px;
    background: linear-gradient(
        90deg,
        var(--gray-20) 25%,
        var(--gray-30) 37%,
        var(--gray-40) 63%
    );
    background-size: 300% 100%;
    animation: guide-skeleton-shimmer 1.1s linear infinite;
}

.guide-header-search-skeleton-thumb,
.guide-header-search-result-thumb {
    width: 100px;
    height: 100px;
    border-radius: 8px;
}

.guide-header-search-skeleton-copy,
.guide-header-search-result-copy {
    min-width: 0;
    display: grid;
    gap: 18px;
}

.guide-header-search-skeleton-title {
    width: min(44%, 320px);
    height: 50px;
}

.guide-header-search-skeleton-line {
    width: 100%;
    height: 34px;
}

.guide-header-search-results {
    display: grid;
    gap: 12px;
    padding: 20px;
}

.guide-header-search-result-thumb {
    background: var(--gray-20);
    border: 1px solid var(--gray-30);
}

.guide-header-search-result-copy {
    gap: 8px;

    strong {
        font-size: 16px;
        line-height: 24px;
        color: var(--text-primary);
    }

    p {
        margin: 0;
        font-size: 14px;
        line-height: 22px;
        color: var(--text-secondary);
    }
}

@media (max-width: 767px) {
    .guide-header-search-skeleton-item,
    .guide-header-search-result-item {
        padding: 14px;
        grid-template-columns: 72px 1fr;
        gap: 12px;
        min-height: 104px;
    }

    .guide-header-search-skeleton-thumb,
    .guide-header-search-result-thumb {
        width: 72px;
        height: 72px;
    }

    .guide-header-search-skeleton-title {
        width: min(72%, 240px);
        height: 28px;
    }

    .guide-header-search-skeleton-line {
        height: 20px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .guide-skeleton-media,
    .guide-skeleton-line,
    .guide-skeleton-avatar,
    .guide-skeleton-pill,
    .guide-header-search-skeleton-thumb,
    .guide-header-search-skeleton-title,
    .guide-header-search-skeleton-line {
        animation: none;
    }
}

@keyframes guide-skeleton-shimmer {
    0% {
        background-position: 100% 50%;
    }

    100% {
        background-position: -100% 50%;
    }
}
</style>
