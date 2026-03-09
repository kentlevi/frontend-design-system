<script setup lang="ts">
import { redirectToCountryPath } from '~/composables/app/usePageRedirect';

await redirectToCountryPath('/auth/profile', { replace: true });
</script>