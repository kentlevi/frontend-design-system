import { useUsersStore } from "~/stores/users/users.store";
import type { CartItem, SelectOption } from "~/types/cart/cart";
import { cartPaymentOptions } from '~/data/cart/page';

export const useCartStore = defineStore('cart', () => {

	const user_store = useUsersStore()

	const items = ref<CartItem[]>([])

	const loading = ref<boolean>(false)

	const number_of_items = ref<number>(0)

	const grand_total = ref<number>(0)

	const selected_ids = ref<string[]>([])

	const deletable_ids  = ref<string[]>([])

	// Holder of the ID of carts owner

	const cart_holder = computed(() => user_store.state?.id ?? null)

	const selected_item = ref<CartItem | null>(null)

	const selected_item_id = computed(() => selected_item.value && selected_item.value.id ? selected_item.value.id : null)

	const editable_item = ref<CartItem | null>(null)

	const item_picking_artwork = ref<CartItem | null>(null)

	const is_authenticated = computed(() => Boolean(user_store.state?.id))

	const payment_options = computed(() => cartPaymentOptions);

	const all_selected = computed({
		get: () => items.value.length > 0 && selected_ids.value.length === items.value.length,
		set: (checked: boolean) => {
			selected_ids.value = checked ? items.value.map((row) => row.local_identity) : [];
		},
	});

	const selected_total_cost = computed(() => {
		if( !selected_ids.value.length )
			return 0

		const tot_cost = items.value.reduce((acc: number, item: CartItem) => {
			if( selected_ids.value.includes(item.local_identity) )
				return acc + item.cost

			return acc;
		}, 0)

		return tot_cost;
	})

	const selected_real_ids = computed<number[] | null>(() => {
		if (!selected_ids.value.length) {
			return null
		}

		const ids = items.value.filter(e =>
			e.local_identity !== null &&
			selected_ids.value.includes(e.local_identity)
			&&  e.id !== null
		).map(e => e.id as number)

		return ids.length ? ids : null
	})

	const selected_items = computed<CartItem[]>(() => {
		if (!selected_ids.value.length)
			return [];

		return items.value.filter(e =>
			e.local_identity !== null &&
			selected_ids.value.includes(e.local_identity)
		)
	})

	const addItem = (item: CartItem) => {
		items.value.unshift(item)
		grand_total.value += Number(item.cost)
		addNumber()

		// Default check the new item
		addSelected(item.local_identity)
	}

	const addNumber = () => {
		number_of_items.value++
	}

	const reduceNumber = () => {
		number_of_items.value--
	}


	const addSelected = (local_identity: string) => {
		if (!selected_ids.value.includes(local_identity))
			selected_ids.value.push(local_identity);
	}

	const removeSelected = (local_identity: string) => {
		// Filter creates a new array without the item, if it exists
		selected_ids.value = selected_ids.value.filter(id => id !== local_identity);
	};

	const updateUploadedItem = (local_identity: string, new_id: number) => {
		updateItemInCart(local_identity, { id: new_id })
	}

	const setDeletableItems = (local_identities : string []) => {
		if( !local_identities.length )
			return

		deletable_ids.value = local_identities
	}

	const emptyDeletableItems = () => {
		deletable_ids.value = []
	}

	const syncNumber = (total_count: number, total_cost: number) => {
		number_of_items.value = Number(total_count)
		grand_total.value = Number(total_cost)
	}

	const emptyCart = (preserve_unsave_item : boolean = false) => {
		selected_ids.value = []
		emptyDeletableItems()

		// 🔥 Preserve the unsave item
		if( preserve_unsave_item )
			items.value = items.value.filter( e => !e.id)
		else
			items.value = []

		number_of_items.value = 0
		grand_total.value = 0
		item_quantities.value = {}
	}

	/**
	 * Removing all deletable items in browers storage
	 */
	const removeItems = () => {
		items.value = items.value.filter(e => !deletable_ids.value.includes(e.local_identity) )
		selected_ids.value = selected_ids.value.filter(id => !deletable_ids.value.includes(id));
	}

	/**
	 * Assign an item as editable
	 */
	const assignEditableItem = (item : CartItem) => {
		editable_item.value = item
	}

	/**
	 * Unset or removing an item as editable
	 */
	const  unsetEditableItem = () => {
		editable_item.value = null
	}

	/**
	 * Assign an item that requires artwork
	 */
	const assignArtworkPicker = (item : CartItem) => {
		item_picking_artwork.value = item
	}

	/**
	 * Unset or remove an item as picker for artwork
	 */
	const unsetArtworkPicker = () => {
		item_picking_artwork.value = null
	}

	const updateItemInCart = (local_identity: string, updates: Partial<CartItem>) => {
		// Find the index of the item
		const index = items.value.findIndex(item => item.local_identity === local_identity);

		if (index !== -1) {
			const current_item = items.value[index];

			if(!current_item) {
				console.warn('No item found.')
				return
			}

			// 1. Loop through the update keys
			for (const key in updates) {
				// 2. Validation: Check if the key exists in the current CartItem
				if (!(key in current_item)) {
					console.warn(`Property "${key}" does not exist on CartItem. Exit.`);
					return
				}
			}

			// 2. Merge current item with the updates
			// This maintains reactivity and doesn't overwrite the whole object
			items.value[index] = {
				...items.value[index],
				...updates
			} as CartItem
		}
	}

	// This holds the tiers. Initially it only contains the current quantity.
	const item_quantities = ref<Record<string, SelectOption[]>>({});

	// 1. Initialize the map with only the current quantity
	const initQuantityMap = () => {
		items.value.forEach(item => {
			if (item.local_identity && !item_quantities.value[item.local_identity]) {
				// We wrap the current quantity in an array so the <select> works
				item_quantities.value[item.local_identity] = [
					{
						label: String(item.quantity),
						value: item.quantity
					},
					{
						label: 'Custom',
						value: -1
					}
				];
			}
		});
	};

	const setItemQuantities = ( local_identity: string, quantities : SelectOption[] ) => {
		item_quantities.value[local_identity] = quantities;
	}

	return {
		// 🔥 States
		cart_holder,
		items,
		loading,
		number_of_items,
		grand_total,
		selected_ids,
		selected_item,
		selected_item_id,
		all_selected,
		deletable_ids,
		is_authenticated,
		editable_item,
		selected_total_cost,
		payment_options,
		item_picking_artwork,
		selected_real_ids,
		selected_items,
		item_quantities,

		// 🔥 Methods
		addNumber,
		reduceNumber,
		addSelected,
		removeSelected,
		updateUploadedItem,
		setDeletableItems,
		emptyDeletableItems,
		syncNumber,
		emptyCart,
		removeItems,
		addItem,
		assignEditableItem,
		unsetEditableItem,
		assignArtworkPicker,
		unsetArtworkPicker,
		updateItemInCart,
		setItemQuantities,
		initQuantityMap,
	}
}, {
	persist: {
		key: 'mu_cart',
		storage: persistedState.localStorage,
		pick: ['items', 'number_of_items', 'grand_total', 'selected_ids', 'cart_holder'],
	}
})