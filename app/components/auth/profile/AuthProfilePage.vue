<script setup lang="ts">
import AuthProfileDetailsStep from '@/components/auth/profile/AuthProfileDetailsStep.vue';
import AuthProfileSettingsStep from '@/components/auth/profile/AuthProfileSettingsStep.vue';
import AuthProfileSidebar from '@/components/auth/profile/AuthProfileSidebar.vue';
import AuthProfileWelcomeToast from '@/components/auth/profile/AuthProfileWelcomeToast.vue';
import { useAuthProfileSetup } from '@/composables/auth/useAuthProfileSetup';

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
    background: var(--bg-page);
    position: relative;
    padding-top: 40px;
    padding-bottom: 60px;

    .auth-profile-shell {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        gap: 36px;

        .auth-profile-main {
            width: 100%;
            max-width: 690px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }
    }
}

@media (max-width: 1180px) {
    .auth-profile {
        .auth-profile-shell {
            flex-direction: column;
            gap: 30px;

            .auth-profile-main {
                max-width: none;
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
