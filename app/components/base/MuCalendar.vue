<template>
	<div class="m-calendar">
		<VDatePicker
			v-model="selected_date"
			:model-modifiers="model_modifiers"
			:attributes="calendar_attributes"
			:disabled-dates="calendar_disabled_dates"
			:masks="calendar_masks"
			:first-day-of-week="1"
			:trim-weeks="false"
			:columns="props.columns"
			expanded
			borderless
			transparent
		>
			<template #header-title="{ title }">
				<MuText class="m-calendar__title" weight="bold">{{ title }}</MuText>
			</template>

			<template #header-prev-button>
				<UiIcon
					name="regular-angle-left"
					:size="24"
					color="var(--text-secondary)"
					class="m-calendar__nav-arrow"
					decorative
				/>
			</template>

			<template #header-next-button>
				<UiIcon
					name="regular-angle-right"
					:size="24"
					color="var(--text-secondary)"
					class="m-calendar__nav-arrow"
					decorative
				/>
			</template>
		</VDatePicker>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DatePicker as VDatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import type {
	CalendarDisabledDate,
	CalendarProps,
	CalendarRangeValue,
	CalendarSingleValue,
	CalendarValue,
	CalendarWeekday,
} from '~/types/base/calendar';

const props = withDefaults(defineProps<CalendarProps>(), {
	markerDates: () => [],
	disabledDates: () => [],
	disabledWeekdays: () => [],
	mode: 'single',
	columns: 1,
});

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: CalendarValue): void;
	(_e: 'change', _value: CalendarValue): void;
}>();

const model_modifiers = computed(() => ({
	range: props.mode === 'range',
}));

type DatePickerRangeInputValue = {
	start: Exclude<CalendarSingleValue, null>;
	end: Exclude<CalendarSingleValue, null>;
};

type DatePickerInputValue = CalendarSingleValue | DatePickerRangeInputValue | null;

function createDefaultModelValue(mode: CalendarProps['mode']): CalendarValue {
	if (mode === 'range') {
		return {
			start: null,
			end: null,
		};
	}

	return null;
}

const internal_model_value = ref<CalendarValue>(createDefaultModelValue(props.mode));

watch(
	() => props.mode,
	(mode) => {
		if (props.modelValue !== undefined) return;
		internal_model_value.value = createDefaultModelValue(mode);
	},
);

const selected_date = computed<DatePickerInputValue>({
	get() {
		const source_value = props.modelValue === undefined
			? internal_model_value.value
			: props.modelValue;

		return normalizeDatePickerInputValue(source_value);
	},
	set(value: unknown) {
		const normalized_value = normalizeCalendarValue(value);

		if (props.modelValue === undefined) {
			internal_model_value.value = normalized_value;
		}

		emit('update:modelValue', normalized_value);
		emit('change', normalized_value);
	},
});

function isRangeValue(value: unknown): value is CalendarRangeValue {
	return (
		typeof value === 'object'
		&& value !== null
		&& 'start' in value
		&& 'end' in value
	);
}

function normalizeSingleValue(value: unknown): CalendarSingleValue {
	if (value === null || value === undefined) return null;

	if (
		value instanceof Date
		|| typeof value === 'string'
		|| typeof value === 'number'
	) {
		return value;
	}

	return null;
}

function normalizeDatePickerRangeInputValue(value: unknown): DatePickerRangeInputValue | null {
	if (!isRangeValue(value)) return null;

	const start = normalizeSingleValue(value.start);
	const end = normalizeSingleValue(value.end);

	if (start === null || end === null) return null;

	return {
		start,
		end,
	};
}

function normalizeDatePickerInputValue(value: unknown): DatePickerInputValue {
	if (props.mode === 'range') {
		return normalizeDatePickerRangeInputValue(value);
	}

	return normalizeSingleValue(value);
}

function normalizeCalendarValue(value: unknown): CalendarValue {
	if (props.mode === 'range') {
		if (!isRangeValue(value)) {
			return {
				start: null,
				end: null,
			};
		}

		return {
			start: normalizeSingleValue(value.start),
			end: normalizeSingleValue(value.end),
		};
	}

	return normalizeSingleValue(value);
}

const calendar_masks = {
	weekdays: 'WWW',
	title: 'MMMM YYYY',
} as const;

const calendar_attributes = computed(() => {
	if (!props.markerDates.length) return [];

	return [
		{
			key: 'marker-dates',
			dot: true,
			dates: props.markerDates,
		},
	];
});

const calendar_disabled_dates = computed<CalendarDisabledDate[]>(() => {
	const dates: CalendarDisabledDate[] = [...props.disabledDates];
	if (!props.disabledWeekdays.length) return dates;

	const weekdays = Array.from(new Set(props.disabledWeekdays)) as CalendarWeekday[];
	dates.push({
		repeat: {
			weekdays,
		},
	});

	return dates;
});
</script>

<style scoped lang="scss">
.m-calendar {
	width: 100%;

	.m-calendar__title {
		color: var(--text-primary);
	}

	.m-calendar__nav-arrow {
		display: inline-flex;
	}

	:deep(.vc-container) {
		width: 100%;
		border: 0;
		background: transparent;
	}

	:deep(.vc-pane) {
		min-width: 100%;
	}

	:deep(.vc-header) {
		height: 32px;
		margin: 0 0 16px;
		padding: 0;
	}

	:deep(.vc-header .vc-title) {
		padding: 0;
		background: transparent;
	}

	:deep(.vc-header .vc-title:hover) {
		opacity: 1;
	}

	:deep(.vc-header .vc-arrow) {
		width: auto;
		height: auto;
		padding: 0;
		background: transparent;
	}

	:deep(.vc-header .vc-arrow:hover) {
		background: transparent;
		opacity: 0.75;
	}

	:deep(.vc-header .vc-arrow.vc-focus:focus-within) {
		box-shadow: none;
	}

	:deep(.vc-weeks) {
		padding: 0;
	}

	:deep(.vc-weekday) {
		padding-top: 8px;
		padding-bottom: 8px;
		font-size: var(--type-size-100);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}

	:deep(.vc-week) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	:deep(.vc-day-content) {
		width: 40px;
		height: 40px;
		font-size: var(--type-size-100);
		font-weight: var(--font-weight-regular);
		line-height: 24px;
		color: var(--text-primary);
		border-radius: 8px;
	}

	:deep(.vc-day-content.vc-focus:focus),
	:deep(.vc-day-content.vc-focus:focus-visible) {
		box-shadow: none;
		outline: none;
	}

	:deep(.vc-monthly .is-not-in-month *) {
		opacity: 1;
	}

	:deep(.vc-day.is-not-in-month .vc-day-content) {
		color: var(--gray-60);
	}

	:deep(.vc-highlight-bg-solid) {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		background: var(--gray-100);
	}

	:deep(.vc-highlight-content-solid) {
		color: var(--white-base);
		font-weight: var(--font-weight-semibold);
	}

	:deep(.vc-day-box-center-bottom) {
		padding-bottom: 4px;
	}

	:deep(.vc-day-box-center-center) {
		color: var(--white-base);
		font-weight: var(--font-weight-semibold);
		margin: 0 auto;
	}

	:deep(.vc-dot) {
		width: 6px;
		height: 6px;
		background-color: var(--gray-80);
	}

	:deep(.vc-day-content.vc-highlight-content-solid ~ .vc-day-layer .vc-dot) {
		background-color: var(--white-base);
	}
}
</style>
