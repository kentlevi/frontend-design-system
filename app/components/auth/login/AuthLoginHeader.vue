<script setup lang="ts">
import { useCountry } from '@/composables/app/country/useCountry';

const props = withDefaults(defineProps<{
	registerAsAction?: boolean;
}>(), {
	registerAsAction: false,
});

const emit = defineEmits<{
	(e: 'open-register'): void;
}>();

const { t } = useI18n();
const { withCountry } = useCountry();
</script>

<template>
	<div class="auth-login-header" data-testid="auth-login-header">
		<h1 class="auth-login-title">{{ t('auth.login.title') }}</h1>
		<p class="auth-login-subtitle">
			{{ t('auth.login.subtitle') }}
			<NuxtLink
				v-if="!props.registerAsAction"
				:to="withCountry('/auth/register')"
				class="auth-login-create-account-link"
				data-testid="auth-login-create-account-link"
			>
				{{ t('auth.login.createAccount') }}
			</NuxtLink>
			<button
				v-else
				type="button"
				class="auth-login-create-account-link"
				data-testid="auth-login-create-account-link"
				@click="emit('open-register')"
			>
				{{ t('auth.login.createAccount') }}
			</button>
		</p>
	</div>
</template>

<style lang="scss">
.auth-login-header {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .auth-login-title {

        text-align: center;
        color: var(--text-primary);
        font-size: var(--type-size-500);
        line-height: var(--type-line-500);
    }

    .auth-login-subtitle {

        text-align: center;
        color: var(--text-secondary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);

        .auth-login-create-account-link {
            color: var(--text-primary);
            font-weight: var(--font-weight-bold);
            text-decoration: underline;
			background: transparent;
			border: 0;
			padding: 0;
			cursor: pointer;
        }
    }
}
</style>