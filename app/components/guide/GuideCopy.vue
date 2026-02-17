<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue';
import { copyTextToClipboard } from '@/utils/clipboard';

const props = defineProps<{
    component?: string;
    props?: Record<string, unknown>;
    as?: string;
    text?: string;

    mode?: 'code' | 'name';
    name?: string;
}>();

const attrs = useAttrs();

const copied = ref(false);
const cursor = ref({ x: 0, y: 0 });

function formatProp(key: string, value: unknown) {
    if (value === true) return key;

    if (typeof value === 'number') {
        return `:${key}="${value}"`;
    }

    if (typeof value === 'string') {
        return `${key}="${value}"`;
    }

    if (typeof value === 'object' && value !== null) {
        return `:${key}='${JSON.stringify(value)}'`;
    }

    return '';
}

function buildTag() {
    if (!props.component) return '';

    const entries = Object.entries(props.props ?? {})
        .filter(([, v]) => v !== undefined && v !== false)
        .map(([k, v]) => formatProp(k, v))
        .filter(Boolean)
        .join(' ');

    return `<${props.component}${entries ? ' ' + entries : ''} />`;
}

const code = computed(() => {
    if (props.text) return props.text;

    if (props.mode === 'name' && props.name) {
        return props.name;
    }

    return buildTag();
});

async function handleClick(e: MouseEvent) {
    try {
        await copyTextToClipboard(code.value);

        cursor.value = { x: e.clientX, y: e.clientY };
        copied.value = true;

        setTimeout(() => (copied.value = false), 900);
    } catch {}
}

function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e as unknown as MouseEvent);
    }
}
</script>

<template>
    <component
        :is="as || 'div'"
        class="guide-copy"
        v-bind="attrs"
        :title="code ? `Copy ${code}` : undefined"
        :role="as ? undefined : 'button'"
        :tabindex="as ? undefined : 0"
        @click="handleClick"
        @keydown="handleKey"
    >
        <slot />
    </component>

    <transition name="guide-copy-toast">
        <div
            v-if="copied && code"
            class="guide-copy-toast"
            :style="{ left: cursor.x + 'px', top: cursor.y + 'px' }"
            role="status"
            aria-live="polite"
        >
            <strong>{{ code }}</strong>
        </div>
    </transition>
</template>
