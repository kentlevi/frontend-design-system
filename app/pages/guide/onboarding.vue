<script setup lang="ts">
import { copyTextToClipboard } from '@/utils/clipboard';

type RoleTrack = 'fe' | 'qa' | 'design';

type FileLink = {
    label: string;
    path: string;
};

type OnboardingSlide = {
    id: string;
    title: string;
    summary: string;
    roles: RoleTrack[];
    points: string[];
    code?: string;
    fileLinks?: FileLink[];
    commands?: string[];
};

type QuizQuestion = {
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    roles?: RoleTrack[];
};

const GUIDE_ONBOARDING_COOKIE = 'guide_onboarding_completed_v1';
const ONBOARDING_VERSION = 'v2.0';
const ONBOARDING_LAST_UPDATED = '2026-02-23';
definePageMeta({ layout: false });

const route = useRoute();
const localePath = useLocalePath();

const selectedRole = ref<RoleTrack>('fe');
const currentSlide = ref(0);
const isSubmitting = ref(false);
const copiedPath = ref('');
const quizSubmitted = ref(false);

const slides: OnboardingSlide[] = [
    {
        id: 'site-structure',
        title: 'Site Structure',
        summary: 'Core project layout and where development work should live.',
        roles: ['fe', 'qa', 'design'],
        points: [
            'Route pages live in app/pages and drive URL structure.',
            'Shared wrappers live in app/layouts (default, home, guide, auth).',
            'Reusable and feature UI live in app/components.',
            'Behavior/state logic lives in app/composables.',
            'Static/config content and guide mappings live in app/data.',
            'SCSS/tokens are organized in app/assets/scss.',
        ],
        code: `app/
  pages/
  layouts/
  components/
  composables/
  data/
  assets/scss/`,
        fileLinks: [
            { label: 'UI components', path: 'app/components/ui' },
            { label: 'Composables', path: 'app/composables' },
            { label: 'Data sources', path: 'app/data' },
            { label: 'SCSS foundation', path: 'app/assets/scss' },
        ],
    },
    {
        id: 'component-flow',
        title: 'Components and Composables Flow',
        summary: 'Keep rendering and behavior responsibilities separated.',
        roles: ['fe', 'qa'],
        points: [
            'Use components for rendering and UX states.',
            'Use composables for state, derived values, and actions.',
            'Prefer typed props/emits and clear event names.',
            'Keep shared patterns in app/components/ui.',
        ],
        code: `<UiInput v-model="email" />
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { state, actions } = useFeatureFlow()`,
        fileLinks: [
            { label: 'Example UI primitives', path: 'app/components/ui' },
            { label: 'Feature composables', path: 'app/composables' },
        ],
    },
    {
        id: 'scss-architecture',
        title: 'SCSS and Token Architecture',
        summary: 'Use existing token layers before introducing custom values.',
        roles: ['fe', 'design'],
        points: [
            'Foundation defines semantic tokens and global scales.',
            'Component styles should consume tokens, not hardcoded one-offs.',
            'Layout styles belong under assets/scss/layouts.',
            'Avoid duplicate spacing/color definitions across components.',
        ],
        code: `assets/scss/
  foundation/
  components/
  layouts/
  site.scss`,
        fileLinks: [
            { label: 'SCSS root', path: 'app/assets/scss' },
            { label: 'Foundation tokens', path: 'app/assets/scss/foundation' },
            { label: 'Component styles', path: 'app/assets/scss/components' },
        ],
    },
    {
        id: 'class-naming',
        title: 'Class Naming Standards',
        summary: 'Keep class names scoped, readable, and state-driven.',
        roles: ['fe', 'design'],
        points: [
            'Use feature prefixes (`auth-login-*`, `guide-*`, `product-*`).',
            'Use modifiers (`.is-active`, `.is-disabled`) for state.',
            'Do not introduce unclear utility-like class names inside features.',
            'Keep naming aligned with component boundaries.',
        ],
        code: `.auth-login-card {}
.auth-login-card.is-loading {}
.guide-preview-frame-wrap.is-mobile {}`,
    },
    {
        id: 'quick-commands',
        title: 'Quick Commands',
        summary: 'Use these commands during standard development flow.',
        roles: ['fe', 'qa', 'design'],
        points: [
            'Use dev for iteration, build for verification, and build:icons for icon updates.',
        ],
        commands: ['npm run dev', 'npm run build', 'npm run build:icons'],
    },
    {
        id: 'web-vitals-playbook',
        title: 'Web Vitals Playbook',
        summary: 'Performance guardrails to keep before and after shipping.',
        roles: ['fe', 'qa', 'design'],
        points: [
            'Primary targets: LCP <= 2.5s, CLS <= 0.10, INP <= 200ms (p75).',
            'Track both lab (Lighthouse/CI) and field behavior (real usage).',
            'Watch JS cost: bundle size, hydration cost, long tasks, third-party scripts.',
            'Validate route-level behavior for home, listing, product, auth, and account screens.',
            'Treat performance regressions as release blockers when budgets are exceeded.',
        ],
        code: `Perf gates:
- LCP p75 <= 2.5s
- CLS p75 <= 0.10
- INP p75 <= 200ms
- Block PR when budgets regress`,
    },
    {
        id: 'common-mistakes',
        title: 'Common Mistakes',
        summary: 'Avoid these recurring quality regressions.',
        roles: ['fe', 'qa', 'design'],
        points: [
            'Using one-off CSS values instead of existing tokens.',
            'Missing `data-testid` on key interactive elements.',
            'No visible `:focus-visible` styling for keyboard users.',
            'Adding route-level behavior without updating guide docs.',
        ],
    },
    {
        id: 'guide-update-required',
        title: 'Guide Update Required',
        summary: 'When behavior or component API changes, update guide artifacts too.',
        roles: ['fe', 'qa', 'design'],
        points: [
            'Update guide docs content and coverage map.',
            'Update affected guide pages and examples.',
            'Update feature components/composables references if behavior changed.',
        ],
        fileLinks: [
            { label: 'Guide docs', path: 'app/data/guide/docs.ts' },
            { label: 'Guide index map', path: 'app/data/guide/guides.ts' },
            { label: 'Guide pages', path: 'app/pages/guide/*.vue' },
            { label: 'Feature components', path: 'app/components/...' },
            { label: 'Feature composables', path: 'app/composables/...' },
        ],
    },
    {
        id: 'branch-policy',
        title: 'Branch Policy',
        summary: 'Apply base changes in the correct branch order.',
        roles: ['fe', 'qa', 'design'],
        points: [
            'Implement base/site-safe changes first on `site-only`.',
            'Then merge or cherry-pick into `site-with-guide`.',
            'Keep guide-library additions isolated to `site-with-guide`.',
        ],
        code: `flow:
site-only -> merge/cherry-pick -> site-with-guide`,
    },
    {
        id: 'definition-of-done',
        title: 'Definition of Done Gate',
        summary: 'Complete checklist + quiz before proceeding to guide work.',
        roles: ['fe', 'qa', 'design'],
        points: [
            'All required checkboxes must be completed.',
            'Quiz requires all correct answers.',
        ],
    },
];

const definitionOfDoneItems = ref([
    {
        id: 'dod-build',
        label: 'Build and route behavior have been verified.',
        checked: false,
    },
    {
        id: 'dod-docs',
        label: 'Guide docs/checklist updates are planned for UI behavior changes.',
        checked: false,
    },
    {
        id: 'dod-a11y',
        label: 'A11y checks are covered (keyboard, focus, labels, contrast).',
        checked: false,
    },
    {
        id: 'dod-testid',
        label: 'Test IDs are present for key interactive actions.',
        checked: false,
    },
]);

const quizQuestions: QuizQuestion[] = [
    {
        id: 'q-branch-flow',
        prompt: 'Which branch flow should be used for base changes?',
        options: [
            'Start in `site-only`, then merge/cherry-pick to `site-with-guide`.',
            'Start in `site-with-guide`, then force-push to `site-only`.',
            'Commit directly to both branches without merge flow.',
        ],
        correctIndex: 0,
    },
    {
        id: 'q-tokens',
        prompt: 'What should you do before adding one-off spacing/color values?',
        options: [
            'Check and use existing tokens first.',
            'Add one-off values in each component as needed.',
            'Store one-off values inside inline styles only.',
        ],
        correctIndex: 0,
        roles: ['fe', 'design'],
    },
    {
        id: 'q-testid',
        prompt: 'For key interactive controls, what is required?',
        options: [
            'Stable `data-testid` hooks and deterministic selectors.',
            'Only text selectors in tests.',
            'No test hooks needed in guide-driven components.',
        ],
        correctIndex: 0,
        roles: ['fe', 'qa'],
    },
    {
        id: 'q-a11y',
        prompt: 'Which focus behavior is expected?',
        options: [
            'Visible `:focus-visible` states for keyboard navigation.',
            'No focus style to keep UI clean.',
            'Mouse-only hover states are enough.',
        ],
        correctIndex: 0,
    },
    {
        id: 'q-guide-update',
        prompt: 'When component behavior changes, which files need guide updates?',
        options: [
            '`app/data/guide/docs.ts` and related guide pages/maps.',
            'No guide files should be edited.',
            'Only style files should be edited.',
        ],
        correctIndex: 0,
    },
];

const quizAnswers = ref<Record<string, number | null>>({});

const filteredSlides = computed(() =>
    slides.filter((slide) => slide.roles.includes(selectedRole.value))
);
const filteredQuizQuestions = computed(() =>
    quizQuestions.filter(
        (question) =>
            !question.roles || question.roles.includes(selectedRole.value)
    )
);
const isLastSlide = computed(
    () => currentSlide.value === filteredSlides.value.length - 1
);
const activeSlide = computed(() => filteredSlides.value[currentSlide.value]);
const allChecklistChecked = computed(() =>
    definitionOfDoneItems.value.every((item) => item.checked)
);
const allQuizAnswered = computed(() =>
    filteredQuizQuestions.value.every(
        (question) => quizAnswers.value[question.id] !== null
    )
);
const quizAllCorrect = computed(() =>
    filteredQuizQuestions.value.every(
        (question) => quizAnswers.value[question.id] === question.correctIndex
    )
);
const canProceed = computed(
    () =>
        isLastSlide.value &&
        allChecklistChecked.value &&
        quizSubmitted.value &&
        quizAllCorrect.value
);

const onboardingCookie = useCookie<string | null>(GUIDE_ONBOARDING_COOKIE, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
});

const redirectTarget = computed(() => {
    const redirect = route.query.redirect;
    const redirectValue = Array.isArray(redirect) ? redirect[0] : redirect;

    if (typeof redirectValue === 'string' && redirectValue.includes('/guide')) {
        return redirectValue;
    }

    return localePath('/guide');
});

function initQuizAnswers() {
    const next: Record<string, number | null> = {};
    for (const question of filteredQuizQuestions.value) {
        next[question.id] = null;
    }
    quizAnswers.value = next;
    quizSubmitted.value = false;
}

async function copyPath(path: string) {
    try {
        await copyTextToClipboard(path);
        copiedPath.value = path;
        setTimeout(() => {
            if (copiedPath.value === path) {
                copiedPath.value = '';
            }
        }, 1200);
    } catch {}
}

function nextSlide() {
    if (isLastSlide.value) return;
    currentSlide.value += 1;
}

function previousSlide() {
    if (currentSlide.value <= 0) return;
    currentSlide.value -= 1;
}

function submitQuiz() {
    if (!allQuizAnswered.value) return;
    quizSubmitted.value = true;
}

function retryQuiz() {
    initQuizAnswers();
}

function resetOnboarding() {
    onboardingCookie.value = null;
    selectedRole.value = 'fe';
    currentSlide.value = 0;
    copiedPath.value = '';
    isSubmitting.value = false;
    for (const item of definitionOfDoneItems.value) {
        item.checked = false;
    }
    initQuizAnswers();
}

function proceedToGuide() {
    if (!canProceed.value) return;
    isSubmitting.value = true;
    onboardingCookie.value = '1';
    navigateTo(redirectTarget.value);
}

watch(selectedRole, () => {
    currentSlide.value = 0;
    initQuizAnswers();
});

initQuizAnswers();
</script>

<template>
    <section class="guide-onboarding">
        <div class="guide-onboarding-card">
            <div class="guide-onboarding-head">
                <p class="guide-onboarding-kicker">Guide Onboarding</p>
                <p v-if="currentSlide === 0" class="guide-onboarding-meta">
                    {{ ONBOARDING_VERSION }} | Updated {{ ONBOARDING_LAST_UPDATED }}
                </p>
            </div>

            <div class="guide-onboarding-role">
                <p class="guide-onboarding-label">Role Track</p>
                <select
                    v-model="selectedRole"
                    class="guide-onboarding-role-select"
                    aria-label="Role track"
                >
                    <option value="fe">Frontend</option>
                    <option value="qa">QA</option>
                    <option value="design">Design</option>
                </select>
            </div>

            <p class="guide-onboarding-step">
                Slide {{ currentSlide + 1 }} / {{ filteredSlides.length }}
            </p>
            <h1 class="guide-onboarding-title">{{ activeSlide.title }}</h1>
            <p class="guide-onboarding-summary">{{ activeSlide.summary }}</p>

            <ul class="guide-onboarding-list">
                <li v-for="point in activeSlide.points" :key="point">
                    {{ point }}
                </li>
            </ul>

            <div v-if="activeSlide.fileLinks?.length" class="guide-onboarding-links">
                <p class="guide-onboarding-label">File References</p>
                <button
                    v-for="link in activeSlide.fileLinks"
                    :key="link.path"
                    type="button"
                    class="guide-onboarding-link"
                    @click="copyPath(link.path)"
                >
                    <span class="guide-onboarding-link-title">{{ link.label }}</span>
                    <code class="guide-onboarding-link-path">{{ link.path }}</code>
                    <span v-if="copiedPath === link.path" class="guide-onboarding-link-copied">
                        Copied
                    </span>
                </button>
            </div>

            <div v-if="activeSlide.commands?.length" class="guide-onboarding-commands">
                <p class="guide-onboarding-label">Quick Commands</p>
                <pre class="guide-onboarding-code"><code>{{ activeSlide.commands.join('\n') }}</code></pre>
            </div>

            <pre v-else-if="activeSlide.code" class="guide-onboarding-code"><code>{{ activeSlide.code }}</code></pre>

            <div class="guide-onboarding-nav">
                <button
                    type="button"
                    class="guide-onboarding-button guide-onboarding-button-secondary"
                    :disabled="currentSlide === 0"
                    @click="previousSlide"
                >
                    Previous
                </button>

                <div class="guide-onboarding-dots" aria-hidden="true">
                    <span
                        v-for="(_, index) in filteredSlides"
                        :key="index"
                        class="guide-onboarding-dot"
                        :class="{ 'is-active': index === currentSlide }"
                    />
                </div>

                <button
                    type="button"
                    class="guide-onboarding-button"
                    :disabled="isLastSlide"
                    @click="nextSlide"
                >
                    Next
                </button>
            </div>

            <div v-if="isLastSlide" class="guide-onboarding-gate">
                <section class="guide-onboarding-gate-section">
                    <h2 class="guide-onboarding-gate-title">Definition of Done Checklist</h2>
                    <label
                        v-for="item in definitionOfDoneItems"
                        :key="item.id"
                        class="guide-onboarding-check"
                    >
                        <input v-model="item.checked" type="checkbox" />
                        <span>{{ item.label }}</span>
                    </label>
                </section>

                <section class="guide-onboarding-gate-section">
                    <h2 class="guide-onboarding-gate-title">Quiz Gate</h2>
                    <div
                        v-for="question in filteredQuizQuestions"
                        :key="question.id"
                        class="guide-onboarding-quiz-item"
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
                            />
                            <span>{{ option }}</span>
                        </label>
                        <p
                            v-if="quizSubmitted"
                            class="guide-onboarding-quiz-feedback"
                            :class="{
                                'is-correct': quizAnswers[question.id] === question.correctIndex,
                                'is-wrong': quizAnswers[question.id] !== question.correctIndex,
                            }"
                        >
                            {{
                                quizAnswers[question.id] === question.correctIndex
                                    ? 'Correct'
                                    : 'Incorrect'
                            }}
                        </p>
                    </div>

                    <div class="guide-onboarding-quiz-actions">
                        <button
                            type="button"
                            class="guide-onboarding-button guide-onboarding-button-secondary"
                            :disabled="!allQuizAnswered"
                            @click="submitQuiz"
                        >
                            Submit Quiz
                        </button>
                        <button
                            type="button"
                            class="guide-onboarding-button guide-onboarding-button-secondary"
                            @click="retryQuiz"
                        >
                            Retry Quiz
                        </button>
                        <p
                            v-if="quizSubmitted"
                            class="guide-onboarding-quiz-result"
                            :class="{ 'is-pass': quizAllCorrect, 'is-fail': !quizAllCorrect }"
                        >
                            {{ quizAllCorrect ? 'Quiz passed.' : 'Quiz not passed.' }}
                        </p>
                    </div>
                </section>
            </div>

            <div class="guide-onboarding-actions">
                <button
                    type="button"
                    class="guide-onboarding-button"
                    :disabled="!canProceed || isSubmitting"
                    @click="proceedToGuide"
                >
                    Proceed to Guide
                </button>
                <button
                    type="button"
                    class="guide-onboarding-button guide-onboarding-button-secondary"
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
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 32px 20px;
    background:
        radial-gradient(
            circle at 8% 8%,
            color-mix(in srgb, var(--brand-secondary) 14%, transparent),
            transparent 44%
        ),
        radial-gradient(
            circle at 92% 92%,
            color-mix(in srgb, var(--brand-primary) 10%, transparent),
            transparent 46%
        ),
        var(--bg-primary);
}

.guide-onboarding-card {
    width: min(860px, 100%);
    border: 1px solid var(--border-default);
    border-radius: 18px;
    padding: 26px;
    background: var(--bg-surface);
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.16);
}

.guide-onboarding-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.guide-onboarding-kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 12px;
    line-height: 18px;
    color: var(--text-secondary);
}

.guide-onboarding-meta {
    margin: 0;
    font-size: 12px;
    line-height: 18px;
    color: var(--text-muted);
}

.guide-onboarding-role {
    margin-top: 14px;
}

.guide-onboarding-label {
    margin: 0 0 8px;
    font-size: 12px;
    line-height: 18px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.guide-onboarding-role-select {
    min-width: 180px;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    background: var(--bg-surface);
    color: var(--text-primary);
    padding: 8px 36px 8px 12px;
    font-size: 13px;
    line-height: 20px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' fill='none' stroke='%23334155' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px 12px;
}

.guide-onboarding-step {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 18px;
    color: var(--text-muted);
}

.guide-onboarding-title {
    margin: 8px 0 10px;
    font-size: 30px;
    line-height: 38px;
    color: var(--text-primary);
}

.guide-onboarding-summary {
    margin: 0;
    font-size: 15px;
    line-height: 24px;
    color: var(--text-secondary);
}

.guide-onboarding-list {
    margin: 16px 0 0;
    padding-left: 20px;
    display: grid;
    gap: 8px;
    font-size: 14px;
    line-height: 24px;
    color: var(--text-primary);
}

.guide-onboarding-links {
    margin-top: 14px;
}

.guide-onboarding-link {
    width: 100%;
    text-align: left;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    background: var(--bg-surface);
    padding: 10px 12px;
    display: grid;
    gap: 2px;
    cursor: pointer;
}

.guide-onboarding-link + .guide-onboarding-link {
    margin-top: 8px;
}

.guide-onboarding-link-title {
    font-size: 12px;
    color: var(--text-secondary);
}

.guide-onboarding-link-path {
    font-size: 12px;
    color: var(--text-primary);
}

.guide-onboarding-link-copied {
    font-size: 11px;
    color: #16a34a;
}

.guide-onboarding-code {
    margin: 16px 0 0;
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background: #0f172a;
    color: #e2e8f0;
    padding: 12px;
    font-size: 12px;
    line-height: 18px;
    overflow-x: auto;
}

.guide-onboarding-nav {
    margin-top: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.guide-onboarding-dots {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.guide-onboarding-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--text-muted) 34%, transparent);
}

.guide-onboarding-dot.is-active {
    background: var(--brand-secondary);
}

.guide-onboarding-gate {
    margin-top: 20px;
    border-top: 1px solid var(--border-default);
    padding-top: 16px;
    display: grid;
    gap: 16px;
}

.guide-onboarding-gate-section {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 12px;
    background: color-mix(in srgb, var(--bg-surface) 94%, var(--gray-20));
}

.guide-onboarding-gate-title {
    margin: 0 0 10px;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
}

.guide-onboarding-check {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    line-height: 22px;
    color: var(--text-primary);
}

.guide-onboarding-check + .guide-onboarding-check {
    margin-top: 8px;
}

.guide-onboarding-quiz-item + .guide-onboarding-quiz-item {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border-default);
}

.guide-onboarding-quiz-prompt {
    margin: 0 0 8px;
    font-size: 14px;
    line-height: 22px;
    color: var(--text-primary);
    font-weight: 600;
}

.guide-onboarding-quiz-option {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    line-height: 20px;
    color: var(--text-secondary);
}

.guide-onboarding-quiz-option + .guide-onboarding-quiz-option {
    margin-top: 6px;
}

.guide-onboarding-quiz-feedback {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 18px;
}

.guide-onboarding-quiz-feedback.is-correct {
    color: #16a34a;
}

.guide-onboarding-quiz-feedback.is-wrong {
    color: #dc2626;
}

.guide-onboarding-quiz-actions {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.guide-onboarding-quiz-result {
    margin: 0 0 0 2px;
    font-size: 12px;
    line-height: 18px;
}

.guide-onboarding-quiz-result.is-pass {
    color: #16a34a;
}

.guide-onboarding-quiz-result.is-fail {
    color: #dc2626;
}

.guide-onboarding-actions {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.guide-onboarding-button {
    border: 1px solid color-mix(in srgb, var(--brand-secondary) 40%, var(--border-default));
    border-radius: 10px;
    background: var(--brand-secondary);
    color: var(--contrast-light);
    padding: 10px 16px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    cursor: pointer;
}

.guide-onboarding-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.guide-onboarding-button-secondary {
    background: transparent;
    color: var(--text-primary);
}
</style>
