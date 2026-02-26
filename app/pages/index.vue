<script setup lang="ts">
const { locale } = useI18n();

await navigateTo(`/${locale.value}`);
</script>
