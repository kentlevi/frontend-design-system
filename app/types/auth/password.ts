export interface SendResetPasswordLinkPayload {
	email: string;
}

export interface SubmitResetPasswordPayload {
	email: string;
	token: string;
	password: string;
	password_confirmation: string;
}

export interface ValidateTokenPayload {
	email: string;
	token: string;
}