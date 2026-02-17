<script setup lang="ts">
import { computed } from 'vue';
import type { LogoName } from '~/data/ui/logos';

type Variant = 'full' | 'mark';
type Color = 'colored' | 'white';
type Size = 'sm' | 'md' | 'lg' | number;

const props = withDefaults(
    defineProps<{
        name: LogoName;
        variant?: Variant;
        color?: Color;
        size?: Size;
    }>(),
    {
        variant: 'full',
        color: 'colored',
        size: 'lg',
    }
);

const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
} as const;

const logoHeight = computed(() => {
    if (typeof props.size === 'number') return props.size;
    return sizeMap[props.size];
});

const src = computed(
    () => `/logos/${props.variant}/${props.color}/${props.name}.svg`
);
</script>

<template>
    <img
        :src="src"
        :style="{
            height: `${logoHeight}px`,
            width: 'auto',
        }"
        :alt="`${props.name} logo`"
        class="ui-logo"
        loading="lazy"
        decoding="async"
    />
</template>
