<script setup lang="ts">
import { computed } from 'vue';
import type { LogoName } from '~/data/ui/logos';

type Variant = 'full' | 'mark';
type Color = 'colored' | 'white';
type Size = 'sm' | 'md' | 'lg' | number;
type Loading = 'eager' | 'lazy';

const props = withDefaults(
    defineProps<{
        name: LogoName;
        variant?: Variant;
        color?: Color;
        size?: Size;
        width?: number;
        loading?: Loading;
        fetchpriority?: 'high' | 'low' | 'auto';
    }>(),
    {
        variant: 'full',
        color: 'colored',
        size: 'lg',
        width: undefined,
        loading: 'lazy',
        fetchpriority: 'auto',
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

const logoWidth = computed<number | undefined>(() => props.width);

const src = computed(
    () => `/logos/${props.variant}/${props.color}/${props.name}.svg`
);
</script>

<template>
    <img
        :src="src"
        :style="{
            height: `${logoHeight}px`,
            width: logoWidth ? `${logoWidth}px` : 'auto',
        }"
        :width="logoWidth"
        :height="logoHeight"
        :alt="`${props.name} logo`"
        class="ui-logo"
        :loading="loading"
        :fetchpriority="fetchpriority"
        decoding="async"
    />
</template>
