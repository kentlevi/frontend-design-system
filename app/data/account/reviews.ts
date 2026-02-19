export interface AccountReview {
    titleKey: string;
    rating: number;
    date: string;
    textKey: string;
}

export const accountReviews: AccountReview[] = [
    {
        titleKey: 'firstImpression',
        rating: 5,
        date: '05/20/2024',
        textKey: 'firstImpression',
    },
    {
        titleKey: 'greatQuality',
        rating: 4,
        date: '04/22/2024',
        textKey: 'greatQuality',
    },
];
