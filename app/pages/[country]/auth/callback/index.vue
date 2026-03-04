<template>
	<div class="callback_container">
		<p>
			{{ token ? t('auth.callback.signingIn') : t('auth.callback.cancelling') }}
		</p>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const { t } = useI18n()

const route = useRoute()
const token = ref<string | null>(null)

// populate synchronously so there's no "cancelling" flash
const received_token = (route.query.token as string) || null
token.value = received_token

/* @desc handle OAuth callback and notify opener */
onMounted(() => {
	// no need to re‑parse; we already have `received_token`
	if (!received_token) {
		window.close()
		return
	}

	const tokenDuration = 60 * 60 * 24 * 3;
	// store auth_token in cookie
	const authToken = useCookie('auth_token', {
		maxAge: tokenDuration,
		sameSite: 'lax',
		path: '/'
	})

	authToken.value = received_token ?? ''

	/* notify parent window */
	if (window.opener) {
		window.opener.postMessage(
			{ type: 'oauth_success', token: received_token },
			window.location.origin
		)
	}

	/* close popup */
	window.close()
})
</script>