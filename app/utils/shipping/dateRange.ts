type DateParts = {
	day: number
	month_label: string
	year: number
}

const lang_map = {
	kr: 'ko-KR',
	us: 'en-US',
	ph: 'en-PH'
}

function getDateParts(date_string: string): DateParts | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date_string)

	if (!match) {
		return null
	}

	const year = Number(match[1])
	const month_index = Number(match[2]) - 1
	const day = Number(match[3])
	const { locale } = useI18n()

	const formatter = new Intl.DateTimeFormat(lang_map[locale.value], {
		month: 'long',
		timeZone: 'UTC',
	})

	const month_label = formatter.format(new Date(Date.UTC(year, month_index, day)))

	return {
		day,
		month_label,
		year,
	}
}

export function formatShippingDateRange(
	min_delivery_date_string: string,
	max_delivery_date_string: string
): string {
	const min_delivery_date = getDateParts(min_delivery_date_string)
	const max_delivery_date = getDateParts(max_delivery_date_string)

	if (!min_delivery_date || !max_delivery_date) {
		return ''
	}

	if (
		min_delivery_date.year === max_delivery_date.year
        && min_delivery_date.month_label === max_delivery_date.month_label
        && min_delivery_date.day === max_delivery_date.day
	) {
		return `${min_delivery_date.month_label} ${min_delivery_date.day}, ${min_delivery_date.year}`
	}

	if (min_delivery_date.year === max_delivery_date.year && min_delivery_date.month_label === max_delivery_date.month_label) {
		return `${min_delivery_date.month_label} ${min_delivery_date.day}-${max_delivery_date.day}, ${min_delivery_date.year}`
	}

	if (min_delivery_date.year === max_delivery_date.year) {
		return `${min_delivery_date.month_label} ${min_delivery_date.day} - ${max_delivery_date.month_label} ${max_delivery_date.day}, ${min_delivery_date.year}`
	}

	return `${min_delivery_date.month_label} ${min_delivery_date.day}, ${min_delivery_date.year} - ${max_delivery_date.month_label} ${max_delivery_date.day}, ${max_delivery_date.year}`
}
