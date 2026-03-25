<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { ButtonSize } from '~/data/ui/buttons';
import {
	useControlTestId,
	useRootAttrs,
} from '~/helpers/ui/uiControlAttrs.helper';

type SelectValue = string | number;

type SelectOption = {
	label: string;
	value: SelectValue;
	description?: string;
	style?: Record<string, string | number>;
};

type SelectSizeValue = ButtonSize | number | `${number}`;
const select_sizes = new Set<ButtonSize>(['sm', 'md', 'lg']);

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		modelValue?: SelectValue | null;
		options?: SelectOption[];
		size?: SelectSizeValue;
		placeholder?: string;
		searchable?: boolean;
		disabled?: boolean;
		emptyText?: string;
		iconSize?: number;
		iconFamily?: 'strong' | 'regular';
		triggerClass?: string;
		menuClass?: string;
		optionClass?: string;
		searchInputClass?: string;
	}>(),
	{
		modelValue: null,
		options: () => [],
		size: 'md',
		placeholder: 'Select option',
		searchable: false,
		disabled: false,
		emptyText: 'No results found.',
		iconSize: 24,
		iconFamily: 'regular',
		triggerClass: '',
		menuClass: '',
		optionClass: '',
		searchInputClass: '',
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: SelectValue): void;
}>();
const attrs = useAttrs();

const root_ref = ref<HTMLElement | null>(null);
const search_ref = ref<HTMLInputElement | null>(null);
const is_open = ref(false);
const query = ref('');
const SUPPRESS_TOGGLE_MS = 200;
let suppress_toggle_until = 0;

const selected_option = computed(() =>
	props.options.find((item) => item.value === props.modelValue) ?? null
);

const filtered_options = computed(() => {
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

const trigger_icon_name = computed(() =>
	props.iconFamily === 'regular' ? 'regular-angle-down' : 'strong-angle-down'
);
const trigger_style = computed<Record<string, string> | undefined>(() => {
	let numeric_size: number | null = null;
	if (typeof props.size === 'number') {
		numeric_size = props.size;
	} else if (typeof props.size === 'string' && !select_sizes.has(props.size as ButtonSize)) {
		const parsed = Number(props.size);
		if (Number.isFinite(parsed)) numeric_size = parsed;
	}

	if (!numeric_size) return undefined;
	return {
		height: `${numeric_size}px`,
	};
});
const test_id = useControlTestId(attrs);
const root_attrs = useRootAttrs(attrs, test_id);

function closeMenu() {
	is_open.value = false;
	query.value = '';
}

function openMenu() {
	if (props.disabled) return;
	is_open.value = true;
	if (props.searchable) {
		requestAnimationFrame(() => search_ref.value?.focus());
	}
}

function toggleMenu() {
	if (Date.now() < suppress_toggle_until) {
		return;
	}
	if (is_open.value) {
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
	if (root_ref.value?.contains(target)) return;
	if (!is_open.value) return;

	closeMenu();
	suppress_toggle_until = Date.now() + SUPPRESS_TOGGLE_MS;
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
		v-bind="root_attrs"
		ref="root_ref"
		class="ui-select"
		:data-open="is_open || null"
		:data-disabled="props.disabled || null"
		:data-size="props.size"
	>
		<button
			type="button"
			:class="['ui-select-trigger', props.triggerClass]"
			:disabled="props.disabled"
			:data-testid="test_id ? `${test_id}-trigger` : undefined"
			:style="trigger_style"
			@click="toggleMenu"
		>
			<span
				v-if="selected_option"
				class="ui-select-value"
				:style="selected_option.style"
			>
				{{ selected_option.label }}
			</span>
			<span v-else class="ui-select-placeholder">{{ props.placeholder }}</span>

			<UiIcon
				:name="trigger_icon_name"
				:size="props.iconSize"
				color="var(--gray-90)"
				class="ui-select-trigger-icon"
				:class="{ 'is-open': is_open }"
			/>
		</button>

		<Transition name="ui-select-menu">
			<div v-if="is_open" :class="['ui-select-menu', props.menuClass]" role="listbox">
				<div v-if="props.searchable" class="ui-select-search">
					<UiIcon
						name="strong-search"
						:size="14"
						color="var(--text-muted)"
					/>
					<input
						ref="search_ref"
						v-model="query"
						type="text"
						:class="['ui-select-search-input', props.searchInputClass]"
						placeholder="Search..."
						:data-testid="test_id ? `${test_id}-search` : undefined"
					>
				</div>

				<div class="ui-select-options">
					<button
						v-for="option in filtered_options"
						:key="option.value"
						type="button"
						:class="['ui-select-option', props.optionClass, {
							'is-selected': option.value === props.modelValue,
						}]"
						@mousedown.prevent="selectOption(option)"
					>
						<div class="ui-select-option-copy">
							<p class="ui-select-option-label" :style="option.style">{{ option.label }}</p>
							<p v-if="option.description" class="ui-select-option-description">
								{{ option.description }}
							</p>
						</div>
					</button>

					<p v-if="filtered_options.length === 0" class="ui-select-empty">
						{{ props.emptyText }}
					</p>
				</div>
			</div>
		</Transition>
	</div>
</template>