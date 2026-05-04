import type { AddressMap, AddressType } from "~/types/user-address";

export type MenuActionKey = 'edit' | 'delete' | 'default';

export function useUserAddress() {
	/** GENERAL ADDRESS CONTEXT */

	/**
     * Types
     */
	type MenuPayload = {
		action: MenuActionKey
		item: AddressMap[AddressType]
	}

	/**
     * Functions
     */
	function handleCardMenuAction(payload: MenuPayload) {
		if (payload.action === 'edit') {
			// openEditModal(payload.item)
			// return
		}

		if (payload.action === 'delete') {
			// startDeleteFlow(payload.item)
			// return
		}

		if (payload.action === 'default') {
			// startDefaultFlow(payload.item)
		}
		console.log(payload.action);
	}

	return {
		handleCardMenuAction
	}
}