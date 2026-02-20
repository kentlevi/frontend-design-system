<script setup lang="ts">
type SearchResultItem = {
    id: string;
    name: string;
    blurb: string;
    image: string;
};

type SearchResultGroup = {
    key: string;
    label: string;
    items: SearchResultItem[];
};

type RecentSearchEntry = {
    term: string;
    matchedItem: {
        name: string;
        blurb: string;
        image: string;
    } | null;
};

const props = defineProps<{
    open: boolean;
    searchQuery: string;
    searchLoading: boolean;
    showSearchRecent: boolean;
    showSearchNoRecent: boolean;
    showSearchNoResult: boolean;
    showSearchResults: boolean;
    recentSearchEntries: RecentSearchEntry[];
    activeSearchNavIndex: number;
    searchResultGroups: SearchResultGroup[];
    searchNavIndexByResultId: Record<string, number>;
    searchEmptySuggestedTerm: string;
    highlightSearchMatch: (value: string) => string;
    setModalRef: (el: HTMLElement | null) => void;
    setInputRef: (el: HTMLInputElement | null) => void;
}>();

const emit = defineEmits<{
    close: [];
    'update:searchQuery': [value: string];
    'focus-input': [];
    'clear-recent': [];
    'apply-recent': [term: string];
    'remove-recent': [term: string];
    'apply-suggested': [];
    'select-result': [item: SearchResultItem];
}>();

const { t } = useI18n();
</script>

<template>
    <Transition name="search-modal">
        <div v-if="props.open" class="home-search-overlay" data-testid="app-header-search-overlay">
            <section
                :ref="props.setModalRef"
                class="home-search-modal"
                role="dialog"
                aria-modal="true"
                :aria-label="t('layout.header.search.modal.title')"
                data-testid="app-header-search-dialog"
            >
                <div class="home-search-head" data-testid="app-header-search-head">
                    <div class="home-search-input-group" data-testid="app-header-search-input-group">
                        <button
                            type="button"
                            class="home-search-head-action"
                            :aria-label="t('layout.header.search')"
                            @click="emit('focus-input')"
                            data-testid="app-header-search-focus-button"
                        >
                            <UiIcon
                                name="strong-search"
                                :size="24"
                                color="var(--abyss-base)"
                                class="home-search-head-icon"
                            />
                        </button>
                        <input
                            :ref="props.setInputRef"
                            :value="props.searchQuery"
                            type="search"
                            :placeholder="t('layout.header.search.modal.placeholder')"
                            class="home-search-input"
                            autocomplete="off"
                            @input="
                                emit(
                                    'update:searchQuery',
                                    ($event.target as HTMLInputElement).value
                                )
                            "
                            data-testid="app-header-search-input"
                        />
                    </div>
                </div>

                <div class="home-search-body" data-testid="app-header-search-body">
                    <div v-if="props.searchLoading" class="home-search-skeleton" data-testid="app-header-search-loading">
                        <div
                            v-for="index in 3"
                            :key="index"
                            class="home-search-skeleton-item"
                            :data-testid="`app-header-search-loading-item-${index}`"
                        >
                            <div class="home-search-skeleton-thumb" />
                            <div class="home-search-skeleton-copy">
                                <div class="home-search-skeleton-title" />
                                <div class="home-search-skeleton-line" />
                            </div>
                        </div>
                    </div>

                    <div v-else-if="props.showSearchRecent" class="home-search-recent" data-testid="app-header-search-recent">
                        <div class="home-search-recent-head" data-testid="app-header-search-recent-head">
                            <h4 class="home-search-heading">{{ t('layout.header.search.modal.recent.title') }}</h4>
                            <UiButton
                                variant="ghost"
                                tone="default"
                                size="sm"
                                class="home-search-recent-clear"
                                @click="emit('clear-recent')"
                                data-testid="app-header-search-recent-clear-button"
                            >
                                {{ t('layout.header.search.modal.recent.clearAll') }}
                            </UiButton>
                        </div>
                        <ul class="home-search-recent-list" data-testid="app-header-search-recent-list">
                            <li
                                v-for="(entry, index) in props.recentSearchEntries"
                                :key="entry.term"
                                class="home-search-recent-item"
                                :class="{ 'is-active': props.activeSearchNavIndex === index }"
                                :data-testid="`app-header-search-recent-item-${index}`"
                            >
                                <button
                                    type="button"
                                    class="home-search-recent-term"
                                    :data-search-nav-index="index"
                                    @click="emit('apply-recent', entry.term)"
                                    :data-testid="`app-header-search-recent-apply-${index}-button`"
                                >
                                    <div class="home-search-recent-icon">
                                        <img
                                            v-if="entry.matchedItem"
                                            :src="entry.matchedItem.image"
                                            :alt="entry.matchedItem.name"
                                            loading="lazy" class="home-search-image" />
                                        <UiIcon
                                            v-else
                                            name="strong-search"
                                            :size="18"
                                            color="var(--text-primary)"
                                        />
                                    </div>
                                    <div class="home-search-recent-copy">
                                        <p class="home-search-recent-title">
                                            {{ entry.matchedItem?.name || entry.term }}
                                        </p>
                                        <p
                                            v-if="entry.matchedItem?.blurb"
                                            class="home-search-recent-blurb"
                                        >
                                            {{ entry.matchedItem.blurb }}
                                        </p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    class="home-search-recent-remove"
                                    :aria-label="t('layout.header.search.modal.recent.remove')"
                                    @click="emit('remove-recent', entry.term)"
                                    :data-testid="`app-header-search-recent-remove-${index}-button`"
                                >
                                    <UiIcon name="regular-times" :size="24" color="var(--gray-80)" />
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div v-else-if="props.showSearchNoRecent" class="home-search-empty" data-testid="app-header-search-empty-recent">
                        <div class="home-search-empty-icon home-search-empty-icon--no-recent">
                            <img
                                src="/icons/custom/search/no-recent-searches.svg"
                                :alt="t('layout.header.search.modal.noRecent.title')"
                                width="48"
                                height="48" class="home-search-image" />
                        </div>
                        <div class="home-search-empty-copy">
                            <h4 class="home-search-heading">{{ t('layout.header.search.modal.noRecent.title') }}</h4>
                            <p class="home-search-empty-text">
                                {{ t('layout.header.search.modal.noRecent.textPrefix') }}
                                <UiButton
                                    variant="ghost"
                                    tone="default"
                                    size="sm"
                                    class="home-search-suggest"
                                    @click="emit('apply-suggested')"
                                    data-testid="app-header-search-suggest-empty-recent-button"
                                >
                                    "{{ props.searchEmptySuggestedTerm }}"
                                </UiButton>
                            </p>
                        </div>
                    </div>

                    <div v-else-if="props.showSearchNoResult" class="home-search-empty" data-testid="app-header-search-empty-result">
                        <div class="home-search-empty-icon home-search-empty-icon--no-recent">
                            <img
                                src="/icons/custom/search/no-recent-searches.svg"
                                :alt="t('layout.header.search.modal.noResult.title')"
                                width="48"
                                height="48" class="home-search-image" />
                        </div>
                        <div class="home-search-empty-copy">
                            <h4 class="home-search-heading">{{ t('layout.header.search.modal.noResult.title') }}</h4>
                            <p class="home-search-empty-text">
                                {{ t('layout.header.search.modal.noResult.textPrefix') }}
                                <UiButton
                                    variant="ghost"
                                    tone="default"
                                    size="sm"
                                    class="home-search-suggest"
                                    @click="emit('apply-suggested')"
                                    data-testid="app-header-search-suggest-empty-result-button"
                                >
                                    "{{ props.searchEmptySuggestedTerm }}"
                                </UiButton>
                            </p>
                        </div>
                    </div>

                    <div v-else-if="props.showSearchResults" class="home-search-results" data-testid="app-header-search-results">
                        <section
                            v-for="group in props.searchResultGroups"
                            :key="group.key"
                            class="home-search-group"
                            :data-testid="`app-header-search-group-${group.key}`"
                        >
                            <h4 class="home-search-heading">{{ group.label }}</h4>
                            <button
                                v-for="item in group.items"
                                :key="item.id"
                                type="button"
                                class="home-search-result-item"
                                :class="{
                                    'is-active':
                                        props.activeSearchNavIndex ===
                                        props.searchNavIndexByResultId[item.id],
                                }"
                                :data-search-nav-index="props.searchNavIndexByResultId[item.id]"
                                @click="emit('select-result', item)"
                                :data-testid="`app-header-search-result-${item.id}-button`"
                            >
                                <div class="home-search-result-icon">
                                    <img :src="item.image" :alt="item.name" loading="lazy" class="home-search-image" />
                                </div>
                                <div class="home-search-result-copy">
                                    <p
                                        class="home-search-result-title"
                                        v-html="props.highlightSearchMatch(item.name)"
                                    />
                                    <p
                                        class="home-search-result-blurb"
                                        v-html="props.highlightSearchMatch(item.blurb)"
                                    />
                                </div>
                            </button>
                        </section>
                    </div>
                </div>

                <footer class="home-search-footer" data-testid="app-header-search-footer">
                    <div class="home-search-foot-actions" data-testid="app-header-search-footer-actions">
                        <div class="home-search-foot-hint" data-testid="app-header-search-footer-navigate">
                            <span class="home-search-key">
                                <UiIcon
                                    name="light-long-arrow-up"
                                    :size="20"
                                    color="var(--text-muted)"
                                />
                            </span>
                            <span class="home-search-key">
                                <UiIcon
                                    name="light-long-arrow-down"
                                    :size="20"
                                    color="var(--text-muted)"
                                />
                            </span>
                            <span class="home-search-foot-label">{{ t('layout.header.search.modal.footer.navigate') }}</span>
                        </div>
                        <div class="home-search-foot-hint" data-testid="app-header-search-footer-select">
                            <span class="home-search-key">
                                <UiIcon
                                    name="light-arrow-level-left"
                                    :size="20"
                                    color="var(--text-muted)"
                                />
                            </span>
                            <span class="home-search-foot-label">{{ t('layout.header.search.modal.footer.select') }}</span>
                        </div>
                    </div>
                    <div class="home-search-foot-hint" data-testid="app-header-search-footer-close-wrap">
                        <span class="home-search-key home-search-key-esc">esc</span>
                        <UiButton
                            variant="ghost"
                            tone="default"
                            size="sm"
                            class="home-search-close-text"
                            @click="emit('close')"
                            data-testid="app-header-search-close-button"
                        >
                            {{ t('layout.header.search.modal.footer.close') }}
                        </UiButton>
                    </div>
                </footer>
            </section>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.home-search-overlay {
    position: fixed;
    inset: 0;
    background: var(--overlay-soft);
    display: grid;
    place-items: start center;
    padding: 146px 24px 24px;
    z-index: 140;
    .home-search-modal {
        width: 600px;
        background: var(--contrast-light);
        border: 1px solid var(--border-default);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 30px 60px rgba(7, 14, 26, 0.18);

        .home-search-head {
            height: 56px;
            padding: 0 22px;
            border-bottom: 1px solid var(--border-default);
            display: flex;
            align-items: center;

            .home-search-input-group {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 0;
                height: 40px;
            }

            .home-search-head-icon {
                flex-shrink: 0;
            }

            .home-search-head-action {
                border: 0;
                background: transparent;
                width: 40px;
                height: 40px;
                padding: 0;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                flex-shrink: 0;
            }

            .home-search-input {
                border: 0;
                outline: none;
                flex: 1;
                min-width: 0;
                font-size: 14px;
                line-height: 24px;
                color: var(--abyss-base);
                background: transparent;

                &::placeholder {
                    color: var(--gray-60);
                }

                &::-webkit-search-cancel-button {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    background: center / 16px 16px no-repeat
                        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231f2433' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 6 6 18'/%3E%3Cpath d='m6 6 12 12'/%3E%3C/svg%3E");
                }

                &::-webkit-search-decoration,
                &::-webkit-search-results-button,
                &::-webkit-search-results-decoration {
                    -webkit-appearance: none;
                    appearance: none;
                    display: none;
                }
            }
        }

        .home-search-body {
            max-height: 537px;
            min-height: 156px;
            overflow: auto;

        .home-search-skeleton {
            display: grid;
            gap: 12px;
            padding: 20px;
        }

        .home-search-skeleton-item {
            min-height: 128px;
            border-radius: 12px;
            background: var(--gray-10);
            padding: 20px 24px;
            display: grid;
            grid-template-columns: 100px 1fr;
            align-items: center;
            gap: 20px;
        }

        .home-search-skeleton-thumb,
        .home-search-skeleton-title,
        .home-search-skeleton-line {
            border-radius: 8px;
            background: linear-gradient(90deg, var(--gray-20) 25%, var(--gray-30) 37%, var(--gray-40) 63%);
            background-size: 300% 100%;
            animation: home-search-skeleton 1.1s linear infinite;
        }

        .home-search-skeleton-thumb {
            width: 100px;
            height: 100px;
        }

        .home-search-skeleton-copy {
            min-width: 0;
            display: grid;
            gap: 18px;
        }

        .home-search-skeleton-title {
            width: min(44%, 320px);
            height: 50px;
        }

        .home-search-skeleton-line {
            width: 100%;
            height: 34px;
        }

        .home-search-recent {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;

            .home-search-recent-head {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .home-search-heading {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 24px;
                    color: var(--gray-80);
                }
            }

            .home-search-recent-clear {
                --btn-bg: var(--abyss-base);
                --btn-soft: transparent;
                --btn-border: transparent;

                border: 0;
                background: transparent;
                padding: 0;
                min-height: auto;
                height: auto;
                font-size: 14px;
                line-height: 24px;
                color: var(--abyss-base);
                text-decoration: underline;
                cursor: pointer;
                box-shadow: none;
            }

            .home-search-recent-list {
                margin: 0;
                padding: 0;
                list-style: none;
                display: grid;
                gap: 8px;
            }

            .home-search-recent-item {
                border-radius: 10px;
                background: var(--gray-10);
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto;
                align-items: center;
                height: 80px;
                overflow: hidden;
                transition: background-color 0.18s ease;
                padding: 12px 16px;
                gap: 16px;

                &:hover,
                &.is-active {
                    background: var(--gray-30);
                }
            }

            .home-search-recent-term {
                border: 0;
                background: transparent;
                text-align: left;
                color: var(--text-primary);
                font-size: 15px;
                cursor: pointer;
                display: grid;
                grid-template-columns: 52px 1fr;
                align-items: center;
                gap: 12px;
                min-width: 0;
            }

            .home-search-recent-icon {
                height: 56px;
                width: 56px;
                border-radius: 8px;
                display: grid;
                place-items: center;

                .home-search-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }

            .home-search-recent-copy {
                min-width: 0;
            }

            .home-search-recent-title {
                margin: 0;
                font-size: 16px;
                line-height: 28px;
                font-weight: 500;
                color: var(--abyss-base);
            }

            .home-search-recent-blurb {
                margin: 0;
                font-size: 14px;
                line-height: 24px;
                color: var(--gray-80);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .home-search-recent-remove {
                border: 0;
                width: 40px;
                height: 40px;
                display: grid;
                place-items: center;
                cursor: pointer;
            }
        }

        .home-search-empty {
            display: grid;
            grid-template-columns: auto 1fr;
            align-content: center;
            align-items: center;
            justify-content: center;
            gap: 40px;
            padding: 40px 80px;

            .home-search-empty-icon {
                width: 44px;
                height: 44px;
                border-radius: 12px;
                background: var(--surface-subtle);
                display: grid;
                place-items: center;
            }

            .home-search-empty-icon--no-recent {
                width: 48px;
                height: 48px;
                border-radius: 0;
                background: transparent;
            }

            .home-search-empty-copy {
                .home-search-heading {
                    font-size: 16px;
                    line-height: 28px;
                    color: var(--abyss-base);
                }

                .home-search-empty-text {
                    font-size: 14px;
                    line-height: 24px;
                    color: var(--gray-80);
                }
            }

            .home-search-suggest {
                --btn-bg: var(--abyss-base);
                --btn-soft: transparent;
                --btn-border: transparent;

                border: 0;
                padding: 0;
                margin: 0;
                min-height: auto;
                height: auto;
                background: transparent;
                color: var(--abyss-base);
                font: inherit;
                font-weight: 600;
                text-decoration: underline;
                cursor: pointer;
                box-shadow: none;
            }
        }

        .home-search-results {
            display: grid;
            gap: 18px;
            padding: 20px;

            .home-search-group {
                display: grid;
                gap: 10px;

                .home-search-heading {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 28px;
                    color: var(--gray-80);
                    padding: 0 2px;
                }
            }

            .home-search-result-item {
                border: 0;
                border-radius: 12px;
                background: var(--gray-10);
                width: 100%;
                padding: 12px 16px;
                display: grid;
                grid-template-columns: 68px 1fr;
                align-items: center;
                gap: 14px;
                text-align: left;
                cursor: pointer;
                transition: background-color 0.18s ease;

                &:hover,
                &.is-active {
                    background: var(--gray-30);
                }
            }

            .home-search-result-icon {
                width: 64px;
                height: 52px;
                display: grid;
                place-items: center;

                .home-search-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }

            .home-search-result-copy {
                display: grid;
            }

            .home-search-result-title {
                margin: 0;
                font-size: 16px;
                line-height: 28px;
                color: var(--text-primary);

                :deep(mark) {
                    background: transparent;
                    color: var(--gold-70);
                    font-weight: 700;
                    text-decoration: underline;
                    text-decoration-thickness: 1.5px;
                    text-underline-offset: 1px;
                }
            }

            .home-search-result-blurb {
                margin: 0;
                font-size: 14px;
                line-height: 24px;
                color: var(--text-secondary);

                :deep(mark) {
                    background: transparent;
                    color: var(--gold-70);
                    font-weight: 700;
                    text-decoration: underline;
                    text-decoration-thickness: 1.5px;
                    text-underline-offset: 1px;
                }
            }
        }
    }

        .home-search-footer {
            height: 56px;
            border-top: 1px solid var(--gray-30);
            background: var(--contrast-light);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 18px;

        .home-search-foot-actions {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .home-search-foot-hint {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-muted);
            font-size: 14px;
            line-height: 24px;
            padding: 4px 0;
        }

        .home-search-key {
            min-width: 32px;
            padding: 6px;
            border-radius: 7px;
            border: 1px solid var(--gray-30);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-70);
            font-size: 14px;
            text-transform: lowercase;
        }

        .home-search-key-esc {
            height: 24px;
            padding-top: 0;
            padding-bottom: 0;
            font-size: 12px;
            font-weight: 600;
            line-height: 20;
            border: 1px solid var(--gray-50);
        }

        .home-search-close-text {
            --btn-bg: var(--gray-80);
            --btn-soft: transparent;
            --btn-border: transparent;

            border: 0;
            background: transparent;
            padding: 0;
            min-height: auto;
            height: auto;
            color: var(--gray-80);
            font-size: 14px;
            line-height: 24px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: none;
        }
        }
    }
}

.search-modal-enter-active,
.search-modal-leave-active {
    transition: opacity 0.18s ease;
}

.search-modal-enter-from,
.search-modal-leave-to {
    opacity: 0;
}

@keyframes home-search-skeleton {
    from {
        background-position: 100% 0;
    }

    to {
        background-position: 0 0;
    }
}

@media (max-width: 980px) {
    .home-search-overlay {
        padding-top: 112px;

        .home-search-modal {
            .home-search-head {
                .home-search-input {
                    font-size: 18px;
                }
            }

            .home-search-body {
                .home-search-empty {
                    .home-search-empty-copy {
                        .home-search-heading {
                            font-size: 24px;
                        }

                        .home-search-empty-text {
                            font-size: 14px;
                        }
                    }
                }

                .home-search-recent {
                    .home-search-recent-head {
                        .home-search-heading {
                            font-size: 16px;
                        }
                    }

                    .home-search-recent-term {
                        font-size: 14px;
                    }
                }

                .home-search-results {
                    .home-search-group .home-search-heading {
                        font-size: 16px;
                    }

                    .home-search-result-title {
                        font-size: 18px;
                    }

                    .home-search-result-blurb {
                        font-size: 14px;
                    }
                }
            }

            .home-search-footer {
                .home-search-foot-hint {
                    font-size: 13px;
                }
            }
        }
    }
}
</style>
