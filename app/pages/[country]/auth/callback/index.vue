<template>
	<div class="callback_container">
		<p>
			{{ t('auth.callback.signingIn') }}
		</p>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const { t } = useI18n()

const route = useRoute()

onMounted(() => {
	if (window.opener) {
		window.opener.postMessage({ type: 'oauth_complete' }, window.location.origin)
		window.close()
		return
	}

	const country =
		typeof route.params.country === 'string'
			? route.params.country
			: Array.isArray(route.params.country)
				? String(route.params.country[0] || '')
				: ''

	navigateTo(country ? `/${country}` : '/')
})
</script>

