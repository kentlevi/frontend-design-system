<script setup lang="ts">
import LegalDocumentPage from '~/components/legal/LegalDocumentPage.vue';
import enPrivacyMessages from '../../../i18n/locales/en/legal/privacy.json';
import krPrivacyMessages from '../../../i18n/locales/kr/legal/privacy.json';

const { mergeLocaleMessage } = useI18n();

mergeLocaleMessage('us', enPrivacyMessages);
mergeLocaleMessage('kr', krPrivacyMessages);
</script>

<template>
	<LegalDocumentPage document-key="privacy" />
</template>