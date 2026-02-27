<script setup lang="ts">
const route = useRoute();
const country = String(route.params.country || 'en').toLowerCase();

await navigateTo(`/${country}/auth/profile`, { replace: true });
</script>
