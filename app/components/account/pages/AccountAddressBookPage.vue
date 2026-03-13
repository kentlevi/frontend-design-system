<script setup lang="ts">
import { useAccountAddressBook } from '~/composables/account/addressBook/useAccountAddressBook';

const { t } = useI18n();
const { itemsBySection } = useAccountAddressBook();

const tagBadgeColors = {
	home: {
		bgColor: 'var(--aloha-10)',
		textColor: 'var(--aloha-60)',
	},
	office: {
		bgColor: 'var(--neon-blue-10)',
		textColor: 'var(--neon-blue-60)',
	},
	client: {
		bgColor: 'var(--azure-10)',
		textColor: 'var(--azure-60)',
	},
} as const;

const primarySections = computed(() => itemsBySection.value.filter((group) => group.section !== 'dropShipping'));
const dropShippingSections = computed(() => itemsBySection.value.filter((group) => group.section === 'dropShipping'));
</script>

<template>
	<section class="account-page" data-testid="account-address-book-page">
		<AccountShell active-tab="address-book">
			<div class="account-content" data-testid="account-address-book-content">
				<header class="account-address-book-header" data-testid="account-address-book-header">
					<h1 class="account-address-book-title" data-testid="account-address-book-title">
						{{ t('account.addressBook.title') }}
					</h1>
					<UiButton
						variant="filled"
						tone="neutral"
						size="md"
						icon="regular-plus"
						icon-position="left"
						data-testid="account-address-book-add-button"
					>
						{{ t('account.addressBook.addNew') }}
					</UiButton>
				</header>

				<div class="account-address-book-sections" data-testid="account-address-book-sections">
					<div class="account-address-book-primary-group">
						<section
							v-for="group in primarySections"
							:key="group.section"
							class="account-address-book-layout"
							:data-testid="`account-address-book-section-${group.section}`"
						>
							<div class="account-address-book-info" data-testid="account-address-book-info">
								<h2 class="account-address-book-subtitle">
									{{ t(`account.addressBook.${group.section}Title`) }}
								</h2>
								<p class="account-address-book-description">
									{{ t(`account.addressBook.${group.section}Description`) }}
								</p>
							</div>

							<div class="account-address-book-list" data-testid="account-address-book-list">
								<article
									v-for="(item, index) in group.items"
									:key="`${group.section}-${item.name}-${index}`"
									class="account-address-book-card"
									:data-testid="`account-address-book-item-${group.section}-${index}`"
								>
									<header class="account-address-book-card-header">
										<div class="account-address-book-card-title-row">
											<h3 class="account-address-book-card-name">{{ item.name }}</h3>
											<UiBadge
												v-if="item.isDefault"
												variant="outline"
												tone="default"
												size="md"
											>
												{{ t('account.addressBook.default') }}
											</UiBadge>
										</div>
										<UiButton
											variant="ghost"
											tone="neutral"
											height="40px"
											width="40px"
											:no-hover="true"
											class="account-address-book-menu-button"
											:data-testid="`account-address-book-item-menu-${group.section}-${index}-button`"
										>
											<UiIcon name="regular-ellipsis-horizontal" :size="24" />
										</UiButton>
									</header>
									<div class="account-address-book-card-body">
										<div class="account-address-book-card-footer">
											<div class="account-address-book-card-copy">
												<p v-if="item.phone" class="account-address-book-card-phone">
													{{ item.phone }}
												</p>
												<p class="account-address-book-card-address">{{ item.address }}</p>
												<span class="account-address-book-card-company">{{ item.company }}</span>
											</div>
											<UiBadge
												variant="tonal"
												tone="default"
												size="md"
												:bg-color="tagBadgeColors[item.tag.toLowerCase() as keyof typeof tagBadgeColors].bgColor"
												:text-color="tagBadgeColors[item.tag.toLowerCase() as keyof typeof tagBadgeColors].textColor"
											>
												{{ t(`account.addressBook.tags.${item.tag}`) }}
											</UiBadge>
										</div>
									</div>
								</article>
							</div>
						</section>
					</div>

					<div class="account-address-book-drop-group">
						<section
							v-for="group in dropShippingSections"
							:key="group.section"
							class="account-address-book-layout"
							:data-testid="`account-address-book-section-${group.section}`"
						>
							<div class="account-address-book-info" data-testid="account-address-book-info">
								<h2 class="account-address-book-subtitle">
									{{ t(`account.addressBook.${group.section}Title`) }}
								</h2>
								<p class="account-address-book-description">
									{{ t(`account.addressBook.${group.section}Description`) }}
								</p>
							</div>

							<div class="account-address-book-list" data-testid="account-address-book-list">
								<article
									v-for="(item, index) in group.items"
									:key="`${group.section}-${item.name}-${index}`"
									class="account-address-book-card"
									:data-testid="`account-address-book-item-${group.section}-${index}`"
								>
									<header class="account-address-book-card-header">
										<div class="account-address-book-card-title-row">
											<h3 class="account-address-book-card-name">{{ item.name }}</h3>
											<UiBadge
												v-if="item.isDefault"
												variant="outline"
												tone="default"
												size="md"
											>
												{{ t('account.addressBook.default') }}
											</UiBadge>
										</div>
										<UiButton
											variant="ghost"
											tone="neutral"
											height="40px"
											width="40px"
											:no-hover="true"
											class="account-address-book-menu-button"
											:data-testid="`account-address-book-item-menu-${group.section}-${index}-button`"
										>
											<UiIcon name="regular-ellipsis-horizontal" :size="24" />
										</UiButton>
									</header>
									<div class="account-address-book-card-body">
										<div class="account-address-book-card-footer">
											<div class="account-address-book-card-copy">
												<p v-if="item.phone" class="account-address-book-card-phone">
													{{ item.phone }}
												</p>
												<p class="account-address-book-card-address">{{ item.address }}</p>
												<span class="account-address-book-card-company">{{ item.company }}</span>
											</div>
											<UiBadge
												variant="tonal"
												tone="default"
												size="md"
												:bg-color="tagBadgeColors[item.tag.toLowerCase() as keyof typeof tagBadgeColors].bgColor"
												:text-color="tagBadgeColors[item.tag.toLowerCase() as keyof typeof tagBadgeColors].textColor"
											>
												{{ t(`account.addressBook.tags.${item.tag}`) }}
											</UiBadge>
										</div>
									</div>
								</article>
							</div>
						</section>
					</div>
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
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .account-address-book-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .account-address-book-title {
            font-size: var(--type-size-450);
            font-weight: var(--font-weight-bold);
            line-height: var(--type-line-450);

            color: var(--text-primary);
        }
    }

    .account-address-book-sections {
        display: flex;
        flex-direction: column;
        gap: 56px;
    }

    .account-address-book-primary-group {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    .account-address-book-layout {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 126px;
    }
    .account-address-book-info {
        .account-address-book-subtitle {
            font-size: var(--type-size-300);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-300);
        }

        .account-address-book-description {
            font-size: var(--type-size-100);
            font-weight: var(--font-weight-regular);
            line-height: var(--type-line-100);
            color: var(--text-secondary);

        }
    }


    .account-address-book-list {
        display: grid;
        gap: 16px;
    }

    .account-address-book-card {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        overflow: hidden;
        transition: border-color 0.18s ease, box-shadow 0.18s ease;

        .account-address-book-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 24px;
            border-bottom: 1px solid var(--border-subtle, var(--border-default));
        }

        .account-address-book-card-title-row {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
        }

        .account-address-book-card-name {

            font-size: var(--type-size-200);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-200);
        }

        .account-address-book-menu-button {
            color: var(--text-primary);
            flex-shrink: 0;
            padding: 0;
        }

        .account-address-book-card-phone {
            color: var(--text-primary);
            font-size: var(--type-size-100);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-100);
        }

        .account-address-book-card-address {

            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--text-secondary);
        }

        .account-address-book-card-body {
            padding: 20px 24px;
        }

        .account-address-book-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
        }

        .account-address-book-card-company {
            color: var(--text-secondary);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
        }

        &:hover {
            border-color: color-mix(in srgb, var(--brand-primary) 26%, var(--border-default));
            box-shadow: var(--shadow-sm);
        }
    }

    @media (max-width: 980px) {
        .account-address-book-header {
            align-items: flex-start;
            flex-direction: column;
        }

        .account-address-book-layout {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .account-address-book-card {
            .account-address-book-card-header,
            .account-address-book-card-body {
                padding-left: 16px;
                padding-right: 16px;
            }
        }
    }

    @media (max-width: 640px) {
        .account-address-book-card {
            .account-address-book-card-title-row,
            .account-address-book-card-footer {
                align-items: flex-start;
                flex-direction: column;
            }
        }
    }
}
</style>