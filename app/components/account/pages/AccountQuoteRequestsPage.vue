<script setup lang="ts">
import { useAccountQuoteRequests } from '~/composables/account/quoteRequests/useAccountQuoteRequests';

const { t } = useI18n();
const { requests, activeRequest } = useAccountQuoteRequests();
</script>

<template>
	<section class="account-page" data-testid="account-quote-requests-page">
		<AccountShell active-tab="quote-requests">
			<div class="account-content" data-testid="account-quote-requests-content">
				<header class="account-quote-header" data-testid="account-quote-requests-header">
					<h1 class="account-quote-title" data-testid="account-quote-requests-title">{{ t('account.quoteRequests.title') }}</h1>
					<div class="account-quote-tools" data-testid="account-quote-requests-tools">
						<UiButton variant="outline" tone="neutral" size="md" data-testid="account-quote-requests-select-date-button">
							{{ t('account.quoteRequests.selectDate') }}
						</UiButton>
						<UiButton variant="outline" tone="neutral" size="md" data-testid="account-quote-requests-filters-button">
							{{ t('account.quoteRequests.filters') }}
						</UiButton>
					</div>
				</header>

				<div class="account-quote-layout" data-testid="account-quote-requests-layout">
					<aside class="account-quote-list" data-testid="account-quote-requests-list">
						<article
							v-for="(item, index) in requests"
							:key="item.id"
							class="account-quote-item"
							:class="{ active: index === 0 }"
							:data-testid="`account-quote-requests-item-${index}`"
						>
							<h3 class="account-quote-item-title">
								{{ t('account.quoteRequests.orderLabel') }} #{{ item.id }}
							</h3>
							<p class="account-quote-item-meta">
								{{ t('account.quoteRequests.quoteDate') }}: {{ item.date }}
							</p>
						</article>
					</aside>
					<section class="account-quote-chat" data-testid="account-quote-requests-chat">
						<header class="account-quote-chat-header" data-testid="account-quote-requests-chat-header">
							<h2 class="account-quote-chat-title">
								{{ t('account.quoteRequests.orderLabel') }} #{{ activeRequest?.id }}
							</h2>
							<span class="account-quote-chat-status">
								{{ t(`account.quoteRequests.status.${activeRequest?.statusKey || 'inReview'}`) }}
							</span>
						</header>
						<div class="account-quote-chat-messages" data-testid="account-quote-requests-messages">
							<div class="account-quote-chat-bubble" data-testid="account-quote-requests-bubble">
								{{ t('account.quoteRequests.sampleMessage') }}
								<div class="account-quote-chat-request">
									<span class="account-quote-chat-request-label">{{ t('account.quoteRequests.requestLabel') }}:</span>
									{{ t('account.quoteRequests.sampleRequestDetails') }}
								</div>
							</div>
						</div>
						<footer class="account-quote-chat-footer" data-testid="account-quote-requests-footer">
							<UiInput
								model-value=""
								type="text"
								class="account-quote-chat-input"
								:placeholder="t('account.quoteRequests.messagePlaceholder')"
								data-testid="account-quote-requests-input"
							/>
							<UiButton variant="filled" tone="neutral" size="md" class="account-quote-chat-send" data-testid="account-quote-requests-send-button">
								{{ t('account.quoteRequests.send') }}
							</UiButton>
						</footer>
					</section>
				</div>
			</div>
		</AccountShell>
	</section>
</template>

<style scoped lang="scss">
.account-page {
    background: var(--bg-page);
    min-height: calc(100vh - 176px);

    .account-content {
        padding-top: 40px;

        .account-quote-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 18px;

            .account-quote-title {

                font-size: var(--type-size-450);
                line-height: var(--type-line-450);
            }

            .account-quote-tools {
                display: flex;
                gap: 8px;
            }
        }

        .account-quote-layout {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 14px;

            .account-quote-list {
                display: grid;
                gap: 8px;
                align-content: start;

                .account-quote-item {
                    border: 1px solid var(--border-default);
                    border-radius: 10px;
                    padding: 12px;
                    background: var(--contrast-light);

                    &.active {
                        border-color: color-mix(in srgb, var(--brand-primary) 60%, var(--border-default));
                        background: color-mix(in srgb, var(--brand-primary) 12%, var(--contrast-light));
                    }

                    .account-quote-item-title {

                        font-size: var(--type-size-400);
                        line-height: var(--type-line-400);
                    }

                    .account-quote-item-meta {
                        margin: 8px 0 0;
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                        color: var(--text-secondary);
                    }
                }
            }

            .account-quote-chat {
                border: 1px solid var(--border-default);
                border-radius: 10px;
                background: var(--contrast-light);
                min-height: 460px;
                display: grid;
                grid-template-rows: auto 1fr auto;

                .account-quote-chat-header {
                    padding: 16px;
                    border-bottom: 1px solid var(--border-default);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;

                    .account-quote-chat-title {

                        font-size: var(--type-size-550);
                        line-height: var(--type-line-550);
                    }

                    .account-quote-chat-status {
                        height: 26px;
                        border-radius: 999px;
                        background: color-mix(in srgb, var(--brand-primary) 16%, var(--contrast-light));
                        color: var(--text-primary);
                        display: inline-flex;
                        align-items: center;
                        padding: 0 10px;
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                        font-weight: var(--font-weight-bold);
                    }
                }

                .account-quote-chat-messages {
                    padding: 16px;

                    .account-quote-chat-bubble {
                        max-width: 620px;
                        border-radius: 10px;
                        background: color-mix(in srgb, var(--brand-primary) 14%, var(--contrast-light));
                        padding: 12px;
                        color: var(--text-primary);
                        line-height: 1.5;

                        .account-quote-chat-request {
                            margin-top: 8px;
                            border: 1px solid color-mix(in srgb, var(--brand-primary) 58%, var(--border-default));
                            border-radius: 8px;
                            padding: 10px;
                            background: var(--contrast-light);

                            .account-quote-chat-request-label {
                                font-weight: var(--font-weight-bold);
                            }
                        }
                    }
                }

                .account-quote-chat-footer {
                    border-top: 1px solid var(--border-default);
                    padding: 12px;
                    display: flex;
                    gap: 10px;

                    .account-quote-chat-input {
                        flex: 1;
                    }

                    .account-quote-chat-send {
                        width: 84px;
                    }
                }
            }
        }
    }

    @media (max-width: 980px) {
        .account-content {
            .account-quote-layout {
                grid-template-columns: 1fr;
            }
        }
    }
}
</style>