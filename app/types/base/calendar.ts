type CalendarDateValue = Date | string | number
type CalendarSingleValue = CalendarDateValue | null
type CalendarWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7
type MarkerDate = CalendarDateValue
type CalendarMode = 'single' | 'range'

interface CalendarRangeValue {
	start: CalendarSingleValue
	end: CalendarSingleValue
}

type CalendarValue = CalendarSingleValue | CalendarRangeValue
type CalendarDisabledDateTuple = [CalendarDateValue | null, CalendarDateValue | null]
interface CalendarDisabledDateRange {
	start?: CalendarDateValue | null
	end?: CalendarDateValue | null
}
interface CalendarDisabledRepeatRule {
	repeat: {
		weekdays?: CalendarWeekday | CalendarWeekday[]
	}
}

type CalendarDisabledDate =
	| CalendarDateValue
	| CalendarDisabledDateTuple
	| CalendarDisabledDateRange
	| CalendarDisabledRepeatRule

interface CalendarBaseProps {
	markerDates?: MarkerDate[]
	disabledDates?: CalendarDisabledDate[]
	disabledWeekdays?: CalendarWeekday[]
	columns?: number
}

interface CalendarSingleProps extends CalendarBaseProps {
	mode?: 'single'
	modelValue?: CalendarSingleValue
}

interface CalendarRangeProps extends CalendarBaseProps {
	mode: 'range'
	modelValue?: CalendarRangeValue | null
}

type CalendarProps = CalendarSingleProps | CalendarRangeProps

export type {
	CalendarDateValue,
	CalendarSingleValue,
	CalendarRangeValue,
	CalendarValue,
	MarkerDate,
	CalendarDisabledDateTuple,
	CalendarDisabledDateRange,
	CalendarDisabledRepeatRule,
	CalendarDisabledDate,
	CalendarWeekday,
	CalendarMode,
	CalendarProps,
	CalendarSingleProps,
	CalendarRangeProps,
}