<template>
    <div class="callback_container">
        <p>
            {{ token ? 'Signing you in...' : 'Cancelling...' }}
        </p>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

/* @desc reactive token state shared with template */
const token = ref<string | null>(null)

/* @desc handle OAuth callback and notify opener */
onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    const received_token = params.get('token')

    token.value = received_token

    if (!received_token) {
        window.close()
        return
    }

    let tokenDuration = 60 * 60 * 24 * 3;
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
