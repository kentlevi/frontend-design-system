<script setup lang="ts">
import { computed } from 'vue';
import UiIcon from '@/components/ui/Icon.vue';
import type { icons } from '~/data/ui/icons';
import type { ButtonVariant, ButtonSize, ButtonTone } from '~/data/ui/buttons';

type IconPosition = 'left' | 'right';
type IconName = keyof typeof icons;

const props = withDefaults(
    defineProps<{
        variant?: ButtonVariant;
        size?: ButtonSize;
        tone?: ButtonTone;

        icon?: IconName | null;
        iconPosition?: IconPosition;
        iconSize?: ButtonSize;
        iconOnly?: boolean;
        srLabel?: string;

        selected?: boolean;
        disabled?: boolean;
        loading?: boolean;

        width?: string;
        height?: string;
        style?: Record<string, string>;
    }>(),
    {
        variant: 'filled',
        size: 'md',
        tone: 'default',

        icon: null,
        iconPosition: 'left',
        iconSize: 'sm',
        iconOnly: false,
        srLabel: '',

        selected: false,
        disabled: false,
        loading: false,
    }
);

const mergedStyle = computed<Record<string, string> | undefined>(() => {
    const style = {
        ...(props.style ?? {}),
        ...(props.width ? { width: props.width } : {}),
        ...(props.height ? { height: props.height } : {}),
    };

    return Object.keys(style).length ? style : undefined;
});
</script>

<template>
    <button
        class="ui-button"
        type="button"
        :data-variant="variant"
        :data-size="size"
        :data-tone="tone ?? 'primary'"
        :data-selected="selected ? 'true' : 'false'"
        :data-icon-only="iconOnly ? 'true' : 'false'"
        :disabled="disabled || loading"
        :aria-busy="loading || undefined"
        :style="mergedStyle"
    >
        <span v-if="selected && !loading" class="ui-button-indicator" />

        <span v-if="loading" class="ui-button-spinner" aria-hidden="true" />

        <UiIcon
            v-if="!loading && icon && iconPosition === 'left' && !iconOnly"
            :name="icon"
            :size="iconSize"
            decorative
            class="ui-button-icon"
        />

        <UiIcon
            v-if="!loading && iconOnly && icon"
            :name="icon"
            :size="iconSize"
            decorative
            class="ui-button-icon"
        />

        <span v-if="iconOnly && srLabel" class="ui-button-sr-only">
            {{ srLabel }}
        </span>

        <span
            v-if="!iconOnly && !loading && $slots.default"
            class="ui-button-label"
        >
            <slot />
        </span>

        <UiIcon
            v-if="!loading && icon && iconPosition === 'right' && !iconOnly"
            :name="icon"
            :size="iconSize"
            decorative
            class="ui-button-icon"
        />
    </button>
</template>

<style scoped lang="scss">
.ui-button-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
