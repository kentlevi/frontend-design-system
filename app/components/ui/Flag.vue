<script setup lang="ts">
import type { FlagCode } from '~/data/ui/flags';

const props = defineProps<{
    code: FlagCode;
    alt?: string;
    size?: number;
}>();

const src = computed(() => `/flags/${props.code}.svg`);
const alt = computed(() => props.alt ?? `Flag of ${props.code.toUpperCase()}`);
</script>

<template>
    <img
        class="ui-flag"
        :src="src"
        :alt="alt"
        :width="size ?? 24"
        :height="size ?? 24"
        loading="lazy"
        decoding="async"
    />
</template>
