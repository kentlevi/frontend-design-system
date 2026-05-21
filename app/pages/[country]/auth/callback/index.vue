<template>
	<div class="callback_container">
		<p>
			{{ translate('auth.callback.signingIn') }}
		</p>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRedirectStore } from '~/stores/navigation/redirect.store';
const { t: translate } = useI18n();
const { auth_redirect_url } = storeToRefs(useRedirectStore());

onMounted(() => {
	if (window.opener) {
		window.opener.postMessage(
			{ type: 'oauth_complete' },
			window.location.origin
		);
		window.close();
		return;
	}


	navigateTo(auth_redirect_url.value);
});
</script>