<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type SelectValue = string | number;

type SelectOption = {
    label: string;
    value: SelectValue;
    description?: string;
};

const props = withDefaults(
    defineProps<{
        modelValue?: SelectValue | null;
        options?: SelectOption[];
        placeholder?: string;
        searchable?: boolean;
        disabled?: boolean;
        emptyText?: string;
        iconSize?: number;
        iconFamily?: 'strong' | 'regular';
    }>(),
    {
        modelValue: null,
        options: () => [],
        placeholder: 'Select option',
        searchable: false,
        disabled: false,
        emptyText: 'No results found.',
        iconSize: 14,
        iconFamily: 'strong',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: SelectValue): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const query = ref('');

const selectedOption = computed(() =>
    props.options.find((item) => item.value === props.modelValue) ?? null
);

const filteredOptions = computed(() => {
    if (!props.searchable) return props.options;

    const keyword = query.value.trim().toLowerCase();
    if (!keyword) return props.options;

    return props.options.filter((item) => {
        const labelMatched = item.label.toLowerCase().includes(keyword);
        const descMatched = item.description
            ? item.description.toLowerCase().includes(keyword)
            : false;

        return labelMatched || descMatched;
    });
});

const triggerIconName = computed(() => {
    const family = props.iconFamily;
    if (isOpen.value) {
        return family === 'regular' ? 'regular-angle-up' : 'strong-angle-up';
    }
    return family === 'regular' ? 'regular-angle-down' : 'strong-angle-down';
});

function closeMenu() {
    isOpen.value = false;
    query.value = '';
}

function openMenu() {
    if (props.disabled) return;
    isOpen.value = true;
    if (props.searchable) {
        requestAnimationFrame(() => searchRef.value?.focus());
    }
}

function toggleMenu() {
    if (isOpen.value) {
        closeMenu();
        return;
    }

    openMenu();
}

function selectOption(option: SelectOption) {
    emit('update:modelValue', option.value);
    closeMenu();
}

function handleOutsideClick(event: MouseEvent) {
    const target = event.target as Node | null;
    if (!target) return;
    if (rootRef.value?.contains(target)) return;
    closeMenu();
}

function handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        closeMenu();
    }
}

onMounted(() => {
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleWindowKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('click', handleOutsideClick);
    window.removeEventListener('keydown', handleWindowKeydown);
});
</script>

<template>
    <div
        ref="rootRef"
        class="ui-select"
        :data-open="isOpen || null"
        :data-disabled="props.disabled || null"
    >
        <button
            type="button"
            class="ui-select-trigger"
            :disabled="props.disabled"
            @click="toggleMenu"
        >
            <span
                v-if="selectedOption"
                class="ui-select-value"
            >
                {{ selectedOption.label }}
            </span>
            <span v-else class="ui-select-placeholder">{{ props.placeholder }}</span>

            <UiIcon
                :name="triggerIconName"
                :size="props.iconSize"
                color="var(--text-secondary)"
            />
        </button>

        <div v-if="isOpen" class="ui-select-menu" role="listbox">
            <div v-if="props.searchable" class="ui-select-search">
                <UiIcon
                    name="strong-search"
                    :size="14"
                    color="var(--text-muted)"
                />
                <input
                    ref="searchRef"
                    v-model="query"
                    type="text"
                    class="ui-select-search-input"
                    placeholder="Search..."
                />
            </div>

            <div class="ui-select-options">
                <button
                    v-for="option in filteredOptions"
                    :key="option.value"
                    type="button"
                    class="ui-select-option"
                    :class="{
                        'is-selected': option.value === props.modelValue,
                    }"
                    @click="selectOption(option)"
                >
                    <div class="ui-select-option-copy">
                        <p class="ui-select-option-label">{{ option.label }}</p>
                        <p v-if="option.description" class="ui-select-option-description">
                            {{ option.description }}
                        </p>
                    </div>

                    <UiIcon
                        v-if="option.value === props.modelValue"
                        name="strong-check"
                        :size="14"
                        color="var(--text-primary)"
                    />
                </button>

                <p v-if="filteredOptions.length === 0" class="ui-select-empty">
                    {{ props.emptyText }}
                </p>
            </div>
        </div>
    </div>
</template>
