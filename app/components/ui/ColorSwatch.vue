<script setup lang="ts">
import CopyText from '@/components/ui/CopyText.vue';

const props = defineProps<{
    token: string;
    label?: string;
}>();

const cssVar = `--${props.token}`;
const copyText = `var(${cssVar})`;
</script>

<template>
    <CopyText :text="copyText" class="ui-color">
        <div
            class="ui-color-swatch"
            :style="{ background: `var(${cssVar})` }"
        />

        <code class="ui-color-label">
            {{ props.label ?? cssVar }}
        </code>
    </CopyText>
</template>
