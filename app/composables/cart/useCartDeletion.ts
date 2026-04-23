import { useCartApiService } from "~/services/core/cart/api.service"
import { useCartService } from "~/services/core/cart/cart.service"

export const useCartDeletion = (caller: string) => {

	const cart_service = useCartService('cart-deletion')

	const cart_api_service = useCartApiService('cart-deletion')

	const open_deletion_modal = computed(() => Boolean(cart_service.deletable_ids.value) && cart_service.deletable_ids.value.length > 0)

	const deleting = ref<boolean>(false)

	const confirmDeletion = async () => {
		try {
			deleting.value = true
			// removing item in local storage
			await cart_service.removeItems()

			const deletion_request = await cart_api_service.requestDeletion(cart_service.deletable_ids.value)

			if( deletion_request ) {
				cart_service.calculateCartItems()
				// removing the deletable items since it was already deleted
				cart_service.emptyDeletableItems()
			}
		} catch(error ) {
			console.error(error)
		} finally {
			deleting.value = false
		}
	}

	watch(() => open_deletion_modal.value, () => {
		console.log(open_deletion_modal.value)
	})

	const cancelDeletion = () => {

		if( deleting.value )
			return

		cart_service.emptyDeletableItems()
	}

	return {
		// 🔥 States
		caller,
		open_deletion_modal,
		deleting,

		// 🔥 Methods
		confirmDeletion,
		cancelDeletion,
	}
}