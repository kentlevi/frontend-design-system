export interface AccountCoupon {
    titleKey: string;
    code: string;
    expiry: string;
    tag: string;
}

export const accountCoupons: AccountCoupon[] = [
    {
        titleKey: 'laborMonthDiscount',
        code: 'LABORMAY10',
        expiry: '05/30/2025',
        tag: 'Unlimited Use',
    },
    {
        titleKey: 'birthdayMonthDiscount',
        code: 'BIRTHMONTH20',
        expiry: '12/31/2025',
        tag: 'Multiple-Use',
    },
    {
        titleKey: 'paperStickerDiscount',
        code: 'PAPER15',
        expiry: '12/31/2025',
        tag: 'Single Use',
    },
];
