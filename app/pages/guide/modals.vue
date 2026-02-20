<script setup lang="ts">
import { computed, ref } from 'vue';
import { flagNames, flags, type FlagCode } from '@/data/ui/flags';

const isLocaleModalOpen = ref(false);
const selectedLocale = ref<FlagCode>('us');
const isArchiveModalOpen = ref(false);
const isSupportModalOpen = ref(false);
const lastModalAction = ref('No modal action yet.');

const supportName = ref('');
const supportEmail = ref('');
const supportMessage = ref('');

const currencyByCode: Partial<Record<FlagCode, string>> = {
    us: 'USD',
    kr: 'KRW',
    gb: 'GBP',
    jp: 'JPY',
    cn: 'CNY',
    hk: 'HKD',
    tw: 'TWD',
    ca: 'CAD',
    au: 'AUD',
    nz: 'NZD',
    ad: 'EUR',
    at: 'EUR',
    be: 'EUR',
    cy: 'EUR',
    de: 'EUR',
    es: 'EUR',
    fi: 'EUR',
    fr: 'EUR',
    gr: 'EUR',
    ie: 'EUR',
    it: 'EUR',
    lt: 'EUR',
    lu: 'EUR',
    lv: 'EUR',
    mc: 'EUR',
    mt: 'EUR',
    nl: 'EUR',
    pt: 'EUR',
    si: 'EUR',
    sk: 'EUR',
    ee: 'EUR',
    sm: 'EUR',
    va: 'EUR',
    ch: 'CHF',
    no: 'NOK',
    se: 'SEK',
    dk: 'DKK',
    pl: 'PLN',
    cz: 'CZK',
    hu: 'HUF',
    ro: 'RON',
    bg: 'BGN',
    rs: 'RSD',
    hr: 'EUR',
    is: 'ISK',
    tr: 'TRY',
    ua: 'UAH',
    ru: 'RUB',
    in: 'INR',
    id: 'IDR',
    my: 'MYR',
    sg: 'SGD',
    th: 'THB',
    vn: 'VND',
    ph: 'PHP',
    pk: 'PKR',
    bd: 'BDT',
    lk: 'LKR',
    np: 'NPR',
    ae: 'AED',
    sa: 'SAR',
    qa: 'QAR',
    kw: 'KWD',
    bh: 'BHD',
    om: 'OMR',
    il: 'ILS',
    eg: 'EGP',
    za: 'ZAR',
    ng: 'NGN',
    ke: 'KES',
    gh: 'GHS',
    ma: 'MAD',
    tn: 'TND',
    dz: 'DZD',
    et: 'ETB',
    ug: 'UGX',
    tz: 'TZS',
    rw: 'RWF',
    zm: 'ZMW',
    bw: 'BWP',
    na: 'NAD',
    ao: 'AOA',
    mz: 'MZN',
    cm: 'XAF',
    cg: 'XAF',
    ga: 'XAF',
    td: 'XAF',
    gq: 'XAF',
    cf: 'XAF',
    sn: 'XOF',
    ci: 'XOF',
    ml: 'XOF',
    bf: 'XOF',
    ne: 'XOF',
    tg: 'XOF',
    bj: 'XOF',
    gw: 'XOF',
    ar: 'ARS',
    br: 'BRL',
    mx: 'MXN',
    cl: 'CLP',
    co: 'COP',
    pe: 'PEN',
    uy: 'UYU',
    py: 'PYG',
    bo: 'BOB',
    ec: 'USD',
    pa: 'PAB',
    cr: 'CRC',
    gt: 'GTQ',
    hn: 'HNL',
    ni: 'NIO',
    sv: 'USD',
    do: 'DOP',
    cu: 'CUP',
    jm: 'JMD',
    tt: 'TTD',
    bs: 'BSD',
    bb: 'BBD',
    ag: 'XCD',
    ai: 'XCD',
    dm: 'XCD',
    gd: 'XCD',
    kn: 'XCD',
    lc: 'XCD',
    ms: 'XCD',
    vc: 'XCD',
    kz: 'KZT',
    uz: 'UZS',
    kg: 'KGS',
    tj: 'TJS',
    tm: 'TMT',
    mn: 'MNT',
};

const localeOptions = computed(() =>
    flags
        .map((code) => ({
            code,
            country: flagNames[code],
            currency: currencyByCode[code] ?? 'N/A',
            label: `English (${currencyByCode[code] ?? 'N/A'})`,
        }))
        .sort((a, b) => a.country.localeCompare(b.country))
);

const selectedLocaleMeta = computed(
    () =>
        localeOptions.value.find(
            (item) => item.code === selectedLocale.value
        ) ?? localeOptions.value[0]
);

function selectLocale(code: FlagCode) {
    selectedLocale.value = code;
    isLocaleModalOpen.value = false;
}

function confirmArchive() {
    lastModalAction.value = 'Archive confirmed from confirmation modal.';
    isArchiveModalOpen.value = false;
}

function cancelArchive() {
    lastModalAction.value = 'Archive cancelled.';
    isArchiveModalOpen.value = false;
}

function closeSupportModal() {
    isSupportModalOpen.value = false;
}

function submitSupportRequest() {
    const payload = {
        name: supportName.value.trim(),
        email: supportEmail.value.trim(),
        message: supportMessage.value.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
        lastModalAction.value = 'Support request needs all fields before sending.';
        return;
    }

    lastModalAction.value = `Support request submitted for ${payload.name}.`;
    isSupportModalOpen.value = false;
}
</script>

<template>
    <section class="guide-wrapper guide-modals">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Modals</h1>
            <p class="guide-description">
                Reusable overlay dialogs for confirmations, preferences, and
                focused tasks.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Confirmation Modal</h2>
            <p class="guide-section-description">
                Use this pattern for destructive or irreversible actions.
            </p>

            <div class="guide-modal-demo">
                <p class="guide-modal-status">{{ lastModalAction }}</p>
                <UiButton tone="neutral" @click="isArchiveModalOpen = true">
                    Open Confirmation
                </UiButton>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Form Modal</h2>
            <p class="guide-section-description">
                Use this pattern for short, focused form tasks.
            </p>

            <div class="guide-modal-demo">
                <UiButton
                    tone="default"
                    :style="{ '--btn-bg': 'var(--brand-secondary)' }"
                    @click="isSupportModalOpen = true"
                >
                    Open Form Modal
                </UiButton>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Locale Preferences Modal</h2>
            <p class="guide-section-description">
                Demo using all available flags with currency labels.
            </p>

            <div class="guide-modal-demo">
                <div class="guide-modal-current">
                    <UiFlag :code="selectedLocale" :size="24" />
                    <span class="guide-modal-current-text">
                        Current: {{ selectedLocale.toUpperCase() }} -
                        {{ selectedLocaleMeta?.currency }}
                    </span>
                </div>

                <UiButton
                    tone="default"
                    :style="{ '--btn-bg': 'var(--brand-secondary)' }"
                    @click="isLocaleModalOpen = true"
                >
                    Open Modal
                </UiButton>
            </div>
        </section>

        <UiModal v-model="isArchiveModalOpen" title="Archive project?" width="480px">
            <p class="guide-modal-copy">
                This action moves the project to archive and hides it from your active workspace.
            </p>

            <template #footer>
                <div class="guide-modal-footer-actions">
                    <UiButton
                        tone="neutral"
                        variant="outline"
                        @click="cancelArchive"
                    >
                        Cancel
                    </UiButton>
                    <UiButton
                        tone="neutral"
                        variant="filled"
                        @click="confirmArchive"
                    >
                        Confirm Archive
                    </UiButton>
                </div>
            </template>
        </UiModal>

        <UiModal v-model="isSupportModalOpen" title="Request support callback" width="520px">
            <div class="guide-modal-form">
                <UiInput
                    v-model="supportName"
                    placeholder="Full name"
                    autocomplete="name"
                />
                <UiInput
                    v-model="supportEmail"
                    placeholder="Work email"
                    type="email"
                    autocomplete="email"
                />
                <UiTextarea
                    v-model="supportMessage"
                    placeholder="Tell us what you need help with"
                    :rows="4"
                />
            </div>

            <template #footer>
                <div class="guide-modal-footer-actions">
                    <UiButton
                        tone="neutral"
                        variant="outline"
                        @click="closeSupportModal"
                    >
                        Close
                    </UiButton>
                    <UiButton
                        tone="neutral"
                        variant="filled"
                        @click="submitSupportRequest"
                    >
                        Send Request
                    </UiButton>
                </div>
            </template>
        </UiModal>

        <UiModal
            v-model="isLocaleModalOpen"
            title="Local preferences"
            width="520px"
        >
            <div class="guide-locale-list">
                <button
                    v-for="option in localeOptions"
                    :key="option.code"
                    type="button"
                    class="guide-locale-item"
                    :class="{ 'is-active': selectedLocale === option.code }"
                    @click="selectLocale(option.code)"
                >
                    <UiFlag :code="option.code" :size="20" />
                    <span class="guide-locale-item-content">
                        <span class="guide-locale-item-label">
                            {{ option.label }}
                        </span>
                        <span class="guide-locale-item-note">
                            {{ option.country }}
                        </span>
                    </span>
                </button>
            </div>
        </UiModal>
    </section>
</template>

<style scoped lang="scss">
.guide-modal-status {
    margin: 0;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 20px;
}

.guide-modal-copy {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 24px;
}

.guide-modal-form {
    display: grid;
    gap: 10px;
}

.guide-modal-footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
