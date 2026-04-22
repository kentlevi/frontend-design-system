import { useCartService } from "~/services/cart/cart.service"

export const useCartDeletion = (caller: string) => {

	const cart_service = useCartService()

	const open_deletion_modal = computed(() => Boolean(cart_service.deletion_id.value) || cart_service.deletion_ids.value.length > 0)

	const confirmDeletion = () => {


	}

	return {
		// 🔥 States
		caller,
		open_deletion_modal,

		// 🔥 Methods
		confirmDeletion,
	}
}