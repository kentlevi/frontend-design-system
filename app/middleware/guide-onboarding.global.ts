import {
    GUIDE_ONBOARDING_ACK_COOKIE,
    GUIDE_ONBOARDING_DONE_COOKIE,
    GUIDE_ONBOARDING_VERSION,
} from '@/constants/guide-onboarding';

const GUIDE_STANDARDS_VERSION = 'v2';
const GUIDE_STANDARDS_COOKIE = `guide_standards_read_${GUIDE_STANDARDS_VERSION}`;

const normalizePath = (value: string) => {
    if (value.length > 1 && value.endsWith('/')) {
        return value.slice(0, -1);
    }
    return value;
};

export default defineNuxtRouteMiddleware((to) => {
    if (!import.meta.dev) return;

    const path = normalizePath(to.path);
    const match = path.match(/^(?<prefix>.*?)(\/guide)(?:\/.*)?$/i);

    if (!match) return;

    const prefix = match.groups?.prefix ?? '';
    const onboardingPath = normalizePath(`${prefix}/guide/onboarding`);
    const standardsPath = normalizePath(`${prefix}/guide/standards`);
    const isOnboardingRoute = path.toLowerCase() === onboardingPath.toLowerCase();
    const isStandardsRoute = path.toLowerCase() === standardsPath.toLowerCase();

    const onboardingDoneCookie = useCookie<string | null>(GUIDE_ONBOARDING_DONE_COOKIE, {
        path: '/',
        sameSite: 'lax',
    });
    const onboardingAckCookie = useCookie<string | null>(GUIDE_ONBOARDING_ACK_COOKIE, {
        path: '/',
        sameSite: 'lax',
    });
    const standardsCookie = useCookie<string | null>(GUIDE_STANDARDS_COOKIE, {
        path: '/',
        sameSite: 'lax',
    });

    const doneValue = String(onboardingDoneCookie.value ?? '').trim().toLowerCase();
    const ackValueRaw = String(onboardingAckCookie.value ?? '').trim();
    const ackValue = decodeURIComponent(ackValueRaw);
    const hasOnboardingAck =
        (doneValue === '1' || doneValue === 'true') &&
        ackValue === GUIDE_ONBOARDING_VERSION;

    if (!hasOnboardingAck && !isOnboardingRoute) {
        return navigateTo({
            path: onboardingPath,
            query: { redirect: to.fullPath },
        });
    }

    if (hasOnboardingAck && !standardsCookie.value && !isOnboardingRoute && !isStandardsRoute) {
        return navigateTo({
            path: standardsPath,
            query: { redirect: to.fullPath },
        });
    }
});
