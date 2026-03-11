<script setup lang="ts">
import { redirectToCountryPath } from '~/composables/app/pageRedirect/usePageRedirect';

await redirectToCountryPath('/auth/profile', { replace: true });
</script>