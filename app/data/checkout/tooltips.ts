export const checkoutGuestEmailTooltipProps = {
	side: 'right',
	align: 'start',
	mobileSide: 'left',
	tone: 'neutral',
	offset: 10,
	slideDistance: 24,
	role: 'dialog',
	contentWidth: '420px',
	contentMinWidth: '420px',
	contentMaxWidth: 'min(420px, calc(100vw - 32px))',
	mobileContentWidth: 'min(360px, calc(100vw - 32px))',
} as const;

export const checkoutMemberPointsTooltipProps = {
	side: 'right',
	align: 'start',
	mobileSide: 'bottom',
	tone: 'neutral',
	offset: 10,
	contentWidth: '420px',
	contentMinWidth: '420px',
	contentMaxWidth: 'min(420px, calc(100vw - 32px))',
	mobileContentWidth: 'min(320px, calc(100vw - 32px))',
} as const;

export const checkoutDropShippingTooltipProps = {
	side: 'right',
	align: 'start',
	mobileSide: 'bottom',
	tone: 'neutral',
	offset: 10,
	slideDistance: 24,
	contentWidth: '420px',
	contentMinWidth: '420px',
	contentMaxWidth: 'min(420px, calc(100vw - 32px))',
	mobileContentWidth: 'min(320px, calc(100vw - 32px))',
} as const;

export const checkoutBillingTooltipProps = {
	side: 'right',
	align: 'center',
	mobileSide: 'bottom',
	tone: 'neutral',
	offset: 10,
	slideDistance: 24,
	contentWidth: '420px',
	contentMinWidth: '420px',
	contentMaxWidth: 'min(420px, calc(100vw - 32px))',
	mobileContentWidth: 'min(320px, calc(100vw - 32px))',
} as const;

export const checkoutGuestEmailTooltipContent = {
	title: 'Email for Verification & Updates',
	text: 'Enter your email address to continue. We\'ll use it to check if you already have an account and to send updates about your order.',
} as const;

export const checkoutMemberPointsTooltipContent = {
	title: 'How Points Work',
	text: 'Use your points to reduce your total at checkout. 1 point = 1 won.',
} as const;

export const checkoutDropShippingTooltipContent = {
	title: 'Enable Drop Shipping',
	text: 'Ship orders directly to your customer without handling the delivery. We will produce, pack, and ship the order on your behalf.',
} as const;