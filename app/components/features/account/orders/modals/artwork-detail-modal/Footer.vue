<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuLink from '~/components/base/MuLink.vue';
import { useFinalProofTermsModal } from '~/composables/features/account/orders/useFinalProofTermsModal';

const emit = defineEmits<{
	(e: 'open-terms'): void;
}>();

const { open_modal: open_final_proof_terms_modal } = useFinalProofTermsModal();

function onOpenTerms() {
	emit('open-terms');
	open_final_proof_terms_modal();
}
</script>

<template>
	<div class="artwork-detail-footer">
		<MuLinearWrapper align="center" justify="center" width="100%" class="artwork-detail-footer__row">
			<MuLink @click.prevent="onOpenTerms">
				Final Proof Terms of Service
			</MuLink>
		</MuLinearWrapper>
	</div>
</template>

<style scoped lang="scss">
.artwork-detail-footer {
	padding: 20px 24px;
	border-top: 1px solid var(--border-default);
	background: var(--bg-surface);
}
</style>