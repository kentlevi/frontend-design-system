<script setup lang="ts">
import { copyTextToClipboard } from '@/utils/clipboard';
import {
    GUIDE_ONBOARDING_ACK_COOKIE,
    GUIDE_ONBOARDING_DONE_COOKIE,
    GUIDE_ONBOARDING_VERSION,
} from '@/constants/guide-onboarding';

type RoleTrack = 'fe' | 'qa' | 'design';
type SourceLink = { label: string; path: string };
type OnboardingClaim = { text: string; sources: SourceLink[] };
type OnboardingSlide = {
    id: string;
    title: string;
    summary: string;
    claims: OnboardingClaim[];
    commands?: string[];
    code?: string;
};
type QuizQuestion = { id: string; prompt: string; options: string[]; correctIndex: number };
type RoleTrackConfig = {
    slides: OnboardingSlide[];
    checklist: { id: string; label: string }[];
    quiz: QuizQuestion[];
};

const ONBOARDING_LAST_UPDATED = '2026-03-02';
const ROADMAP_ITEMS = [
    'Optional resend cooldown UX (not implemented).',
    'Partial onboarding resume checkpoints (not implemented).',
    'Cross-role analytics panel for onboarding completion.',
];
const roleLabels: Record<RoleTrack, string> = {
    fe: 'Frontend',
    qa: 'QA',
    design: 'Design',
};
const roleOptions = [
    { label: 'Frontend', value: 'fe' },
    { label: 'QA', value: 'qa' },
    { label: 'Design', value: 'design' },
];

const roleTrackConfig: Record<RoleTrack, RoleTrackConfig> = {
    fe: {
        slides: [
            {
                id: 'fe-auth',
                title: 'Auth Flow Implementation',
                summary: 'Validate register, OTP, resend, and profile handoff behavior from source.',
                claims: [
                    {
                        text: 'Register submit requests verification and opens OTP modal on success.',
                        sources: [
                            { label: 'Register flow', path: 'frontend/app/composables/auth/useRegisterForm.ts' },
                            { label: 'Register UI', path: 'frontend/app/components/auth/register/AuthRegisterCard.vue' },
                        ],
                    },
                    {
                        text: 'Successful OTP verification redirects to `/auth/profile` in the auth flow.',
                        sources: [{ label: 'Verification submit', path: 'frontend/app/composables/auth/useRegisterForm.ts' }],
                    },
                    {
                        text: 'Resend refreshes token and clears OTP while modal remains open.',
                        sources: [
                            { label: 'Verification modal', path: 'frontend/app/components/auth/shared/AuthVerificationModal.vue' },
                            { label: 'Resend logic', path: 'frontend/app/composables/auth/useRegisterForm.ts' },
                        ],
                    },
                ],
            },
            {
                id: 'fe-country',
                title: 'Country Route Handoff',
                summary: 'Confirm route prefixing and completion handoff behavior.',
                claims: [
                    {
                        text: '`withCountry()` prefixes paths using resolved country route params.',
                        sources: [{ label: 'Country composable', path: 'frontend/app/composables/app/useCountry.ts' }],
                    },
                    {
                        text: 'Profile setup completion navigates using `withCountry(\'/\')`.',
                        sources: [{ label: 'Profile setup', path: 'frontend/app/composables/auth/useAuthProfileSetup.ts' }],
                    },
                ],
            },
        ],
        checklist: [
            { id: 'fe-register-otp-profile', label: 'Verified register -> OTP -> /auth/profile redirect.' },
            { id: 'fe-resend-modal', label: 'Verified resend resets OTP and keeps modal open.' },
            { id: 'fe-country-route', label: 'Verified country route handoff works (/${country}).' },
        ],
        quiz: [
            {
                id: 'fe-q1',
                prompt: 'After successful OTP in register flow, where does the user go?',
                options: ['`/auth/profile` via auth flow handoff.', '`/guide/standards`.', '`/auth/login` only.'],
                correctIndex: 0,
            },
            {
                id: 'fe-q2',
                prompt: 'What is expected resend behavior?',
                options: ['Token refresh + OTP reset while modal stays open.', 'Mandatory timer and modal close.', 'No resend support.'],
                correctIndex: 0,
            },
        ],
    },
    qa: {
        slides: [
            {
                id: 'qa-assertions',
                title: 'QA Assertions',
                summary: 'Validate selectors, modal behavior, and guide redirects in dev.',
                claims: [
                    {
                        text: 'Register and verification controls expose stable selector hooks.',
                        sources: [
                            { label: 'Register selectors', path: 'frontend/app/components/auth/register/AuthRegisterCard.vue' },
                            { label: 'Verification selectors', path: 'frontend/app/components/auth/shared/AuthVerificationModal.vue' },
                        ],
                    },
                    {
                        text: 'Guide middleware enforces onboarding and standards redirect order in dev.',
                        sources: [{ label: 'Guide middleware', path: 'frontend-documentation/app/middleware/guide-onboarding.global.ts' }],
                    },
                ],
            },
        ],
        checklist: [
            { id: 'qa-selectors', label: 'Verified stable selectors for register/verification actions.' },
            { id: 'qa-resend', label: 'Verified OTP error and resend behavior.' },
            { id: 'qa-gates', label: 'Verified onboarding/standards redirect conditions in dev.' },
        ],
        quiz: [
            {
                id: 'qa-q1',
                prompt: 'When onboarding ack is stale in dev, where should `/guide` route go?',
                options: ['`/guide/onboarding`.', '`/guide/standards`.', 'No redirect.'],
                correctIndex: 0,
            },
        ],
    },
    design: {
        slides: [
            {
                id: 'design-traceability',
                title: 'Design Documentation Traceability',
                summary: 'Ensure onboarding claims and auth UI states map to implementation files.',
                claims: [
                    {
                        text: 'Auth states and copy are validated from implemented register/verification/profile components.',
                        sources: [
                            { label: 'Register view', path: 'frontend/app/components/auth/register/AuthRegisterCard.vue' },
                            { label: 'Verification view', path: 'frontend/app/components/auth/register/AuthRegisterVerificationModal.vue' },
                            { label: 'Profile view', path: 'frontend/app/components/auth/profile/AuthProfilePage.vue' },
                        ],
                    },
                    {
                        text: 'Doc drift checks block stale onboarding statements.',
                        sources: [{ label: 'Doc drift script', path: 'frontend-documentation/scripts/check-onboarding-doc-drift.mjs' }],
                    },
                ],
            },
        ],
        checklist: [
            { id: 'design-states', label: 'Verified auth states match real implementation.' },
            { id: 'design-modal', label: 'Verified modal/error copy matches implemented behavior.' },
            { id: 'design-source', label: 'Verified onboarding claims map to source files.' },
        ],
        quiz: [
            {
                id: 'design-q1',
                prompt: 'What is required for each onboarding claim?',
                options: ['Direct source file references.', 'Screenshot only.', 'No references needed.'],
                correctIndex: 0,
            },
        ],
    },
};

definePageMeta({ layout: false });
const localePath = useLocalePath();
const selectedRole = ref<RoleTrack>('fe');
const currentSlide = ref(0);
const copiedPath = ref('');
const isSubmitting = ref(false);
const quizSubmitted = ref(false);
const detailStartRef = ref<HTMLElement | null>(null);
const checklistState = reactive<Record<string, boolean>>({});
const quizAnswers = reactive<Record<string, number | null>>({});

const activeConfig = computed(() => roleTrackConfig[selectedRole.value]);
const activeSlides = computed(() => activeConfig.value.slides);
const activeChecklist = computed(() => activeConfig.value.checklist);
const activeQuiz = computed(() => activeConfig.value.quiz);
const activeSlide = computed(() => activeSlides.value[currentSlide.value]);
const isLastSlide = computed(() => currentSlide.value === activeSlides.value.length - 1);
const quickStartItems = computed(() => [
    `Select your role track (${roleLabels[selectedRole.value]}).`,
    `Review ${activeSlides.value.length} implementation reference slide${activeSlides.value.length > 1 ? 's' : ''}.`,
    `Complete ${activeChecklist.value.length} checklist item${activeChecklist.value.length > 1 ? 's' : ''}.`,
    `Pass ${activeQuiz.value.length} quiz question${activeQuiz.value.length > 1 ? 's' : ''}, then proceed to guide standards.`,
]);
const slideProgress = computed(() =>
    activeSlides.value.length
        ? Math.round(((currentSlide.value + 1) / activeSlides.value.length) * 100)
        : 0
);
const allChecklistChecked = computed(() => activeChecklist.value.every((item) => checklistState[item.id]));
const allQuizAnswered = computed(() => activeQuiz.value.every((q) => quizAnswers[q.id] !== null));
const quizAllCorrect = computed(() => activeQuiz.value.every((q) => quizAnswers[q.id] === q.correctIndex));
const canProceed = computed(() => allChecklistChecked.value && quizAllCorrect.value);

const onboardingDoneCookie = useCookie<string | null>(GUIDE_ONBOARDING_DONE_COOKIE, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
const onboardingAckCookie = useCookie<string | null>(GUIDE_ONBOARDING_ACK_COOKIE, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });

const redirectTarget = computed(() => localePath('/guide/standards'));

function resetTrackState() {
    for (const key of Object.keys(checklistState)) {
        delete checklistState[key];
    }
    for (const item of activeChecklist.value) {
        checklistState[item.id] = false;
    }
    for (const key of Object.keys(quizAnswers)) {
        delete quizAnswers[key];
    }
    for (const item of activeQuiz.value) {
        quizAnswers[item.id] = null;
    }
    quizSubmitted.value = false;
}

async function copyPath(path: string) {
    try {
        await copyTextToClipboard(path);
        copiedPath.value = path;
        setTimeout(() => {
            if (copiedPath.value === path) copiedPath.value = '';
        }, 1200);
    } catch {}
}

function submitQuiz() {
    if (!allQuizAnswered.value) return;
    quizSubmitted.value = true;
}

async function startTrack() {
    await nextTick();
    detailStartRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetOnboarding() {
    onboardingDoneCookie.value = null;
    onboardingAckCookie.value = null;
    selectedRole.value = 'fe';
    currentSlide.value = 0;
    isSubmitting.value = false;
    copiedPath.value = '';
    resetTrackState();
}

async function proceedToGuide() {
    if (!canProceed.value || isSubmitting.value) return;
    isSubmitting.value = true;
    onboardingDoneCookie.value = '1';
    onboardingAckCookie.value = GUIDE_ONBOARDING_VERSION;

    if (import.meta.client) {
        // Ensure cookies are written synchronously for middleware on hard navigation.
        document.cookie = `${GUIDE_ONBOARDING_DONE_COOKIE}=1; Path=/; SameSite=Lax`;
        document.cookie = `${GUIDE_ONBOARDING_ACK_COOKIE}=${encodeURIComponent(
            GUIDE_ONBOARDING_VERSION
        )}; Path=/; SameSite=Lax`;
        await nextTick();

        // Force a real navigation so middleware reads fresh cookies on next request.
        window.location.assign(redirectTarget.value);
        return;
    }

    navigateTo(redirectTarget.value).catch(() => {
        isSubmitting.value = false;
    });
}

watch(selectedRole, () => {
    currentSlide.value = 0;
    copiedPath.value = '';
    resetTrackState();
});
resetTrackState();
</script>

<template>
    <section class="guide-onboarding" data-testid="guide-onboarding-page">
        <div class="guide-onboarding-card">
            <header class="guide-onboarding-head">
                <div>
                    <p class="guide-onboarding-kicker">Guide Onboarding</p>
                    <p class="guide-onboarding-meta">
                        {{ GUIDE_ONBOARDING_VERSION }} | Updated {{ ONBOARDING_LAST_UPDATED }}
                    </p>
                </div>

                <div class="guide-onboarding-role-wrap">
                    <p class="guide-onboarding-label">Role Track</p>
                    <UiSelect
                        v-model="selectedRole"
                        class="guide-onboarding-role-select"
                        :options="roleOptions"
                        placeholder="Select role track"
                        data-testid="guide-onboarding-role-select"
                    />
                </div>
            </header>

            <section class="guide-onboarding-welcome">
                <p class="guide-onboarding-welcome-kicker">Welcome</p>
                <h2 class="guide-onboarding-welcome-title">
                    Start With A Guided {{ roleLabels[selectedRole] }} Track
                </h2>
                <p class="guide-onboarding-summary">
                    This onboarding helps you verify real implementation behavior before you dive
                    into the full guide. You will complete role-specific checks and a short quiz.
                </p>

                <div class="guide-onboarding-welcome-steps">
                    <article class="guide-onboarding-welcome-step">
                        <p class="guide-onboarding-welcome-step-index">01</p>
                        <p class="guide-onboarding-welcome-step-copy">Review implementation-backed claims.</p>
                    </article>
                    <article class="guide-onboarding-welcome-step">
                        <p class="guide-onboarding-welcome-step-index">02</p>
                        <p class="guide-onboarding-welcome-step-copy">Validate checklist items for your role.</p>
                    </article>
                    <article class="guide-onboarding-welcome-step">
                        <p class="guide-onboarding-welcome-step-index">03</p>
                        <p class="guide-onboarding-welcome-step-copy">Pass the quiz gate, then continue to standards.</p>
                    </article>
                </div>

            </section>

            <section class="guide-onboarding-quickstart">
                <h2 class="guide-onboarding-section-title">Quick Start</h2>
                <p class="guide-onboarding-summary">
                    Complete these actions in order.
                </p>
                <ol class="guide-onboarding-quickstart-list">
                    <li v-for="(item, index) in quickStartItems" :key="item" class="guide-onboarding-quickstart-item">
                        <span class="guide-onboarding-quickstart-index">{{ index + 1 }}</span>
                        <span>{{ item }}</span>
                    </li>
                </ol>
                <button
                    type="button"
                    class="guide-onboarding-btn"
                    data-testid="guide-onboarding-start-track"
                    @click="startTrack"
                >
                    Open {{ roleLabels[selectedRole] }} Implementation Reference
                </button>
            </section>

            <section class="guide-onboarding-ref-head">
                <p class="guide-onboarding-ref-kicker">Implementation Reference</p>
                <h2 class="guide-onboarding-section-title">Source-Backed Claims and Validation</h2>
            </section>

            <section ref="detailStartRef" class="guide-onboarding-hero">
                <div class="guide-onboarding-progress-row">
                    <p class="guide-onboarding-step">Slide {{ currentSlide + 1 }} / {{ activeSlides.length }}</p>
                    <p class="guide-onboarding-step">{{ slideProgress }}% complete</p>
                </div>
                <div class="guide-onboarding-progress-track" aria-hidden="true">
                    <span class="guide-onboarding-progress-fill" :style="{ width: `${slideProgress}%` }" />
                </div>
                <h1 class="guide-onboarding-title">{{ activeSlide.title }}</h1>
                <p class="guide-onboarding-summary">{{ activeSlide.summary }}</p>
            </section>

            <ul class="guide-onboarding-claims">
                <li
                    v-for="(claim, claimIndex) in activeSlide.claims"
                    :key="`${activeSlide.id}-${claimIndex}`"
                    class="guide-onboarding-claim"
                >
                    <p class="guide-onboarding-claim-text">{{ claim.text }}</p>
                    <button
                        v-for="source in claim.sources"
                        :key="source.path"
                        type="button"
                        class="guide-onboarding-source-btn"
                        :data-testid="`guide-onboarding-source-${claimIndex}`"
                        @click="copyPath(source.path)"
                    >
                        <span class="guide-onboarding-source-label">{{ source.label }}</span>
                        <code class="guide-onboarding-source-path">{{ source.path }}</code>
                        <span v-if="copiedPath === source.path" class="guide-onboarding-source-copied">Copied</span>
                    </button>
                </li>
            </ul>

            <pre v-if="activeSlide.commands?.length" class="guide-onboarding-code"><code>{{ activeSlide.commands.join('\n') }}</code></pre>
            <pre v-else-if="activeSlide.code" class="guide-onboarding-code"><code>{{ activeSlide.code }}</code></pre>

            <div class="guide-onboarding-nav">
                <button
                    type="button"
                    class="guide-onboarding-btn guide-onboarding-btn-secondary"
                    :disabled="currentSlide === 0"
                    data-testid="guide-onboarding-prev"
                    @click="currentSlide -= 1"
                >
                    Previous
                </button>
                <button
                    type="button"
                    class="guide-onboarding-btn"
                    :disabled="isLastSlide"
                    data-testid="guide-onboarding-next"
                    @click="currentSlide += 1"
                >
                    Next
                </button>
            </div>

            <div class="guide-onboarding-gate">
                <h2 class="guide-onboarding-section-title">Definition of Done Checklist</h2>
                <label v-for="item in activeChecklist" :key="item.id" class="guide-onboarding-check">
                    <input
                        v-model="checklistState[item.id]"
                        type="checkbox"
                        :data-testid="`guide-onboarding-check-${item.id}`"
                    >
                    <span>{{ item.label }}</span>
                </label>

                <h2 class="guide-onboarding-section-title">Quiz Gate</h2>
                <div
                    v-for="question in activeQuiz"
                    :key="question.id"
                    class="guide-onboarding-quiz-item"
                    :data-testid="`guide-onboarding-quiz-${question.id}`"
                >
                    <p class="guide-onboarding-quiz-prompt">{{ question.prompt }}</p>
                    <label
                        v-for="(option, optionIndex) in question.options"
                        :key="`${question.id}-${optionIndex}`"
                        class="guide-onboarding-quiz-option"
                    >
                        <input
                            v-model="quizAnswers[question.id]"
                            type="radio"
                            :name="question.id"
                            :value="optionIndex"
                            :data-testid="`guide-onboarding-quiz-${question.id}-option-${optionIndex}`"
                        >
                        <span>{{ option }}</span>
                    </label>
                </div>
                <div class="guide-onboarding-quiz-actions">
                    <button
                        type="button"
                        class="guide-onboarding-btn guide-onboarding-btn-secondary"
                        :disabled="!allQuizAnswered"
                        data-testid="guide-onboarding-quiz-submit"
                        @click="submitQuiz"
                    >
                        Submit Quiz
                    </button>
                    <button
                        type="button"
                        class="guide-onboarding-btn guide-onboarding-btn-secondary"
                        data-testid="guide-onboarding-quiz-retry"
                        @click="resetTrackState"
                    >
                        Retry Quiz
                    </button>
                    <p v-if="quizSubmitted" class="guide-onboarding-quiz-result">
                        {{ quizAllCorrect ? 'Quiz passed.' : 'Quiz not passed.' }}
                    </p>
                </div>
            </div>

            <section class="guide-onboarding-roadmap">
                <h2 class="guide-onboarding-section-title">Roadmap (Not Yet Shipped)</h2>
                <p class="guide-onboarding-summary">Informational only. These do not block onboarding completion.</p>
                <ul class="guide-onboarding-roadmap-list">
                    <li v-for="item in ROADMAP_ITEMS" :key="item">{{ item }}</li>
                </ul>
            </section>

            <div class="guide-onboarding-actions">
                <button
                    type="button"
                    class="guide-onboarding-btn"
                    :disabled="!canProceed || isSubmitting"
                    data-testid="guide-onboarding-proceed"
                    @click="proceedToGuide"
                >
                    Proceed to Guide
                </button>
                <button
                    type="button"
                    class="guide-onboarding-btn guide-onboarding-btn-secondary"
                    data-testid="guide-onboarding-reset"
                    @click="resetOnboarding"
                >
                    Reset Onboarding
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.guide-onboarding {
    --onboarding-glass: color-mix(in srgb, var(--bg-surface) 90%, transparent);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 36px 18px;
    background: var(--bg-primary);
}

.guide-onboarding-card {
    width: min(920px, 100%);
    border: 1px solid color-mix(in srgb, var(--border-default) 78%, var(--brand-primary));
    border-radius: 22px;
    padding: 28px;
    background: var(--onboarding-glass);
    backdrop-filter: blur(5px);
    box-shadow: 0 14px 42px color-mix(in srgb, var(--gray-100) 12%, transparent);
    display: grid;
    gap: 18px;
    animation: onboarding-fade-in 220ms ease-out;
}

.guide-onboarding-head {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    align-items: end;
}

.guide-onboarding-kicker {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
    font-weight: var(--font-weight-semibold);
}

.guide-onboarding-meta {
    margin: 4px 0 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-muted);
}

.guide-onboarding-role-wrap {
    min-width: 220px;
}

.guide-onboarding-label {
    margin: 0 0 6px;
    display: inline-block;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.guide-onboarding-role-select {
    :deep(.ui-select-trigger) {
        width: 100%;
        min-height: 42px;
        border: 1px solid var(--border-default);
        border-radius: 10px;
        padding: 8px 12px;
        background: var(--bg-surface);
        color: var(--text-primary);
        font-size: var(--type-size-200);
        line-height: var(--type-line-200);
    }

    :deep(.ui-select-menu) {
        margin-top: 6px;
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--bg-surface);
    }
}

.guide-onboarding-hero {
    border: 1px solid var(--border-default);
    border-radius: 14px;
    padding: 16px;
    background: color-mix(in srgb, var(--bg-surface) 70%, transparent);
    display: grid;
    gap: 10px;
}

.guide-onboarding-welcome {
    border: 1px solid var(--border-default);
    border-radius: 14px;
    padding: 16px;
    background: color-mix(in srgb, var(--bg-surface) 78%, transparent);
    display: grid;
    gap: 12px;
}

.guide-onboarding-quickstart,
.guide-onboarding-ref-head {
    border: 1px solid var(--border-default);
    border-radius: 14px;
    padding: 14px;
    background: var(--bg-surface);
    display: grid;
    gap: 10px;
}

.guide-onboarding-quickstart-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 8px;
}

.guide-onboarding-quickstart-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: var(--text-primary);
    line-height: 1.45;
}

.guide-onboarding-quickstart-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 1px solid var(--border-default);
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    font-weight: var(--font-weight-bold);
    color: var(--text-secondary);
    flex-shrink: 0;
}

.guide-onboarding-ref-kicker {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: var(--font-weight-bold);
}

.guide-onboarding-welcome-kicker {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: var(--font-weight-bold);
}

.guide-onboarding-welcome-title {
    margin: 0;
    font-size: var(--type-size-400);
    line-height: var(--type-line-400);
    letter-spacing: -0.02em;
    color: var(--text-primary);
}

.guide-onboarding-welcome-steps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
}

.guide-onboarding-welcome-step {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 10px;
    background: var(--bg-surface);
    display: grid;
    gap: 4px;
}

.guide-onboarding-welcome-step-index {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    font-weight: var(--font-weight-bold);
    color: var(--text-secondary);
}

.guide-onboarding-welcome-step-copy {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-primary);
}

.guide-onboarding-progress-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
}

.guide-onboarding-step {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: var(--font-weight-semibold);
}

.guide-onboarding-progress-track {
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--border-default) 75%, transparent);
    overflow: hidden;
}

.guide-onboarding-progress-fill {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--text-primary);
    transition: width 180ms ease-out;
}

.guide-onboarding-title {
    margin: 4px 0 0;
    font-size: var(--type-size-400);
    line-height: var(--type-line-400);
    letter-spacing: -0.02em;
    color: var(--text-primary);
}

.guide-onboarding-summary {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
}

.guide-onboarding-claims {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 12px;
}

.guide-onboarding-claim {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 12px;
    background: var(--bg-surface);
    display: grid;
    gap: 8px;
}

.guide-onboarding-claim-text {
    margin: 0;
    color: var(--text-primary);
    font-size: var(--type-size-200);
    line-height: var(--type-line-200);
}

.guide-onboarding-source-btn {
    width: 100%;
    text-align: left;
    border: 1px solid var(--border-default);
    border-radius: 8px;
    padding: 10px 12px;
    background: color-mix(in srgb, var(--bg-surface) 84%, var(--gray-10));
    display: grid;
    gap: 3px;
    cursor: pointer;
    transition: border-color 140ms ease, transform 140ms ease, background-color 140ms ease;
}

.guide-onboarding-source-btn:hover {
    border-color: color-mix(in srgb, var(--brand-primary) 40%, var(--border-default));
    background: color-mix(in srgb, var(--bg-surface) 90%, var(--brand-primary) 8%);
    transform: translateY(-1px);
}

.guide-onboarding-source-label {
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
}

.guide-onboarding-source-path {
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
    word-break: break-all;
}

.guide-onboarding-source-copied {
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--success);
    font-weight: var(--font-weight-semibold);
}

.guide-onboarding-code {
    margin: 0;
    border: 1px solid color-mix(in srgb, var(--brand-primary) 30%, var(--border-default));
    border-radius: 12px;
    padding: 10px 12px;
    background: #0b1020;
    color: #e5ecff;
    overflow-x: auto;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
}

.guide-onboarding-nav,
.guide-onboarding-actions,
.guide-onboarding-quiz-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.guide-onboarding-btn {
    border: 1px solid var(--border-default);
    border-radius: 9px;
    padding: 9px 13px;
    background: var(--text-primary);
    color: var(--bg-surface);
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease;
}

.guide-onboarding-btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
}

.guide-onboarding-btn-secondary {
    background: var(--bg-surface);
    color: var(--text-primary);
}

.guide-onboarding-gate,
.guide-onboarding-roadmap {
    border: 1px solid var(--border-default);
    border-radius: 14px;
    padding: 14px;
    background: var(--bg-surface);
    display: grid;
    gap: 10px;
}

.guide-onboarding-section-title {
    margin: 0;
    font-size: var(--type-size-400);
    line-height: var(--type-line-400);
    letter-spacing: -0.02em;
    color: var(--text-primary);
}

.guide-onboarding-check,
.guide-onboarding-quiz-option {
    display: flex;
    align-items: start;
    gap: 8px;
    color: var(--text-primary);
    line-height: 1.45;
}

.guide-onboarding-quiz-item {
    border-top: 1px dashed color-mix(in srgb, var(--border-default) 80%, transparent);
    padding-top: 10px;
    display: grid;
    gap: 6px;
}

.guide-onboarding-quiz-item:first-of-type {
    border-top: 0;
    padding-top: 0;
}

.guide-onboarding-quiz-prompt {
    margin: 0;
    font-size: var(--type-size-200);
    line-height: var(--type-line-200);
    color: var(--text-primary);
    font-weight: var(--font-weight-semibold);
}

.guide-onboarding-quiz-result {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
}

.guide-onboarding-roadmap-list {
    margin: 0;
    padding-left: 16px;
    display: grid;
    gap: 4px;
}

button:disabled {
    opacity: 0.46;
    cursor: not-allowed;
    transform: none;
    filter: none;
}

@keyframes onboarding-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 820px) {
    .guide-onboarding-card {
        padding: 20px;
    }

    .guide-onboarding-welcome-steps {
        grid-template-columns: 1fr;
    }
}
</style>
