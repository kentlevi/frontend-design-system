export function getCouponUsageLabel(limit: number): string {
	if (limit === 0) {
		return 'Unlimited Use'
	}

	if (limit === 1) {
		return 'Single Use'
	}

	return 'Multiple Use'
}