<script setup lang="ts">
import MuFileInput from '~/components/base/MuFileInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useUploadArtworkModalContext } from '~/composables/features/account/orders/context/useUploadArtworkModalContext'

const {
	is_open,
	product,
	formatted_size,
	formatted_quantity,
	special_instructions,
	is_uploading,
	error,
	can_submit,
	close_modal,
	onFilePicked,
	submitUpload,
} = useUploadArtworkModalContext()
</script>

<template>
	<UiModal
		:model-value="is_open"
		width="640px"
		:title="$t('account.orders.uploadArtwork')"
		modal-class="upload-artwork-modal"
		@update:model-value="!$event && close_modal()"
	>
		<MuLinearWrapper class="upload-artwork-modal-body" direction="column" :gap="16">
			<MuLinearWrapper class="item-details" direction="column" :gap="4">
				<MuText weight="semi-bold">{{ $t('account.orders.upload.itemDetails') }}</MuText>
				<MuLinearWrapper direction="column">
					<MuLinearWrapper v-if="product" justify="space-between" width="100%">
						<MuText color="abyss-40">{{ $t('account.orders.upload.product') }}</MuText>
						<MuText color="abyss-40" weight="semi-bold">{{ product }}</MuText>
					</MuLinearWrapper>
					<MuLinearWrapper v-if="formatted_size" justify="space-between" width="100%">
						<MuText color="abyss-40">{{ $t('account.orders.upload.size') }}</MuText>
						<MuText color="abyss-40" weight="semi-bold">{{ formatted_size }}</MuText>
					</MuLinearWrapper>
					<MuLinearWrapper v-if="formatted_quantity" justify="space-between" width="100%">
						<MuText color="abyss-40">{{ $t('account.orders.upload.quantity') }}</MuText>
						<MuText color="abyss-40" weight="semi-bold">{{ formatted_quantity }}</MuText>
					</MuLinearWrapper>
				</MuLinearWrapper>
			</MuLinearWrapper>
			<MuLinearWrapper>
				<MuFileInput
					placeholder="Upload your artwork here"
					:accepted-formats="['.jpg', '.jpeg', '.png', '.pdf']"
					@change="onFilePicked"
				/>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" :gap="4">
				<MuText weight="semi-bold">{{ $t('account.orders.upload.specialInstructions') }}</MuText>
				<UiTextarea
					v-model="special_instructions"
					:placeholder="$t('account.orders.upload.specialInstructionsPlaceholder')"
					:disabled="is_uploading"
				/>
			</MuLinearWrapper>
			<MuText v-if="error" color="blood-base">{{ error }}</MuText>
		</MuLinearWrapper>

		<template #footer>
			<MuLinearWrapper justify="flex-end" align="center" :gap="12">
				<UiButton variant="ghost" tone="neutral" :disabled="is_uploading" @click="close_modal">
					<MuText>{{ $t('account.orders.upload.cancel') }}</MuText>
				</UiButton>
				<UiButton tone="neutral" :disabled="!can_submit" @click="submitUpload">
					<MuText>{{ is_uploading ? 'Uploading...' : $t('account.orders.upload.submit') }}</MuText>
				</UiButton>
			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<style lang="scss" scoped>
.item-details{
	padding: 16px 24px;
	background: var(--gray-10);
	border-radius: 8px;
}
</style>