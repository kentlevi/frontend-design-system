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

function getDateParts(timestamp: number): DateParts {
	const user_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
	const { locale } = useI18n()
	const formatter = new Intl.DateTimeFormat(lang_map[locale.value], {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		timeZone: user_timezone,
	})

	const formatted_parts = formatter.formatToParts(new Date(timestamp * 1000))

	const parts_map = formatted_parts.reduce<Record<string, string>>((carry, part) => {
		if (part.type !== 'literal') {
			carry[part.type] = part.value
		}
		return carry
	}, {})

	return {
		day: Number(parts_map.day),
		month_label: parts_map.month ?? '',
		year: Number(parts_map.year),
	}
}

export function formatShippingDateRange(
	min_delivery_date_timestamp: number,
	max_delivery_date_timestamp: number
): string {
	if (!Number.isFinite(min_delivery_date_timestamp) || !Number.isFinite(max_delivery_date_timestamp)) {
		return ''
	}

	const min_delivery_date = getDateParts(min_delivery_date_timestamp)
	const max_delivery_date = getDateParts(max_delivery_date_timestamp)

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