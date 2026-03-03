import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const onboardingPath = path.join(root, 'app', 'pages', 'guide', 'onboarding.vue');
const authFlowPath = path.join(root, 'app', 'pages', 'guide', 'auth-flow.vue');
const middlewarePath = path.join(root, 'app', 'middleware', 'guide-onboarding.global.ts');
const constantsPath = path.join(root, 'app', 'constants', 'guide-onboarding.ts');

const onboardingSource = fs.readFileSync(onboardingPath, 'utf8');
const authFlowSource = fs.readFileSync(authFlowPath, 'utf8');
const middlewareSource = fs.readFileSync(middlewarePath, 'utf8');
const constantsSource = fs.readFileSync(constantsPath, 'utf8');

const errors = [];

const forbiddenPhrases = [
    'Resend action includes timer and disabled state.',
    'Persist completion progress across route changes when possible.',
    'Branch Policy',
    'site-only -> merge/cherry-pick -> site-with-guide',
];

for (const phrase of forbiddenPhrases) {
    if (onboardingSource.includes(phrase) || authFlowSource.includes(phrase)) {
        errors.push(`Forbidden stale phrase found: "${phrase}"`);
    }
}

const requiredMarkers = [
    'Verified register -> OTP -> /auth/profile redirect.',
    'Verified resend resets OTP and keeps modal open.',
    'Verified country route handoff works (/${country}).',
];

for (const marker of requiredMarkers) {
    if (!onboardingSource.includes(marker)) {
        errors.push(`Required onboarding marker missing: "${marker}"`);
    }
}

const requiredSources = [
    'frontend/app/composables/auth/useRegisterForm.ts',
    'frontend/app/components/auth/shared/AuthVerificationModal.vue',
    'frontend/app/composables/auth/useAuthProfileSetup.ts',
    'frontend/app/composables/app/useCountry.ts',
    'frontend-documentation/app/middleware/guide-onboarding.global.ts',
];

for (const marker of requiredSources) {
    if (!onboardingSource.includes(marker)) {
        errors.push(`Required source reference missing: "${marker}"`);
    }
}

if (!onboardingSource.includes("from '@/constants/guide-onboarding'")) {
    errors.push('Onboarding page must import shared onboarding constants.');
}

if (!middlewareSource.includes("from '@/constants/guide-onboarding'")) {
    errors.push('Guide middleware must import shared onboarding constants.');
}

if (!middlewareSource.includes('GUIDE_ONBOARDING_VERSION')) {
    errors.push('Guide middleware must validate GUIDE_ONBOARDING_VERSION.');
}

if (!constantsSource.includes("GUIDE_ONBOARDING_VERSION = 'v3'")) {
    errors.push('Onboarding constants must define GUIDE_ONBOARDING_VERSION as v3.');
}

if (errors.length) {
    console.error('Onboarding doc drift check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log('Onboarding doc drift check passed.');
