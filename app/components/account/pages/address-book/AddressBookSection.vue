<script setup lang="ts">
import type { AddressMap, AddressType } from '~/types/user-address';
import AddressBookCard from './AddressBookCard.vue';

type SectionProps = {
	section: AddressType;
	items: AddressMap[AddressType][];
	loading?: boolean;
};

const props = defineProps<SectionProps>();

const { t } = useI18n();
</script>

<template>
	<section
		class="account-profile-section"
		:data-testid="`account-address-book-section-${props.section}`"
	>
		<div class="account-profile-section-copy" data-testid="account-address-book-info">
			<template v-if="props.loading">
				<UiSkeleton width="180px" height="28px" class="account-profile-section-title-skeleton" />
				<UiSkeleton width="100%" height="20px" />
				<UiSkeleton width="80%" height="20px" class="account-profile-section-description-skeleton" />
			</template>
			<template v-else>
				<h2 class="account-profile-section-title">
					{{ t(`account.addressBook.${props.section}Title`) }}
				</h2>
				<p class="account-profile-section-description">
					{{ t(`account.addressBook.${props.section}Description`) }}
				</p>
			</template>
		</div>

		<div class="account-profile-section-main" data-testid="account-address-book-list">
			<div class="account-address-book-card-grid">
				<template v-if="props.loading">
					<AddressBookCard loading />
					<AddressBookCard loading />
				</template>
				<template v-else>
					<AddressBookCard
						v-for="(item, index) in props.items"
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