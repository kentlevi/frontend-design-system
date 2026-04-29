import type { ApiResponse } from '~/types/config/api'
import type { UserIdentity, UserProfile } from '~/types/auth/user'

export type LoginMemberType = 'member' | 'non-member'

export type LoginResponse = ApiResponse<LoginData>

export interface LoginData {
	user?: UserIdentity
	& { profile: UserProfile | null };
}

export interface CartTransferItem {
	product_config_mapping_id: number;
	color_id: number | null;
	font_id: number | null;
	width: number;
	height: number;
	quantity: number;
	lettering_text: string | null;
	artwork_file: string | null;
	artwork_file_name: string | null;
	instruction: string | null;
	local_identity: string | null;
}

export interface LoginPayload {
	email: string;
	password: string;
	remember_me: boolean | number;
	cart_items?: CartTransferItem[] | null
}

export interface NonMemberLoginVerificationPayload {
	email: string;
	order_number: string;
	is_resend?: boolean;
	cart_items?: CartTransferItem[] | null;
}

export interface CheckoutNonMemberLoginVerificationPayload {
	email: string;
	is_resend?: boolean;
	cart_items?: CartTransferItem[] | null;
}

export type NonMemberLoginVerificationResponse = ApiResponse<NonMemberLoginVerification>

export interface NonMemberLoginVerification {
	email: string;
	token: string;
	expires_in: number;
	otp_sent?: boolean;
	cooldown_remaining?: number;
}

export interface NonMemberVerificationCache {
	email: string;
	order_number: string;
	token?: string;
	expires_in?: number;
	cached_at: number;
	resend_cooldown_until?: number
}

export interface SubmitNonMemberLoginVerificationPayload {
	email?: string | null;
	order_number?: string | null;
	login_token?: string | null;
	otp: string;
	cart_items?: CartTransferItem[] | null;
}

export interface RegisterVerificationPayload {
	given_name: string;
	family_name: string;
	email: string;
	password: string;
	terms_of_service: boolean | number;
	newsletter: boolean | number;
	is_resend?: boolean;
}

export type RegisterVerificationResponse = ApiResponse<RegisterVerification>

export interface RegisterVerification {
	email: string;
	token: string;
	expires_in: number;
	otp_sent?: boolean;
	cooldown_remaining?: number;
	given_name?: string;
	password?: string;
	terms_of_service?: string;
	code?: string;
}

export interface RegisterPayload {
	email?: string | null;
	registration_token?: string | null;
	otp: string;
	cart_items?: CartTransferItem[] | null;
}

export type SocialRedirectResponse = ApiResponse<SocialRedirect>

export interface SocialRedirect {
	url: string
}

export interface SocialLoginPayload {
	provider: string
	cart_items?: CartTransferItem[] | null
}

export interface OnboardingPayload {
	fields?: Record<string, string>;
	email?: string;
	offers_emails?: boolean;
	reviews_emails?: boolean;
}