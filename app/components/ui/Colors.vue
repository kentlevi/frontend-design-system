<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import GuideCopy from '@/components/guide/GuideCopy.vue';

const props = defineProps<{
    token: string;
    label?: string;
}>();

const css_var = computed(() => `--${props.token}`);
const var_text = computed(() => `var(${css_var.value})`);

const hex = ref('#000000');

function resolveHex() {
    const el = document.createElement('div');
    el.style.color = var_text.value;
    document.body.appendChild(el);

    const rgb = getComputedStyle(el).color;
    document.body.removeChild(el);

    const match = rgb.match(/\d+/g);
    if (!match) return;

    const rgb_values = match.map(Number);
    if (rgb_values.length < 3) return;

    const [r = 0, g = 0, b = 0] = rgb_values;

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
        <GuideCopy :text="var_text">
            <div
                class="ui-color-swatch guide-item-hoverable"
                :style="{ background: var_text }"
            />
        </GuideCopy>

        <GuideCopy :text="var_text">
            <code class="ui-color-var">
                {{ var_text }}
            </code>
        </GuideCopy>

        <GuideCopy :text="hex">
            <code class="ui-color-hex">
                {{ hex }}
            </code>
        </GuideCopy>
    </div>
</template>
