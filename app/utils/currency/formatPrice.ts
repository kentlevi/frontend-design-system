export const formatPrice = (amount: number | null | undefined): string => {
	const getLocale = () => {
		if (import.meta.client) {
			return window.location.pathname.split('/')[1] || 'us'
		}
		return useRequestURL().pathname.split('/')[1] || 'us'
	}

	const locale = getLocale()

	const safe_amount = Number(amount ?? 0)

	if (locale === 'kr') {
		return `${new Intl.NumberFormat('ko-KR').format(safe_amount)}원`
	}

	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(safe_amount)
}