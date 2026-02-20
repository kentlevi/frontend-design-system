<script setup lang="ts">
const props = defineProps<{
    modelValue: {
        size: string;
        tone: string;
        state: string;
    };
    config: {
        supportsSize: boolean;
        supportsTone: boolean;
        supportsState: boolean;
    };
}>();

const emit = defineEmits<{
    (event: 'update:modelValue', value: { size: string; tone: string; state: string }): void;
}>();

const sizeOptions = ['sm', 'md', 'lg'];
const toneOptions = ['neutral', 'success', 'warning', 'danger'];
const stateOptions = ['default', 'hover', 'active', 'disabled'];

const updateValue = (key: 'size' | 'tone' | 'state', value: string) => {
    emit('update:modelValue', { ...props.modelValue, [key]: value });
};
</script>

<template>
    <div class="guide-playground-controls">
        <label v-if="config.supportsSize" class="guide-playground-field">
            Size
            <select
                :value="modelValue.size"
                @change="(event) => updateValue('size', (event.target as HTMLSelectElement).value)"
            >
                <option v-for="option in sizeOptions" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
        </label>

        <label v-if="config.supportsTone" class="guide-playground-field">
            Tone
            <select
                :value="modelValue.tone"
                @change="(event) => updateValue('tone', (event.target as HTMLSelectElement).value)"
            >
                <option v-for="option in toneOptions" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
        </label>

        <label v-if="config.supportsState" class="guide-playground-field">
            State
            <select
                :value="modelValue.state"
                @change="(event) => updateValue('state', (event.target as HTMLSelectElement).value)"
            >
                <option v-for="option in stateOptions" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
        </label>
    </div>
</template>

<style scoped lang="scss">
.guide-playground-controls {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.guide-playground-field {
    display: grid;
    gap: 4px;
    font-size: 12px;
    color: var(--text-muted);

    select {
        border: 1px solid var(--border-default);
        border-radius: 8px;
        padding: 4px 8px;
        color: var(--text-primary);
        background: var(--contrast-light);
    }
}
</style>
