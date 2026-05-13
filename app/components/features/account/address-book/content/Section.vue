<script setup lang="ts">
import type { AddressType } from '~/types/user-address';
import { useAddressBookSectionUI } from '~/composables/account/addressBook/useAddressBookSectionUI';

type SectionProps = {
	section: AddressType;
};

const props = defineProps<SectionProps>();

const { translate, items, loading } = useAddressBookSectionUI(props)
</script>

<template>
	<section
		class="account-profile-section"
		:data-testid="`account-address-book-section-${props.section}`"
	>
		<div class="account-profile-section-copy" data-testid="account-address-book-info">
			<template v-if="loading">
				<UiSkeleton width="180px" height="28px" class="account-profile-section-title-skeleton" />
				<UiSkeleton width="100%" height="20px" />
				<UiSkeleton width="80%" height="20px" class="account-profile-section-description-skeleton" />
			</template>
			<template v-else>
				<h2 class="account-profile-section-title">
					{{ translate(`account.addressBook.${props.section}Title`) }}
				</h2>
				<p class="account-profile-section-description">
					{{ translate(`account.addressBook.${props.section}Description`) }}
				</p>
			</template>
		</div>

		<div class="account-profile-section-main" data-testid="account-address-book-list">
			<div class="account-address-book-card-grid">
				<template v-if="loading">
					<FeaturesAccountAddressBookContentCard loading />
					<FeaturesAccountAddressBookContentCard loading />
				</template>
				<template v-else>
					<FeaturesAccountAddressBookContentCard
						v-for="(item, index) in items"
						:key="`${props.section}-${item.id}-${index}`"
						:item="item"
						:index="index"
					/>
				</template>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.account-profile-section {
	.account-profile-section-copy {
		.account-profile-section-title-skeleton {
			margin-bottom: 12px;
		}

		.account-profile-section-description-skeleton {
			margin-top: 4px;
		}
	}

	.account-profile-section-main {
		.account-address-book-card-grid {
			display: grid;
			gap: 16px;
		}
	}
}
</style>
