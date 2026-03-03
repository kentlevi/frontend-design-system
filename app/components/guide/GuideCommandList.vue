<script setup lang="ts">
import GuideCopy from '@/components/guide/GuideCopy.vue';

defineProps<{
    title?: string;
    commands: string[];
    testidPrefix?: string;
}>();
</script>

<template>
    <article class="guide-command-list">
        <h3 v-if="title" class="guide-command-title">{{ title }}</h3>
        <ul class="guide-command-items">
            <li
                v-for="(command, index) in commands"
                :key="`${command}-${index}`"
                class="guide-command-item"
            >
                <GuideCopy :text="command">
                    <code :data-testid="`${testidPrefix ?? 'guide-command'}-${index}`">{{ command }}</code>
                </GuideCopy>
            </li>
        </ul>
    </article>
</template>

<style scoped lang="scss">
.guide-command-list {
    display: grid;
    gap: 8px;
}

.guide-command-title {
    margin: 0;
    font-size: 14px;
    line-height: 22px;
    color: var(--text-primary);
}

.guide-command-items {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 8px;
}

.guide-command-item {
    border: 1px solid var(--border-default);
    border-radius: 8px;
    background: var(--contrast-light);
    padding: 8px 10px;
    font-size: 13px;
    line-height: 20px;
    color: var(--text-primary);
}
</style>
