<script setup lang="ts">
import { navigateTo } from '#imports';

const { locale } = useI18n();

await navigateTo(`/${locale.value}`);
</script>