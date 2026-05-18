import type { UserOrderType } from '~/types/order/user-orders'

export const ORDER_STATUSES: UserOrderType[] = [
	'ongoing',
	'action_required',
	'to_receive',
	'completed',
	'cancelled',
]

export const ORDER_STATUS_LABELS: Record<UserOrderType, string> = {
	ongoing: 'On-Going',
	action_required: 'Action Required',
	to_receive: 'To Receive',
	completed: 'Completed',
	cancelled: 'Cancelled',
}