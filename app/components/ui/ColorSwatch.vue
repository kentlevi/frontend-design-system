<script setup lang="ts">
import GuideCopy from '@/components/guide/GuideCopy.vue';

const props = defineProps<{
    token: string;
    label?: string;
}>();

const cssVar = `--${props.token}`;
const copyText = `var(${cssVar})`;
</script>

<template>
    <GuideCopy :text="copyText" class="ui-color">
        <div
            class="ui-color-swatch guide-item-hoverable"
            :style="{ background: `var(${cssVar})` }"
        />

        <code class="ui-color-label">
            {{ props.label ?? cssVar }}
        </code>
    </GuideCopy>
</template>
