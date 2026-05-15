import { useChangeEmailForm } from './useChangeEmailForm'

type composable_context = ReturnType<typeof useChangeEmailForm>

const key = Symbol('change-email-form')

export function provideChangeEmailForm() {
	const flow = useChangeEmailForm()

	provide(key, flow)

	return flow
}

export function useChangeEmailFormContext() {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useChangeEmailFormContext')
	}

	return context
}