import { fetchUserAddresses } from "~/services/profile/address.service"

export const useCheckoutAddressFlow = () =>{

    const ship_to_another_address = useState('ship_to_another_address', () => false)
    const selected_shipping_address = useState('selected_shipping_address', () => [])

    const getShippingAddress = async () => {
    try {
        const response = await fetchUserAddresses({ type: 'shipping' });
        
        return response; // or assign to state
    } catch (error) {
        console.error(error);
    }
};
    
    return {
        ship_to_another_address,
        selected_shipping_address,
        getShippingAddress
    }


}