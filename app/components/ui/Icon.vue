<script setup lang="ts">
import { computed } from 'vue';
import { iconSpriteVersion, icons } from '~/data/ui/icons';

type Size = 'sm' | 'md' | 'lg' | number | string;

const props = defineProps<{
    name: keyof typeof icons;
    size?: Size;
    title?: string;
    color?: string;
}>();

const sizeMap = { sm: 16, md: 20, lg: 24 } as const;

const iconSize = computed<string>(() => {
    if (!props.size) return `${sizeMap.lg}px`;

    if (typeof props.size === 'string' && props.size in sizeMap) {
        return `${sizeMap[props.size as keyof typeof sizeMap]}px`;
    }

    if (typeof props.size === 'number') {
        return `${props.size}px`;
    }

    return props.size;
});

const iconMeta = computed(() => icons[props.name] ?? null);

const spriteHref = computed(() =>
    iconMeta.value ? `/icons/sprite.svg?v=${iconSpriteVersion}#${iconMeta.value.id}` : null
);
</script>

<template>
    <svg
        v-if="iconMeta"
        class="ui-icon"
        :style="{
            width: iconSize,
            height: iconSize,
            color: color ?? 'currentColor',
        }"
        :viewBox="iconMeta.viewBox"
        :role="title ? 'img' : undefined"
        :aria-hidden="title ? undefined : true"
    >
        <title v-if="title">{{ title }}</title>
        <use :href="spriteHref" />
    </svg>

    <span
        v-else
        class="ui-icon ui-icon--missing"
        :style="{ width: iconSize, height: iconSize }"
        aria-hidden="true"
    />
</template>
