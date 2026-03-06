export default defineNuxtPlugin(() => {
	const deviceUuid = useCookie('device_uuid', { maxAge: 10 * 365 * 24 * 60 * 60 })

	if (!deviceUuid.value) {
		// Generate a new UUID if it doesn't exist
		deviceUuid.value = crypto.randomUUID()
	}
	// If it exists, do nothing - it's already persistent
})