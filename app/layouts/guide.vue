<script setup lang="ts">
import { useRoute } from 'vue-router';
import { guides } from '@/data/guide/guides';

const route = useRoute();
const baseGuides = guides.filter((item) => item.category === 'base');
const coreGuides = guides.filter((item) => item.category === 'core');
</script>

<template>
    <div class="guide-layout">
        <aside class="guide-sidebar">
            <div class="guide-brand">
                <p class="guide-eyebrow">Design System</p>
                <h2 class="guide-heading">Guide</h2>
            </div>

            <nav class="guide-nav">
                <NuxtLink
                    :to="'/guide'"
                    class="guide-link guide-link-overview"
                    :class="{ 'is-active': route.path === '/guide' }"
                >
                    Overview
                </NuxtLink>

                <section class="guide-nav-group">
                    <p class="guide-nav-label">Base</p>
                    <NuxtLink
                        v-for="item in baseGuides"
                        :key="item.path"
                        :to="item.path"
                        class="guide-link"
                        :class="{
                            'is-active': route.path.startsWith(item.path),
                        }"
                    >
                        {{ item.title }}
                    </NuxtLink>
                </section>

                <section class="guide-nav-group">
                    <p class="guide-nav-label">Core</p>
                    <NuxtLink
                        v-for="item in coreGuides"
                        :key="item.path"
                        :to="item.path"
                        class="guide-link"
                        :class="{
                            'is-active': route.path.startsWith(item.path),
                        }"
                    >
                        {{ item.title }}
                    </NuxtLink>
                </section>
            </nav>
        </aside>

        <main class="guide-content">
            <NuxtPage />
        </main>
    </div>
</template>
