<script setup lang="ts">
const sizeOptions = ['lg', 'md', 'sm', 'custom'] as const;

type SizeOption = (typeof sizeOptions)[number];

const props = withDefaults(
    defineProps<{
        modelValue?: SizeOption;
        customValue?: number;
        label?: string;
        min?: number;
    }>(),
    {
        modelValue: 'md',
        customValue: 72,
        label: 'SIZE',
        min: 8,
    }
);

const emit = defineEmits<{
    'update:modelValue': [value: SizeOption];
    'update:customValue': [value: number];
}>();

const onSizeSelect = (size: SizeOption) => {
    emit('update:modelValue', size);
};

const onCustomInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    emit('update:customValue', Number(input.value));
};
</script>

<template>
    <div class="size-control">
        <span class="size-label">{{ label }}</span>

        <div class="size-pills">
            <button
                v-for="size in sizeOptions"
                :key="size"
                type="button"
                class="size-pill"
                :class="{ 'is-active': modelValue === size }"
                @click="onSizeSelect(size)"
            >
                {{ size }}
            </button>

            <input
                v-if="modelValue === 'custom'"
                :value="customValue"
                type="number"
                :min="min"
                class="size-custom-input"
                @input="onCustomInput"
            />
        </div>
    </div>
</template>

<style scoped></style>
