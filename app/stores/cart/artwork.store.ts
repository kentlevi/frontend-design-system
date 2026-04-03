export const useArtworkStore = defineStore('artwork', () => {

	const artwork = ref<File>()

	return {
		artwork
	}
})