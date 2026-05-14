<script setup lang="ts">
// import AccountAddressBookPage from '~/components/account/pages/address-book/index.vue';
import { provideUserAddressData } from '~/composables/account/addressBook/context/useUserAddressDataContext';
import { provideUserAddressFormState } from '~/composables/account/addressBook/context/useUserAddressFormStateContext';
import { provideUserAddressUI } from '~/composables/account/addressBook/context/useUserAddressUIContext';
definePageMeta({
	layout: 'home',
	footerVariant: 'compact',
});

provideUserAddressData()
provideUserAddressUI()
provideUserAddressFormState()
</script>

<template>
	<FeaturesAccountAddressBook />
</template>
