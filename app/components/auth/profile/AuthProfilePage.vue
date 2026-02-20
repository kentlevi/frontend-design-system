<script setup lang="ts">
import AuthProfileDetailsStep from '@/components/auth/profile/AuthProfileDetailsStep.vue';
import AuthProfileSettingsStep from '@/components/auth/profile/AuthProfileSettingsStep.vue';
import AuthProfileSidebar from '@/components/auth/profile/AuthProfileSidebar.vue';
import AuthProfileWelcomeToast from '@/components/auth/profile/AuthProfileWelcomeToast.vue';
import { useAuthProfileSetup } from '@/composables/auth/useAuthProfileSetup';

definePageMeta({
    layout: 'home',
});

const {
    step,
    showWelcomeToast,
    firstName,
    lastName,
    email,
    photoUrl,
    promotions,
    reviews,
    confirmations,
    useShippingAsBilling,
    unit,
    initials,
    dismissToast,
    onPhotoFilePicked,
    removePhoto,
    goNext,
    goBack,
    completeSetup,
} = useAuthProfileSetup();
</script>

<template>
    <section class="auth-profile" data-testid="auth-profile-page">
        <div class="auth-profile-shell" data-testid="auth-profile-shell">
            <AuthProfileSidebar :step="step" />

            <main class="auth-profile-main" data-testid="auth-profile-main">
                <AuthProfileDetailsStep
                    v-if="step === 1"
                    :first-name="firstName"
                    :last-name="lastName"
                    :email="email"
                    :initials="initials"
                    :photo-url="photoUrl"
                    @update:first-name="firstName = $event"
                    @update:last-name="lastName = $event"
                    @update:email="email = $event"
                    @photo-file-picked="onPhotoFilePicked"
                    @photo-remove="removePhoto"
                    @next="goNext"
                />

                <AuthProfileSettingsStep
                    v-else
                    :promotions="promotions"
                    :reviews="reviews"
                    :confirmations="confirmations"
                    :use-shipping-as-billing="useShippingAsBilling"
                    :unit="unit"
                    @update:promotions="promotions = $event"
                    @update:reviews="reviews = $event"
                    @update:confirmations="confirmations = $event"
                    @update:use-shipping-as-billing="useShippingAsBilling = $event"
                    @update:unit="unit = $event"
                    @back="goBack"
                    @complete="completeSetup"
                />
            </main>
        </div>

        <AuthProfileWelcomeToast :visible="showWelcomeToast" @close="dismissToast" />
    </section>
</template>

<style lang="scss">
.auth-profile {
    min-height: calc(100vh - 176px);
    background: var(--bg-page);
    position: relative;
    padding: 34px 24px 52px;

    .auth-profile-shell {
        max-width: 1240px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 344px 1fr;
        gap: 60px;

        .auth-profile-main {
            padding: 30px 0 0;
        }
    }
}

@media (max-width: 1180px) {
    .auth-profile {
        .auth-profile-shell {
            grid-template-columns: 1fr;
            gap: 30px;

            .auth-profile-main {
                padding-top: 0;
            }
        }
    }
}

@media (max-width: 860px) {
    .auth-profile {
        padding: 24px 14px 40px;
    }
}
</style>
