import type {
	CartTransferItem,
	LoginPayload,
	LoginResponse,
	NonMemberLoginVerificationPayload,
	NonMemberLoginVerificationResponse,
	SocialLoginPayload,
	SocialRedirectResponse,
	SubmitNonMemberLoginVerificationPayload,
} from '~/types/auth/auth'
import type { CartItem } from '~/types/cart/cart'
import type { ApiResponse } from '~/types/config/api'
import {
	checkoutNonMemberSubmitVerification,
	getCurrentAuthenticatedUser,
	logout,
	memberLogin,
	nonMemberSubmitVerification,
	sendCheckoutNonMemberLoginVerification,
	sendNonMemberLoginVerification,
	socialRedirect,
} from '~/services/auth/api.service'
import { useUsersStore } from '~/stores/users/users.store'
import { useCartStore as useStaticCartStore } from '~/stores/cart/cart.store'
import { useCartStore as useCoreCartStore } from '~/stores/core/cart/cart.store'

function toNumberOrNull(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value
	if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
		return Number(value)
	}
	return null
}

function toNumberOrZero(value: unknown): number {
	const numeric = toNumberOrNull(value)
	return numeric ?? 0
}

function toNullableString(value: unknown): string | null {
	if (typeof value !== 'string') return null
	const trimmed = value.trim()
	return trimmed === '' ? null : trimmed
}

function buildCartTransferItem(item: CartItem): CartTransferItem | null {
	const product_config_mapping_id = toNumberOrNull(item.product_config_mapping_id)
	const width = toNumberOrNull(item.width)
	const height = toNumberOrNull(item.height)
	const quantity = toNumberOrNull(item.quantity)
	const local_identity = toNullableString(item.local_identity)

	if (!product_config_mapping_id || !width || !height || !quantity) {
		return null
	}

	return {
		product_config_mapping_id,
		color_id: toNumberOrNull(item.color_id),
		font_id: toNumberOrNull(item.font_id),
		width: toNumberOrZero(width),
		height: toNumberOrZero(height),
		quantity: toNumberOrZero(quantity),
		lettering_text: toNullableString(item.lettering_text),
		artwork_file: toNullableString(item.artwork_file),
		artwork_file_name: toNullableString(item.artwork_file_name),
		instruction: toNullableString(item.instruction),
		local_identity,
	}
}

function getTransferCartItems(): CartTransferItem[] {
	const static_cart_store = useStaticCartStore()
	const core_cart_store = useCoreCartStore()
	const merged_items = [...static_cart_store.items, ...core_cart_store.items]

	const unique_items = new Map<string, CartItem>()

	merged_items.forEach((item) => {
		const local_identity = toNullableString(item.local_identity)
		const id_key = item.id ? `id:${item.id}` : null
		const key = local_identity ? `local:${local_identity}` : id_key

		if (!key || unique_items.has(key)) return
		unique_items.set(key, item)
	})

	return Array.from(unique_items.values())
		.map((item) => buildCartTransferItem(item))
		.filter((item): item is CartTransferItem => Boolean(item))
}

export function withCartTransferPayload<
	TPayload extends { cart_items?: CartTransferItem[] | null }
>(payload: TPayload): TPayload {
	if (payload.cart_items !== undefined) {
		return payload
	}

	const cart_items = getTransferCartItems()
	if (!cart_items.length) {
		return payload
	}

	return {
		...payload,
		cart_items,
	}
}

export const fetchAndStoreUser = async () => {
	const user_store = useUsersStore()
	user_store.auth_state_loading = true

	try {
		const response = await getCurrentAuthenticatedUser()

		const user = response.data?.user
		const profile = response.data?.profile ?? null

		if (!user) {
			user_store.clearUser()
			return false
		}

		user_store.setUser({
			...user,
			profile,
		})

		return true
	} catch {
		user_store.clearUser()
		return false
	} finally {
		user_store.auth_state_loading = false
		user_store.auth_state_ready = true
	}
}

export const logoutUser = async () => {
	const user_store = useUsersStore()

	try {
		const response = await logout()

		if (!response.success) {
			return false
		}

		user_store.clearUser()
		user_store.auth_state_loading = false
		user_store.auth_state_ready = true

		await navigateTo('/')

		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const loginMemberUser = async (
	payload: LoginPayload
): Promise<LoginResponse> => {
	try {
		const response = await memberLogin(withCartTransferPayload(payload))

		if (!response.success) {
			return response
		}

		storeAuthCookie(false, payload.remember_me)
		await fetchAndStoreUser()

		return response
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'login_error',
		} as LoginResponse
	}
}

export const requestNonMemberLoginVerification = async (
	payload: NonMemberLoginVerificationPayload,
	options: { is_checkout?: boolean } = {}
): Promise<NonMemberLoginVerificationResponse> => {
	try {
		const payload_with_cart = withCartTransferPayload(payload)

		if (options.is_checkout) {
			return await sendCheckoutNonMemberLoginVerification({
				email: payload_with_cart.email,
				is_resend: payload_with_cart.is_resend ? true : false,
				cart_items: payload_with_cart.cart_items,
			})
		}

		return await sendNonMemberLoginVerification(payload_with_cart)
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'non_member_login_error',
		} as NonMemberLoginVerificationResponse
	}
}

export const submitNonMemberLoginVerification = async (
	payload: SubmitNonMemberLoginVerificationPayload,
	options: { is_checkout?: boolean } = {}
): Promise<ApiResponse> => {
	try {
		const payload_with_cart = withCartTransferPayload(payload)

		if (options.is_checkout) {
			return await checkoutNonMemberSubmitVerification(payload_with_cart)
		}

		return await nonMemberSubmitVerification(payload_with_cart)
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'non_member_login_verification_error',
		} as ApiResponse
	}
}

export const requestSocialLoginRedirect = async (
	payload: SocialLoginPayload
): Promise<SocialRedirectResponse> => {
	try {
		return await socialRedirect(withCartTransferPayload(payload))
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'social_login_error',
		} as SocialRedirectResponse
	}
}

function storeAuthCookie(
	is_guest: boolean | number,
	remember_me: boolean | number
) {
	const token_duration_short = 60 * 60 * 24 * 3
	const token_duration_long = 60 * 60 * 24 * 90
	const token_duration = remember_me
		? token_duration_long
		: token_duration_short

	const guest_login_mode_cookie = useCookie<string | number | null>(
		'guest_login_mode',
		{
			maxAge: token_duration,
			sameSite: 'lax',
			path: '/',
		}
	)

	guest_login_mode_cookie.value = is_guest ? 1 : 0
}