import { useForgotPasswordForm } from './useForgotPasswordForm'

type composable_context = ReturnType<typeof useForgotPasswordForm>

const key = Symbol('forgot-password-form')

export function provideForgotPasswordForm() {
	const flow = useForgotPasswordForm()

	provide(key, flow)

	return flow
}

export function useForgotPasswordFormContext() {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useForgotPasswordFormContext')
	}

	return context
}