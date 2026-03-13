import type { AccountAddressBookItem } from '~/types/account/addressBook';

export const accountAddressBookItems: AccountAddressBookItem[] = [
	{
		name: 'Joy Love',
		phone: '+1 (551) 236-4533',
		address: '176-6, Yusan-ri, Gusan-myeon, Gaseong-si, Incheon 01000, Republic of Korea',
		company: 'Summit Inc.',
		tag: 'Home',
		section: 'shipping',
		isDefault: true,
	},
	{
		name: 'Joy Love',
		phone: '+1 (818) 922-5542',
		address: '9F, 310 Teheran-ro, Gangnam-gu, Seoul 06241, Republic of Korea',
		company: 'Lock&Lock Inc.',
		tag: 'Office',
		section: 'shipping',
	},
	{
		name: 'Joy Love',
		phone: '+1 (963) 524-8858',
		address: '18F, 45 Gwanggyo Jungang-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do 41577, Republic of Korea',
		company: 'Lock&Lock Inc.',
		tag: 'Client',
		section: 'shipping',
	},
	{
		name: 'Joy Love',
		address: '7F, 221 Jungang-daero, Dong-gu, Busan 48912, Republic of Korea',
		company: 'Summit Inc.',
		tag: 'Home',
		section: 'billing',
	},
	{
		name: 'Donna Miller',
		address: '12F, 88 Bongeunsa-ro, Gangnam-gu, Seoul 06153, Republic of Korea',
		company: 'Femme Inc.',
		tag: 'Client',
		section: 'dropShipping',
	},
];