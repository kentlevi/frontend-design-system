<script setup lang="ts">
type Variant = 'filled' | 'tonal' | 'outline' | 'subtle';
type Tone = 'default' | 'success' | 'danger' | 'warning';
type Size = 'sm' | 'md';

withDefaults(
    defineProps<{
        variant?: Variant;
        tone?: Tone;
        size?: Size;
    }>(),
    {
        variant: 'tonal',
        tone: 'default',
        size: 'md',
    }
);
</script>

<template>
    <span
        class="ui-badge"
        :data-variant="variant"
        :data-tone="tone"
        :data-size="size"
    >
        <slot />
    </span>
</template>
