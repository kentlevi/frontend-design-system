export type ReviewCard = {
    id: string;
    author: string;
    date: string;
    mediaClass: 'is-glass' | 'is-bike' | 'is-wheel' | 'is-holo';
};

export const reviewCards: ReviewCard[] = [
    {
        id: 'glass',
        author: 'Ciara E.',
        date: '03/02/2023',
        mediaClass: 'is-glass',
    },
    {
        id: 'bike',
        author: 'Renato F.',
        date: '03/02/2023',
        mediaClass: 'is-bike',
    },
    {
        id: 'quality',
        author: 'Rendon L.',
        date: '03/02/2023',
        mediaClass: 'is-wheel',
    },
    {
        id: 'holo',
        author: 'Mitchiel A.',
        date: '03/02/2023',
        mediaClass: 'is-holo',
    },
];
