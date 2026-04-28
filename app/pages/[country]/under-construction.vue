<script setup lang="ts">
import { definePageMeta } from '#imports';
import StatusBackgroundWrapper from '~/components/common/StatusBackgroundWrapper.vue';
import { useCountry } from '~/composables/app/country/useCountry';
const { t } = useI18n();

definePageMeta({
	layout: 'home',
	hideHeader: true,
	hideFooter: true,
});

const { withCountry } = useCountry();
const launch_email = ref('')

const is_launch_email_valid = computed(() => {
	const trimmed_email = launch_email.value.trim()
	if (!trimmed_email) return false

	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed_email)
})

function submitLaunchInterest() {
	if (!is_launch_email_valid.value || !import.meta.client) return

	const subject = encodeURIComponent('Musticker Launch Invite')
	const body = encodeURIComponent(`Please notify me when Musticker launches.\n\nEmail: ${launch_email.value.trim()}`)

	window.location.href = `mailto:info@mustickers.com?subject=${subject}&body=${body}`
}
</script>

<template>
	<StatusBackgroundWrapper test-id="under-construction-page" :full-height="true">
		<div class="under-construction-top-group">
			<UiLogo
				name="musticker"
				variant="full"
				color="colored"
				:size="88"
				class="under-construction-logo"
			/>
			<div class="under-construction-content-group">
				<div class="under-construction-heading-group">
					<h1 class="under-construction-title">{{ t('underConstruction.title') }}</h1>
					<p class="under-construction-copy">
						{{ t('underConstruction.description') }}
					</p>
				</div>

				<div class="under-construction-action-group">
					<div class="under-construction-email-group">
						<p class="under-construction-email-copy">
							{{ t('underConstruction.emailPrompt') }}
						</p>

						<div class="under-construction-email-form">
							<UiInput
								v-model="launch_email"
								type="email"
								size="md"
								icon-left="mail"
								:placeholder="t('underConstruction.emailPlaceholder')"
								class="under-construction-email-input"
							/>

							<UiButton
								variant="filled"
								tone="default"
								size="md"
								class="under-construction-notify-button"
								:disabled="!is_launch_email_valid"
								@click="submitLaunchInterest"
							>
								{{ t('underConstruction.notifyMe') }}
							</UiButton>
						</div>
					</div>

					<NuxtLink :to="withCountry('/')" class="under-construction-cta">
						{{ t('underConstruction.returnHome') }}
					</NuxtLink>
				</div>
			</div>

			<img
				src="/illustrations/under-construction/boy-3.svg"
				alt=""
				class="under-construction-boy"
			>
		</div>
	</StatusBackgroundWrapper>
</template>

<style scoped lang="scss">
.under-construction-top-group {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 56px;
}

.under-construction-logo {
    display: block;
    margin: 0 auto;
}

.under-construction-content-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
}

.under-construction-heading-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.under-construction-title {

    font-size: var(--type-size-650);
    line-height: var(--type-line-650);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    letter-spacing: -0.03em;
    text-align: center;
}

.under-construction-copy {

    max-width: 900px;
    text-align: center;
    font-size: var(--type-size-300);
    line-height: var(--type-line-300);
    color: var(--text-primary);
}

.under-construction-action-group {
    width: min(100%, 720px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
}

.under-construction-email-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
}

.under-construction-email-copy {
    max-width: 680px;
    text-align: center;
    font-size: var(--type-size-200);
    line-height: var(--type-line-200);
    color: var(--text-primary);
}

.under-construction-email-form {
    width: 100%;
    display: flex;
    align-items: stretch;
    gap: 12px;
}

.under-construction-email-input {
    flex: 1 1 auto;
}

.under-construction-notify-button {
    min-width: 176px;
    border-radius: 18px;
}

.under-construction-cta {
    min-height: 48px;
    padding: 10px 32px;
    border-radius: 18px;
    background: var(--text-primary);
    color: var(--white-base);
    text-decoration: none;
    font-size: var(--type-size-200);
    font-weight: var(--font-weight-semibold);
    line-height: var(--type-line-300);
}

.under-construction-boy {
    width: 400px;
    height: auto;
    display: block;
    margin: 0 auto;
}

@media (max-width: 900px) {
    .under-construction-top-group {
        gap: 14px;
    }

    .under-construction-content-group {
        gap: 28px;
    }

    .under-construction-email-form {
        flex-direction: column;
    }

    .under-construction-notify-button,
    .under-construction-cta {
        min-height: 50px;
        width: 100%;
        padding: 0 24px;
        border-radius: 14px;
    }

    .under-construction-boy {
        margin-bottom: 12px;
    }
}
</style>