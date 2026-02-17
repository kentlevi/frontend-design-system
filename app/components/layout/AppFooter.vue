<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const year = new Date().getFullYear();
const route = useRoute();
const isAuthRoute = computed(() => route.path.startsWith('/auth'));
</script>

<template>
    <footer class="home-footer" :class="{ 'is-auth': isAuthRoute }">
        <div v-if="isAuthRoute" class="home-footer-compact">
            <div class="home-footer-compact-left">
                <span>&copy; GLOPHICS Corp. {{ year }}</span>
                <a href="#">{{ t('home.footer.terms') }}</a>
                <a href="#">{{ t('home.footer.privacy') }}</a>
            </div>
            <div class="home-footer-compact-links">
                <a href="#">{{ t('home.footer.inquiry') }}</a>
                <a href="#">{{ t('home.footer.faq') }}</a>
            </div>
        </div>

        <div v-else class="home-footer-inner">
            <div class="home-footer-left">
                <h2 class="home-footer-brand">MUSTICKER</h2>
                <p class="home-footer-meta">
                    {{ t('home.footer.meta1') }}
                </p>
                <p class="home-footer-meta">
                    {{ t('home.footer.meta2') }}
                </p>
                <p class="home-footer-copy">
                    &copy; GLOPHICS Corp. {{ year }}
                    <a href="#">{{ t('home.footer.terms') }}</a>
                    <a href="#">{{ t('home.footer.privacy') }}</a>
                </p>
            </div>

            <div class="home-footer-right">
                <p class="home-footer-phone">1588-5218</p>
                <p class="home-footer-hours">{{ t('home.footer.hours') }}</p>
                <p class="home-footer-note">{{ t('home.footer.closed') }}</p>
                <div class="home-footer-links">
                    <a href="#">{{ t('home.footer.inquiry') }}</a>
                    <a href="#">{{ t('home.footer.faq') }}</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped lang="scss">
.home-footer {
    background: var(--bg-page);
    padding: 0 24px 0;

    &.is-auth {
        .home-footer-compact {
            max-width: 1200px;
            margin: 0 auto;
            background: #232737;
            min-height: 102px;
            padding: 0 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }

        .home-footer-compact-left {
            display: flex;
            align-items: center;
            gap: 28px;
            color: #f5f6fb;
            font-size: 12px;
            line-height: 1;

            a {
                color: #ffffff;
                text-decoration: none;
                font-size: 12px;
                font-weight: 600;
            }
        }

        .home-footer-compact-links {
            display: flex;
            align-items: center;
            gap: 8px;

            a {
                border: 1px solid #70758b;
                color: #f5f6fb;
                font-size: 11px;
                text-decoration: none;
                padding: 6px 12px;
                border-radius: 3px;
                line-height: 1;
            }
        }
    }

    .home-footer-inner {
        max-width: 1200px;
        margin: 0 auto;
        background: #232737;
        color: #d6d8de;
        display: flex;
        justify-content: space-between;
        gap: 50px;
        padding: 56px 58px 42px;
    }

    .home-footer-left {
        flex: 1;
    }

    .home-footer-brand {
        margin: 0 0 18px;
        font-size: 34px;
        line-height: 1;
        color: #ffffff;
        letter-spacing: 0.01em;
    }

    .home-footer-meta {
        margin: 6px 0;
        font-size: 12px;
        line-height: 1.55;
        color: #c6c9d4;
    }

    .home-footer-copy {
        margin: 18px 0 0;
        font-size: 12px;
        color: #b7bbca;
        display: flex;
        gap: 14px;

        a {
            color: #ffffff;
            text-decoration: none;
        }
    }

    .home-footer-right {
        min-width: 250px;
        text-align: right;
    }

    .home-footer-phone {
        margin: 0;
        font-size: 38px;
        color: #ffffff;
        line-height: 1;
    }

    .home-footer-hours {
        margin: 10px 0 0;
        font-size: 13px;
        color: #ffffff;
    }

    .home-footer-note {
        margin: 8px 0 18px;
        font-size: 12px;
        color: #b9bdca;
    }

    .home-footer-links {
        display: flex;
        justify-content: end;
        gap: 8px;

        a {
            border: 1px solid #70758b;
            color: #f5f6fb;
            font-size: 11px;
            text-decoration: none;
            padding: 5px 10px;
            border-radius: 3px;
        }
    }

    @media (max-width: 900px) {
        &.is-auth {
            .home-footer-compact {
                min-height: auto;
                padding: 18px 16px;
                flex-direction: column;
                align-items: flex-start;
            }

            .home-footer-compact-left {
                flex-wrap: wrap;
                gap: 12px;
                font-size: 12px;

                a {
                    font-size: 12px;
                }
            }

            .home-footer-compact-links a {
                font-size: 11px;
            }
        }
    }
}
</style>
