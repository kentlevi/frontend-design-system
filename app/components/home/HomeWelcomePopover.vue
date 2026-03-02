<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '~/stores/user';

const props = withDefaults(
    defineProps<{
        visible?: boolean;
        rewardPoints?: number;
    }>(),
    {
        visible: false,
        rewardPoints: 4,
    }
);

const emit = defineEmits<{
    (event: 'close'): void;
    (event: 'start'): void;
}>();

const { t } = useI18n();
const userStore = useUserStore();
const mockUser = useCookie<{
    firstName: string;
    lastName: string;
    email: string;
} | null>('mock_user', {
    default: () => null,
    sameSite: 'lax',
    path: '/',
});

function getFieldValueByKey(key: 'first_name' | 'last_name') {
    const legacyId = key === 'first_name' ? 1 : 2;
    const fieldValues = userStore.profile?.user_field_values ?? [];
    const directMatch =
        fieldValues
            .find(
                (field) =>
                    field.country_field?.field_key === key ||
                    (field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) === legacyId
            )
            ?.value?.trim() || '';
    if (directMatch) return directMatch;

    const fallbackRows = [...fieldValues]
        .filter((field) => typeof field.value === 'string' && field.value.trim())
        .sort(
            (a, b) =>
                (a.country_field_id ?? a.country_field_ids ?? a.country_fields_id ?? Number.MAX_SAFE_INTEGER) -
                (b.country_field_id ?? b.country_field_ids ?? b.country_fields_id ?? Number.MAX_SAFE_INTEGER)
        )
        .slice(0, 2);
    if (fallbackRows.length < 2) return '';
    return key === 'first_name'
        ? (fallbackRows[0]?.value?.trim() || '')
        : (fallbackRows[1]?.value?.trim() || '');
}

const storeFirstName = computed(() =>
    getFieldValueByKey('first_name')
);

const emailLocalPart = computed(() => {
    const source = (userStore.email || mockUser.value?.email || '').trim();
    if (!source.includes('@')) return '';
    return source.split('@')[0] || '';
});

const greetingName = computed(
    () =>
        storeFirstName.value ||
        userStore.onboardingProfile?.firstName ||
        mockUser.value?.firstName ||
        emailLocalPart.value ||
        t('home.toast.welcome.defaultName')
);
</script>

<template>
    <Transition name="home-welcome-popover">
        <aside
            v-if="visible"
            class="home-welcome-popover"
            role="dialog"
            aria-live="polite"
            data-testid="home-welcome-popover"
        >
            <button
                type="button"
                class="home-welcome-popover-close"
                aria-label="Close welcome popover"
                data-testid="home-welcome-popover-close"
                @click="emit('close')"
            >
                <UiIcon name="strong-times" :size="20" />
            </button>

            <div class="home-welcome-popover-content">
                <h3 class="home-welcome-popover-title">
                    {{ $t('home.toast.welcome.title', { name: greetingName }) }}
                </h3>
                <p class="home-welcome-popover-text">
                    <span>{{ $t('home.toast.welcome.bodyPrefix') }}</span>
                    <strong>{{ $t('home.toast.welcome.bodyHighlight', { points: props.rewardPoints }) }}</strong>
                    <span>{{ $t('home.toast.welcome.bodySuffix') }}</span>
                </p>
            </div>

            <div class="home-welcome-popover-actions">
                <button
                    type="button"
                    class="home-welcome-popover-skip"
                    data-testid="home-welcome-popover-skip"
                    @click="emit('close')"
                >
                    {{ $t('home.toast.welcome.skip') }}
                </button>
                <UiButton
                    variant="filled"
                    tone="neutral"
                    size="md"
                    class="home-welcome-popover-start"
                    data-testid="home-welcome-popover-start"
                    @click="emit('start')"
                >
                    <UiIcon name="regular-arrow-right" :size="18" />
                    {{ $t('home.toast.welcome.getStarted') }}
                </UiButton>
            </div>
        </aside>
    </Transition>
</template>

<style scoped lang="scss">
.home-welcome-popover {
    position: fixed;
    right: 40px;
    bottom: 36px;
    z-index: 120;
    width: min(370px, calc(100vw - 24px));
    background: var(--brand-primary);
    border: 1px solid color-mix(in srgb, var(--brand-primary) 70%, var(--text-primary));
    border-radius: 16px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
    padding: 24px 26px 20px;
}

.home-welcome-popover-close {
    position: absolute;
    top: 18px;
    right: 16px;
    border: 0;
    background: transparent;
    color: var(--text-primary);
    cursor: pointer;
}

.home-welcome-popover-title {
    margin: 0;
    color: var(--text-primary);
    font-size: 16px;
    line-height: 28px;
    font-weight: 700;
}

.home-welcome-popover-text {
    margin: 0;
    color: var(--text-primary);
    font-size: 14px;
    line-height: 28px;
}

.home-welcome-popover-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.home-welcome-popover-actions {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 22px;
}

.home-welcome-popover-skip {
    border: 0;
    background: transparent;
    color: var(--text-primary);
    font-size: 14px;
    line-height: 24px;
    font-weight: 700;
    cursor: pointer;
}

.home-welcome-popover-start {
    min-width: 136px;
    border-radius: 16px;
    box-shadow: none;
}

.home-welcome-popover-enter-active,
.home-welcome-popover-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.home-welcome-popover-enter-from,
.home-welcome-popover-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

@media (max-width: 860px) {
    .home-welcome-popover {
        right: 12px;
        left: 12px;
        bottom: 12px;
        width: auto;
        padding: 20px 18px 18px;
    }

    .home-welcome-popover-title {
        font-size: 28px;
        line-height: 34px;
    }
}
</style>
