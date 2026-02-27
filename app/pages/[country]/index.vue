<script setup lang="ts">
import HomeHeroSection from '~/components/home/HomeHeroSection.vue';
import HomeProductTypes from '~/components/home/HomeProductTypes.vue';
import AuthLoginForgotPasswordModal from '~/components/auth/login/AuthLoginForgotPasswordModal.vue';
import AuthResetPasswordModal from '~/components/auth/login/AuthResetPasswordModal.vue';
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const HomeFeatureHighlight = defineAsyncComponent(
    () => import('~/components/home/HomeFeatureHighlight.vue')
);
const HomeReviewsSection = defineAsyncComponent(
    () => import('~/components/home/HomeReviewsSection.vue')
);
const HomeGuarantees = defineAsyncComponent(
    () => import('~/components/home/HomeGuarantees.vue')
);
const HomeCtaSection = defineAsyncComponent(
    () => import('~/components/home/HomeCtaSection.vue')
);

definePageMeta({
    layout: 'home',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const isForgotPasswordModalOpen = ref(false);
const forgotEmail = ref('');
const isResetPasswordModalOpen = ref(false);
const resetEmail = ref('');
const resetToken = ref('');
const isResetSuccessToastVisible = ref(false);
let resetToastTimer: ReturnType<typeof setTimeout> | null = null;

function clearResetToastTimer() {
    if (!resetToastTimer) return;
    clearTimeout(resetToastTimer);
    resetToastTimer = null;
}

function clearModalQuery() {
    const query = { ...route.query };
    delete query.modal;
    delete query.email;
    delete query.token;
    router.replace({ path: route.path, query });
}

function showResetSuccessToast() {
    isResetSuccessToastVisible.value = true;

    clearResetToastTimer();

    resetToastTimer = setTimeout(() => {
        isResetSuccessToastVisible.value = false;
    }, 5000);
}

onMounted(() => {
    const modalQuery = Array.isArray(route.query.modal)
        ? route.query.modal[0]
        : route.query.modal;

    const emailQuery = Array.isArray(route.query.email)
        ? route.query.email[0]
        : route.query.email;
    const tokenQuery = Array.isArray(route.query.token)
        ? route.query.token[0]
        : route.query.token;

    if (modalQuery === 'reset-password') {
        resetEmail.value = typeof emailQuery === 'string' ? emailQuery : '';
        resetToken.value = typeof tokenQuery === 'string' ? tokenQuery : '';

        if (resetEmail.value && resetToken.value) {
            isResetPasswordModalOpen.value = true;
            return;
        }
    }

    if (modalQuery !== 'forgot-password') return;

    forgotEmail.value = typeof emailQuery === 'string' ? emailQuery : '';
    isForgotPasswordModalOpen.value = true;
});

watch(isResetPasswordModalOpen, (open, previous) => {
    if (previous && !open) {
        clearModalQuery();
    }
});

watch(isForgotPasswordModalOpen, (open, previous) => {
    if (previous && !open) {
        clearModalQuery();
    }
});

onBeforeUnmount(() => {
    clearResetToastTimer();
});

useSeoMeta({
    title: () => t('home.seo.title'),
    description: () => t('home.seo.description'),
});

useHead({
    link: [
        {
            rel: 'preload',
            as: 'image',
            href: '/illustrations/products/sticker-kids/kid-decorating-sheet.svg',
            fetchpriority: 'high',
        },
    ],
});
</script>

<template>
    <main class="home-page">
        <HomeHeroSection />
        <HomeProductTypes />
        <HomeFeatureHighlight />
        <HomeReviewsSection />
        <HomeGuarantees />
        <HomeCtaSection />
        <AuthLoginForgotPasswordModal
            v-model="isForgotPasswordModalOpen"
            :email="forgotEmail"
            data-testid="home-forgot-password-modal"
        />
        <AuthResetPasswordModal
            v-model="isResetPasswordModalOpen"
            :email="resetEmail"
            :token="resetToken"
            data-testid="home-reset-password-modal"
            @updated="showResetSuccessToast"
        />
        <UiToast
            :visible="isResetSuccessToastVisible"
            tone="success"
            :message="t('home.toast.passwordUpdated')"
            data-testid="home-reset-password-success-toast"
            @close="isResetSuccessToastVisible = false"
        />
    </main>
</template>

<style scoped lang="scss">
.home-page {
    background: var(--bg-page);
}
</style>
