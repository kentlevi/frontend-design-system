export type AccountUnit = 'millimeter' | 'inch';

export interface AccountMockUser {
    firstName: string;
    lastName: string;
    email: string;
}

export const accountProfileDefaults: AccountMockUser = {
    firstName: 'Joy',
    lastName: 'Love',
    email: 'joylove1990@gmail.com',
};
