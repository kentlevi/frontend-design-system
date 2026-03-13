export type AccountOrderLifecycle = 'active' | 'inactive';
export type AccountOrderSection = 'ongoing' | 'actionRequired' | 'completed';
export type AccountOrderStatusKey = 'beforeProduction' | 'checkingArtwork' | 'completed';
export type AccountOrderAccentTone = 'warning' | 'success' | 'neutral';
export type AccountOrderArtworkStatusKey = 'lackingArtwork' | 'checkingArtwork';
export type AccountOrderActionKey = 'invoice' | 'paymentProof' | 'message';

export interface AccountOrderActionItem {
	key: AccountOrderActionKey;
	titleKey: 'viewInvoice' | 'paymentProof' | 'sendMessage';
	textKey: 'viewInvoiceText' | 'paymentProofText' | 'sendMessageText';
}

export interface AccountOrderLineItem {
	number: string;
	imageSrc: string;
	artworkStatusKey: AccountOrderArtworkStatusKey;
	size: string;
	quantity: number;
	priceLabel: string;
	actionLabelKey: 'uploadArtwork' | 'replaceArtwork';
	actionDisabled?: boolean;
}

export interface AccountOrderTotals {
	subtotalLabel: string;
	shippingFeeLabel: string;
	discountsLabel: string;
	totalLabel: string;
}

export interface AccountOrder {
	id: string;
	lifecycle: AccountOrderLifecycle;
	section: AccountOrderSection;
	accentTone: AccountOrderAccentTone;
	itemCount: number;
	date: string;
	statusKey: AccountOrderStatusKey;
	paymentStatusKey?: 'unpaid';
	paymentMethodLabel: string;
	actions: AccountOrderActionItem[];
	items: AccountOrderLineItem[];
	totals: AccountOrderTotals;
}