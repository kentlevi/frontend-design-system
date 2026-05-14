<template>
	<div class="callback_container">
		<p>
			{{ translate('auth.callback.signingIn') }}
		</p>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRedirectStore } from '~/stores/navigation/redirect.store';
const { t: translate } = useI18n();
const { auth_redirect_url } = storeToRefs(useRedirectStore());

const route = useRoute();

onMounted(() => {
	if (window.opener) {
		window.opener.postMessage(
			{ type: 'oauth_complete' },
			window.location.origin
		);
		window.close();
		return;
	}

	const country =
		typeof route.params.country === 'string'
			? route.params.country
			: Array.isArray(route.params.country)
				? String(route.params.country[0] || '')
				: '';

	navigateTo(auth_redirect_url.value);
});
</script>