export interface AccountQuoteRequest {
    id: string;
    date: string;
    statusKey: string;
}

export const accountQuoteRequests: AccountQuoteRequest[] = [
    { id: '082410270004', date: '03/20/2025', statusKey: 'inReview' },
    { id: '082410270060', date: '02/28/2025', statusKey: 'pending' },
];
