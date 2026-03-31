export const checkoutRequest = async () => {
    const { $api } = useNuxtApp()
    return await $api.post(`orders/checkout`)
}