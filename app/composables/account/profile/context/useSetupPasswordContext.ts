import { useSetupPassword } from './useSetupPassword'

type composable_context = ReturnType<typeof useSetupPassword>

const key = Symbol('setup-password')

export function provideSetupPassword() {
	const flow = useSetupPassword()

	provide(key, flow)

	return flow
}

export function useSetupPasswordContext() {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useSetupPasswordContext')
	}

	return context
}