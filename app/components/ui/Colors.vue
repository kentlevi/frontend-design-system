<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import CopyText from '@/components/ui/CopyText.vue';

const props = defineProps<{
    token: string;
    label?: string;
}>();

const cssVar = computed(() => `--${props.token}`);
const varText = computed(() => `var(${cssVar.value})`);

const hex = ref('#000000');

function resolveHex() {
    const el = document.createElement('div');
    el.style.color = varText.value;
    document.body.appendChild(el);

    const rgb = getComputedStyle(el).color;
    document.body.removeChild(el);

    const match = rgb.match(/\d+/g);
    if (!match) return;

    const [r, g, b] = match.map(Number);

    hex.value =
        '#' +
        [r, g, b]
            .map((v) => v.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
}

onMounted(resolveHex);
watch(() => props.token, resolveHex);
</script>

<template>
    <div class="ui-color">
        <CopyText :text="varText">
            <div
                class="ui-color-swatch"
                :style="{ background: varText }"
            />
        </CopyText>

        <CopyText :text="varText">
            <code class="ui-color-var">
                {{ varText }}
            </code>
        </CopyText>

        <CopyText :text="hex">
            <code class="ui-color-hex">
                {{ hex }}
            </code>
        </CopyText>
    </div>
</template>
