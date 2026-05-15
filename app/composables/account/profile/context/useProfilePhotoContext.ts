import { useProfilePhoto } from './useProfilePhoto'

type composable_context = ReturnType<typeof useProfilePhoto>

const key = Symbol('profile-photo')

export function provideProfilePhoto() {
	const flow = useProfilePhoto()

	provide(key, flow)

	return flow
}

export function useProfilePhotoContext() {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useProfilePhotoContext')
	}

	return context
}