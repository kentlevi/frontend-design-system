<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import HomeHeroSection from '~/components/home/HomeHeroSection.vue';
import HomeProductTypes from '~/components/home/HomeProductTypes.vue';
import HomeGuideTour from '~/components/home/HomeGuideTour.vue';
import HomeGuideTourDonePopover from '~/components/home/HomeGuideTourDonePopover.vue';
import HomeWelcomePopover from '~/components/home/HomeWelcomePopover.vue';
import AuthLoginForgotPasswordModal from '~/components/auth/login/AuthLoginForgotPasswordModal.vue';
import AuthResetPasswordModal from '~/components/auth/login/AuthResetPasswordModal.vue';
import { defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
    HOME_GUIDE_TOUR_TOTAL_STEPS,
    HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
    HOME_WELCOME_POPOVER_PENDING_KEY,
    HOME_WELCOME_POPOVER_TRIGGER_EVENT,
} from '~/data/home/onboarding';

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
const isLoginSuccessToastVisible = ref(false);
const isWelcomePopoverVisible = ref(false);
const isGuideTourVisible = ref(false);
const isGuideDonePopoverVisible = ref(false);
const guideTourStep = ref(1);
const guideTourTargetRect = ref<{
    top: number;
    left: number;
    width: number;
    height: number;
} | null>(null);
let currentGuideTargetEl: Element | null = null;
let resetToastTimer: ReturnType<typeof setTimeout> | null = null;
let loginToastTimer: ReturnType<typeof setTimeout> | null = null;
let welcomePopoverTimer: ReturnType<typeof setTimeout> | null = null;
let welcomePopoverAutoCloseTimer: ReturnType<typeof setTimeout> | null = null;
let guideDonePopoverAutoCloseTimer: ReturnType<typeof setTimeout> | null = null;
const WELCOME_POPOVER_SHOW_DELAY_MS = 500;
const HOME_POPOVER_AUTO_CLOSE_MS = 5000;

const guideTargetSelectorByStep: Record<number, string> = {
    1: '.home-header-account-wrap',
    2: '[data-testid="app-header-nav"]',
    3: '[data-testid="app-header-search-button"]',
};

function clearResetToastTimer() {
    if (!resetToastTimer) return;
    clearTimeout(resetToastTimer);
    resetToastTimer = null;
}

function clearLoginToastTimer() {
    if (!loginToastTimer) return;
    clearTimeout(loginToastTimer);
    loginToastTimer = null;
}

function clearWelcomePopoverTimer() {
    if (!welcomePopoverTimer) return;
    clearTimeout(welcomePopoverTimer);
    welcomePopoverTimer = null;
}

function clearWelcomePopoverAutoCloseTimer() {
    if (!welcomePopoverAutoCloseTimer) return;
    clearTimeout(welcomePopoverAutoCloseTimer);
    welcomePopoverAutoCloseTimer = null;
}

function clearGuideDonePopoverAutoCloseTimer() {
    if (!guideDonePopoverAutoCloseTimer) return;
    clearTimeout(guideDonePopoverAutoCloseTimer);
    guideDonePopoverAutoCloseTimer = null;
}

function clearModalQuery() {
    const query = { ...route.query };
    delete query.modal;
    delete query.email;
    delete query.token;
    router.replace({ path: route.path, query });
}

function setGuideTourBodyState(active: boolean) {
    if (!import.meta.client) return;
    document.body.classList.toggle('home-guide-tour-active', active);
}

function showResetSuccessToast() {
    isResetSuccessToastVisible.value = true;

    clearResetToastTimer();

    resetToastTimer = setTimeout(() => {
        isResetSuccessToastVisible.value = false;
    }, 5000);
}

function showLoginSuccessToast() {
    isLoginSuccessToastVisible.value = true;

    clearLoginToastTimer();

    loginToastTimer = setTimeout(() => {
        isLoginSuccessToastVisible.value = false;
    }, 5000);
}

function dismissWelcomePopover() {
    clearWelcomePopoverTimer();
    clearWelcomePopoverAutoCloseTimer();
    isWelcomePopoverVisible.value = false;
}

function showWelcomePopoverNow() {
    isWelcomePopoverVisible.value = true;
    clearWelcomePopoverAutoCloseTimer();
    welcomePopoverAutoCloseTimer = setTimeout(() => {
        isWelcomePopoverVisible.value = false;
        welcomePopoverAutoCloseTimer = null;
    }, HOME_POPOVER_AUTO_CLOSE_MS);
    if (import.meta.client) {
        window.localStorage.removeItem(HOME_WELCOME_POPOVER_PENDING_KEY);
    }
}

function scheduleWelcomePopover(delayMs = 0) {
    clearWelcomePopoverTimer();
    if (delayMs <= 0) {
        showWelcomePopoverNow();
        return;
    }

    welcomePopoverTimer = setTimeout(() => {
        welcomePopoverTimer = null;
        showWelcomePopoverNow();
    }, delayMs);
}

function syncGuideTourTargetRect() {
    if (!import.meta.client || !isGuideTourVisible.value) return;

    const selector = guideTargetSelectorByStep[guideTourStep.value];
    if (!selector) {
        currentGuideTargetEl?.classList.remove('home-guide-tour-target-active');
        currentGuideTargetEl = null;
        guideTourTargetRect.value = null;
        return;
    }

    const target = document.querySelector(selector);
    if (!target) {
        currentGuideTargetEl?.classList.remove('home-guide-tour-target-active');
        currentGuideTargetEl = null;
        guideTourTargetRect.value = null;
        return;
    }

    if (currentGuideTargetEl !== target) {
        currentGuideTargetEl?.classList.remove('home-guide-tour-target-active');
        target.classList.add('home-guide-tour-target-active');
        currentGuideTargetEl = target;
    }

    const rect = target.getBoundingClientRect();
    guideTourTargetRect.value = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
    };
}

async function openGuideTour(step = 1) {
    dismissWelcomePopover();
    clearGuideDonePopoverAutoCloseTimer();
    isGuideDonePopoverVisible.value = false;
    guideTourStep.value = Math.min(Math.max(step, 1), HOME_GUIDE_TOUR_TOTAL_STEPS);
    isGuideTourVisible.value = true;
    setGuideTourBodyState(true);
    await nextTick();
    syncGuideTourTargetRect();
}

function closeGuideTour() {
    isGuideTourVisible.value = false;
    setGuideTourBodyState(false);
    guideTourTargetRect.value = null;
    currentGuideTargetEl?.classList.remove('home-guide-tour-target-active');
    currentGuideTargetEl = null;
}

async function goToNextGuideTourStep() {
    if (guideTourStep.value >= HOME_GUIDE_TOUR_TOTAL_STEPS) {
        closeGuideTour();
        clearGuideDonePopoverAutoCloseTimer();
        isGuideDonePopoverVisible.value = true;
        guideDonePopoverAutoCloseTimer = setTimeout(() => {
            isGuideDonePopoverVisible.value = false;
            guideDonePopoverAutoCloseTimer = null;
        }, HOME_POPOVER_AUTO_CLOSE_MS);
        return;
    }

    guideTourStep.value += 1;
    await nextTick();
    syncGuideTourTargetRect();
}

function openWelcomePopoverFromTrigger() {
    scheduleWelcomePopover(0);
}

onMounted(() => {
    if (import.meta.client) {
        const shouldShowWelcomePopover =
            window.localStorage.getItem(HOME_WELCOME_POPOVER_PENDING_KEY) === '1';
        if (shouldShowWelcomePopover) {
            scheduleWelcomePopover(WELCOME_POPOVER_SHOW_DELAY_MS);
        }
        const shouldShowLoginSuccessToast =
            window.localStorage.getItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY) === '1';
        if (shouldShowLoginSuccessToast) {
            showLoginSuccessToast();
            window.localStorage.removeItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY);
        }
        window.addEventListener(HOME_WELCOME_POPOVER_TRIGGER_EVENT, openWelcomePopoverFromTrigger);
        window.addEventListener('resize', syncGuideTourTargetRect);
        window.addEventListener('scroll', syncGuideTourTargetRect, true);
    }

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
    clearLoginToastTimer();
    clearWelcomePopoverTimer();
    clearWelcomePopoverAutoCloseTimer();
    clearGuideDonePopoverAutoCloseTimer();
    setGuideTourBodyState(false);
    currentGuideTargetEl?.classList.remove('home-guide-tour-target-active');
    currentGuideTargetEl = null;
    if (import.meta.client) {
        window.removeEventListener(HOME_WELCOME_POPOVER_TRIGGER_EVENT, openWelcomePopoverFromTrigger);
        window.removeEventListener('resize', syncGuideTourTargetRect);
        window.removeEventListener('scroll', syncGuideTourTargetRect, true);
    }
});

watch(
    () => route.fullPath,
    async () => {
        if (!isGuideTourVisible.value) return;
        await nextTick();
        syncGuideTourTargetRect();
    }
);

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
        <UiToast
            :visible="isLoginSuccessToastVisible"
            tone="primary"
            :message="t('home.toast.loginSuccess')"
            variant="outlined"
            data-testid="home-login-success-toast"
            @close="isLoginSuccessToastVisible = false"
        />
        <HomeWelcomePopover
            :visible="isWelcomePopoverVisible"
            @close="dismissWelcomePopover"
            @start="openGuideTour()"
        />
        <HomeGuideTour
            :visible="isGuideTourVisible"
            :step="guideTourStep"
            :target-rect="guideTourTargetRect"
            @close="closeGuideTour"
            @next="goToNextGuideTourStep"
        />
        <HomeGuideTourDonePopover
            :visible="isGuideDonePopoverVisible"
            @close="clearGuideDonePopoverAutoCloseTimer(); isGuideDonePopoverVisible = false"
        />
    </main>
</template>

<style scoped lang="scss">
.home-page {
    background: var(--bg-page);
}

:global(.home-guide-tour-target-active) {
    position: relative;
    z-index: 145 !important;
    border: 0 !important;
    box-shadow:
        inset 0 0 0 2px var(--brand-primary),
        0 0 0 4px color-mix(in srgb, #ffffff 40%, transparent) !important;
}

:global(.home-header-account-wrap.home-guide-tour-target-active) {
    z-index: 1000000 !important;
    background: #ffff;
    border-radius: 12px;
}

:global(.home-header-nav.home-guide-tour-target-active) {
    z-index: 1000000 !important;
    background: #ffff;
    border-radius: 20px;
    padding: 6px 10px;
}

:global(.ui-button.home-header-icon.home-guide-tour-target-active) {
    position: relative !important;
    z-index: 1000000 !important;
    background: #ffff !important;
    border-radius: 12px !important;
    box-shadow: 0 0 0 4px color-mix(in srgb, #ffffff 40%, transparent) !important;
}

:global(body.home-guide-tour-active .home-header-tools) {
    pointer-events: none;
}
</style>
