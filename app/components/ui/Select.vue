<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type SelectValue = string | number;

type SelectOption = {
    label: string;
    value: SelectValue;
    description?: string;
};

defineOptions({
    inheritAttrs: false,
});

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
        iconSize: 24,
        iconFamily: 'regular',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: SelectValue): void;
}>();
const attrs = useAttrs();

const rootRef = ref<HTMLElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const query = ref('');
const SUPPRESS_TOGGLE_MS = 200;
let suppressToggleUntil = 0;

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

const triggerIconName = computed(() =>
    props.iconFamily === 'regular' ? 'regular-angle-down' : 'strong-angle-down'
);
const testId = computed(() => String(attrs['data-testid'] || '').trim());
const rootAttrs = computed(() => {
    const { class: className, style, 'data-testid': _testId } = attrs;
    return {
        class: className,
        style,
        ...(testId.value ? { 'data-testid': testId.value } : {}),
    };
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
    if (Date.now() < suppressToggleUntil) {
        return;
    }
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

function handleOutsidePointerDown(event: PointerEvent) {
    const target = event.target as Node | null;
    if (!target) return;
    if (rootRef.value?.contains(target)) return;
    if (!isOpen.value) return;

    closeMenu();
    suppressToggleUntil = Date.now() + SUPPRESS_TOGGLE_MS;
}

function handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        closeMenu();
    }
}

onMounted(() => {
    window.addEventListener('pointerdown', handleOutsidePointerDown, true);
    window.addEventListener('keydown', handleWindowKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('pointerdown', handleOutsidePointerDown, true);
    window.removeEventListener('keydown', handleWindowKeydown);
});
</script>

<template>
    <div
        v-bind="rootAttrs"
        ref="rootRef"
        class="ui-select"
        :data-open="isOpen || null"
        :data-disabled="props.disabled || null"
    >
        <button
            type="button"
            class="ui-select-trigger"
            :disabled="props.disabled"
            :data-testid="testId ? `${testId}-trigger` : undefined"
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
                class="ui-select-trigger-icon"
                :class="{ 'is-open': isOpen }"
            />
        </button>

        <Transition name="ui-select-menu">
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
                        :data-testid="testId ? `${testId}-search` : undefined"
                    >
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
                        @mousedown.prevent="selectOption(option)"
                    >
                        <div class="ui-select-option-copy">
                            <p class="ui-select-option-label">{{ option.label }}</p>
                            <p v-if="option.description" class="ui-select-option-description">
                                {{ option.description }}
                            </p>
                        </div>
                    </button>

                    <p v-if="filteredOptions.length === 0" class="ui-select-empty">
                        {{ props.emptyText }}
                    </p>
                </div>
            </div>
        </Transition>
    </div>
</template>


