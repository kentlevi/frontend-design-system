import { fetchUserAddresses } from "~/services/profile/address.service"
import { useMainCheckOutStore } from "~/stores/checkout/index.store";

export const useCheckoutAddressFlow = () =>{

    const checkout_store = useMainCheckOutStore()
    const {
        ship_to_another_address
    } = storeToRefs(checkout_store)

    const getShippingAddress = async () => {
        try {
            const response = await fetchUserAddresses({ type: 'shipping' });
            const addresses = response?.data || []
            checkout_store.setSavedShippingAddresses(addresses)

            const default_address = addresses.find((addr: any) => addr.is_default === 1)
            const selected = default_address || addresses[0] || null

            checkout_store.setShippingAddress(selected)
            ship_to_another_address.value = !selected

            return response;

        } catch (error) {
            console.error(error);
        }
    };
    
    return {
        getShippingAddress
    }


}