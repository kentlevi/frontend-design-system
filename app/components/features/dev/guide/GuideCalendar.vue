<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuCalendar</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Calendar picker supporting single/range selection, marker dates, and disabled rules.
		</MuText>

		<MuHeading variant="6" weight="bold">Single Mode</MuHeading>
		<div class="guide-demo">
			<div class="guide-calendar-wrap">
				<MuCalendar v-model="single_date" :marker-dates="marker_dates" :disabled-weekdays="[7]" />
			</div>
			<MuText size="small">Selected: <code>{{ formatValue(single_date) }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Range Mode</MuHeading>
		<div class="guide-demo">
			<div class="guide-calendar-wrap">
				<MuCalendar v-model="range_date" mode="range" />
			</div>
			<MuText size="small">Selected: <code>{{ formatRange(range_date) }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Two Months Side by Side</MuHeading>
		<div class="guide-demo">
			<div class="guide-calendar-wrap">
				<MuCalendar v-model="two_month_date" :columns="2" />
			</div>
			<MuText size="small">Selected: <code>{{ formatValue(two_month_date) }}</code></MuText>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { CalendarRangeValue, CalendarSingleValue } from '~/types/base/calendar';

const today = new Date();
const marker_dates = [
	today,
	new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
];

const single_date = ref<CalendarSingleValue>(today);
const range_date = ref<CalendarRangeValue>({
	start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
	end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
});
const two_month_date = ref<CalendarSingleValue>(today);

function formatValue(value: CalendarSingleValue): string {
	if (!value) return 'null';
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
}

function formatRange(value: CalendarRangeValue): string {
	return `${formatValue(value.start)} → ${formatValue(value.end)}`;
}
</script>

<style scoped lang="scss">
.guide-calendar-wrap {
	max-width: 360px;
}
</style>