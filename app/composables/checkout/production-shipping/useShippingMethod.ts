import { useCartStore } from '~/stores/core/cart/cart.store'
import { useProductionShippingStore } from '~/stores/production-shipping/production-shipping.store'
import { formatShippingDateRange } from '~/utils/shipping/dateRange'
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressFormCheckoutContext } from '../address/context/addressFormCheckoutContext'
import { useUsersStore } from '~/stores/users/users.store'
import type { AvailableShippingMethod } from '~/types/production-shipping/production-shipping'
import type { ShippingMethodItem } from '~/types/shipping/shipping'
import { fetchShippingMethodsService } from '~/services/production-shipping/production-shipping.service';

const selected_shipping_key = ref<string>('')
const shipping_method_id = ref<number | null>(null)
const production_shipping_id = ref<number | null>(null)

export function useShippingMethod() {
	const { t: translate } = useI18n()

	const cart_store = useCartStore()
	const checkout_store = useMainCheckOutStore()
	const production_shipping_store = useProductionShippingStore()

	const { is_authenticated } = useUsersStore()
	const { shipping_form } = useAddressFormCheckoutContext()
	const { selected_ids } = storeToRefs(cart_store)
	const { available_shipping_methods, is_loading } = storeToRefs(production_shipping_store)

	const active_shipping_methods = computed<ShippingMethodItem[]>(() =>
		mapShippingMethodDataToUi(available_shipping_methods.value)
	)

	const selected_shipping_method = computed<ShippingMethodItem | null>(() => {
		return active_shipping_methods.value.find(
			(method) => method.key === selected_shipping_key.value
		) || null
	})

	const selected_cart_items = computed(() =>
		cart_store.items.filter((item) => {
			const local_identity = item.local_identity
			return selected_ids.value.includes(local_identity)
		})
	)

	const fetchShippingMethods = async (): Promise<void> => {
		await fetchShippingMethodsService(
			{
				is_authenticated,
				selected_cart_items: selected_cart_items.value,
				postcode: shipping_form.value.postcode,
				fields: shipping_form.value.fields
			}
		)

		syncSelectionWithActiveMethods()
	}

	/* @desc map stored shipping methods into a UI-friendly shipping method structure
	@param AvailableShippingMethod[] shipping_methods - raw shipping method response list
	@return ShippingMethodItem[] - mapped shipping methods
	*/
	const mapShippingMethodDataToUi = (
		shipping_methods: AvailableShippingMethod[]
	): ShippingMethodItem[] => {
		return shipping_methods.map((item) => {
			const formatted_date_range = formatShippingDateRange(
				item.min_delivery_date,
				item.max_delivery_date,
			)

			return {
				key: item.shipping_method_code,
				name: item.shipping_method_name,
				date: formatted_date_range,
				longer_date_message: `${translate('checkout.shipping.longer_date_message')} ${formatted_date_range}`,
				price: item.shipping_price === 0 ? 'Free' : `$${item.shipping_price}`,
				icon: `/icons/custom/checkout/${item.shipping_method_code}-shipping.svg`,
				shipping_method_id: item.shipping_method_id,
				production_shipping_id: item.production_shipping_id,
				cart_item_ids: item.cart_item_ids,
				description: item.description,
			}
		})
	}

	/* @desc select a shipping method by its key and sync its production_shipping_id
	@param string key - shipping method code
	@return void
	*/
	const selectShippingMethod = (key: string): void => {
		setSelectedShippingMethod(key)
	}

	/* @desc keep selected method valid after refresh or default to first available method
	@return void
	*/
	const syncSelectionWithActiveMethods = (): void => {
		const exists = active_shipping_methods.value.some(
			method => method.key === selected_shipping_key.value
		)

		if (exists) return

		const default_method = active_shipping_methods.value[0]

		if (!default_method) {
			clearSelectedShippingMethod()
			return
		}

		setSelectedShippingMethod(default_method.key)
		checkout_store.setShippingMethodId(default_method.shipping_method_id)
	}

	/* @desc set the current selected shipping method and its shipping ids
	@param object|null selection - selected method payload or null to clear
	@return void
	*/
	const setSelectedShippingMethod = (key: string | null): void => {
		if (!key) {
			selected_shipping_key.value = ''
			shipping_method_id.value = null
			production_shipping_id.value = null
			checkout_store.setShippingMethodId(null)
			return
		}

		const method = active_shipping_methods.value.find(m => m.key === key)

		if (!method) return

		selected_shipping_key.value = method.key
		shipping_method_id.value = method.shipping_method_id
		production_shipping_id.value = method.production_shipping_id

		checkout_store.setShippingMethodId(method.shipping_method_id)
	}

	/* @desc clear the selected shipping method state
	@return void
	*/
	const clearSelectedShippingMethod = (): void => {
		selected_shipping_key.value = ''
		shipping_method_id.value = null
		production_shipping_id.value = null
		checkout_store.setShippingMethodId(null)
	}

	watch(
		() => [...selected_ids.value],
		() => {
			void fetchShippingMethods()
		},
		{ immediate: true }
	)

	// const isFormComplete = computed(() => {
	// 	const { postcode, fields } = shipping_form.value

	// 	return (
	// 		postcode &&
	// 		Object.values(fields).every(value => value)
	// 	)
	// })

	// watch(
	// 	isFormComplete,
	// 	(isComplete, _old, on_cleanup) => {
	// 		if (!isComplete) return

	// 		const timeout = setTimeout(() => {
	// 			void fetchShippingMethods()
	// 		}, 500)

	// 		on_cleanup(() => {
	// 			clearTimeout(timeout)
	// 		})
	// 	}
	// )

	return {
		translate,
		is_loading,

		production_shipping_id,
		shipping_method_id,
		selected_shipping_key,

		selected_shipping_method,
		active_shipping_methods,

		setSelectedShippingMethod,
		clearSelectedShippingMethod,
		selectShippingMethod,
	}
}