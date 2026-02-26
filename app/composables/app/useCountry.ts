export const useCountry = () => {
    const route = useRoute()
    const country = computed(() => String(route.params.country).toLowerCase())
    return { country }
}