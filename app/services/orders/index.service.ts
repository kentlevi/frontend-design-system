export const fetchOrderCompletionDetails = async (order_id : Number) => {
    const { $api } = useNuxtApp()
    return await $api.get(`orders/completion/details/${order_id}`)
}