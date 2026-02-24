<script setup lang="ts">
const props = defineProps<{
    open: boolean;
    hasUploadedArtwork: boolean;
    artworkPreviewUrl: string;
    cartArtworkName: string;
    cartArtworkExtension: string;
    cartArtworkSize: string;
    specialInstructions: string;
    addToCartLoading: boolean;
}>();

const emit = defineEmits<{
    close: [];
    'open-file-picker': [];
    'remove-artwork': [];
    'update:specialInstructions': [value: string];
    'skip-upload-later': [];
    'proceed-to-cart': [];
}>();

const { t } = useI18n();
</script>

<template>
    <Teleport to="body">
        <Transition name="upload-modal-fade">
            <div v-if="props.open" class="upload-modal-overlay" @click.self="emit('close')" data-testid="product-category-upload-overlay">
                <section class="upload-modal" role="dialog" aria-modal="true" data-testid="product-category-upload-dialog">
                    <header class="upload-modal-header" data-testid="product-category-upload-header">
                        <h3 class="upload-modal-title" data-testid="product-category-upload-title">{{ t('cart.uploadArtwork.title') }}</h3>
                        <UiButton
                            type="button"
                            variant="ghost"
                            tone="neutral"
                            size="sm"
                            icon-only
                            icon="strong-times"
                            icon-size="lg"
                            sr-label="Close upload modal"
                            class="upload-modal-close-btn"
                            @click="emit('close')"
                            data-testid="product-category-upload-close-button"
                        />
                    </header>

                    <div class="upload-modal-body" data-testid="product-category-upload-body">
                        <div class="upload-dropzone" data-testid="product-category-upload-dropzone">
                            <template v-if="!props.hasUploadedArtwork">
                                <div class="upload-dropzone-copy" data-testid="product-category-upload-empty-state">
                                    <UiIcon name="strong-cloud-upload" :size="20" color="#2a2f3d" />
                                    <div>
                                        <p class="upload-dropzone-title">
                                            {{ t('cart.uploadArtwork.dragDropTitle') }}
                                        </p>
                                        <p class="upload-dropzone-meta">
                                            {{ t('cart.uploadArtwork.acceptedTypes') }}
                                        </p>
                                    </div>
                                </div>
                                <UiButton
                                    type="button"
                                    variant="outline"
                                    tone="neutral"
                                    size="md"
                                    height="44px"
                                    class="upload-secondary-btn"
                                    @click="emit('open-file-picker')"
                                    data-testid="product-category-upload-select-files-button"
                                >
                                    {{ t('cart.uploadArtwork.selectFiles') }}
                                </UiButton>
                            </template>
                            <template v-else>
                                <div class="upload-dropzone-copy" data-testid="product-category-upload-file-state">
                                    <div class="upload-artwork-thumb">
                                        <img
                                            v-if="props.artworkPreviewUrl"
                                            :src="props.artworkPreviewUrl"
                                            :alt="props.cartArtworkName"
                                            class="upload-artwork-image"
                                        />
                                        <UiIcon v-else name="strong-file-image" :size="22" color="#2a2f3d" />
                                    </div>
                                    <div>
                                        <p class="upload-dropzone-title">{{ props.cartArtworkName }}</p>
                                        <p class="upload-dropzone-meta">
                                            .{{ props.cartArtworkExtension }} | {{ props.cartArtworkSize }}
                                        </p>
                                    </div>
                                </div>
                                <div class="upload-file-actions" data-testid="product-category-upload-file-actions">
                                    <UiButton
                                        type="button"
                                        variant="outline"
                                        tone="neutral"
                                        size="md"
                                        height="44px"
                                        class="upload-secondary-btn"
                                        @click="emit('open-file-picker')"
                                        data-testid="product-category-upload-replace-image-button"
                                    >
                                        {{ t('cart.uploadArtwork.replaceImage') }}
                                    </UiButton>
                                    <UiButton
                                        type="button"
                                        variant="outline"
                                        tone="neutral"
                                        size="md"
                                        icon-only
                                        icon="strong-trash"
                                        icon-size="md"
                                        sr-label="Remove uploaded artwork"
                                        width="44px"
                                        height="44px"
                                        class="upload-icon-btn"
                                        @click="emit('remove-artwork')"
                                        data-testid="product-category-upload-remove-image-button"
                                    />
                                </div>
                            </template>
                        </div>

                        <label class="upload-notes" data-testid="product-category-upload-notes">
                            <span>{{ t('cart.uploadArtwork.specialInstructions') }}</span>
                            <UiTextarea
                                class="upload-notes-textarea"
                                :model-value="props.specialInstructions"
                                rows="4"
                                resize="none"
                                :placeholder="t('cart.uploadArtwork.specialInstructionsPlaceholder')"
                                @update:model-value="emit('update:specialInstructions', $event)"
                                data-testid="product-category-upload-special-instructions"
                            />
                        </label>

                        <p class="upload-note" data-testid="product-category-upload-note">
                            {{ t('cart.uploadArtwork.note') }}
                        </p>
                    </div>

                    <footer class="upload-modal-footer" data-testid="product-category-upload-footer">
                        <UiButton
                            type="button"
                            variant="ghost"
                            tone="neutral"
                            class="upload-skip-btn"
                            :disabled="props.hasUploadedArtwork"
                            @click="emit('skip-upload-later')"
                            data-testid="product-category-upload-skip-button"
                        >
                            {{ t('cart.uploadArtwork.skipUploadLater') }}
                        </UiButton>
                        <UiButton
                            type="button"
                            variant="filled"
                            tone="neutral"
                            size="md"
                            height="44px"
                            class="upload-primary-btn"
                            :disabled="!props.hasUploadedArtwork || props.addToCartLoading"
                            @click="emit('proceed-to-cart')"
                            data-testid="product-category-upload-proceed-button"
                        >
                            <UiIcon
                                v-if="!props.addToCartLoading"
                                name="strong-shop-cart"
                                :size="18"
                                color="#ffffff"
                            />
                            {{
                                props.addToCartLoading
                                    ? `${t('cart.uploadArtwork.addToCart')}...`
                                    : t('cart.uploadArtwork.addToCart')
                            }}
                        </UiButton>
                    </footer>
                </section>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
.upload-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(18, 22, 34, 0.24);
    display: grid;
    place-items: center;
    padding: 24px;
    z-index: 220;

    .upload-modal {
        width: min(708px, 100%);
        background: #ffffff;
        border: 1px solid var(--gray-40);
        border-radius: 12px;
        box-shadow: 0 24px 50px rgba(13, 19, 31, 0.18);
        transition: transform 0.18s ease;

        .upload-modal-header {
            min-height: 68px;
            padding: 0 28px;
            border-bottom: 1px solid var(--gray-30);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .upload-modal-title {
            margin: 0;
            font-size: 28px;
            line-height: 1.15;
            color: var(--text-primary);
        }

        .upload-modal-close-btn {
            width: 32px;
            height: 32px;
            min-width: 32px;
            border-radius: 8px;
            --btn-soft: transparent;
        }

        .upload-modal-body {
            padding: 24px 28px 16px;
            display: grid;
            gap: 16px;

            .upload-dropzone {
                border: 1px dashed var(--gray-40);
                border-radius: 10px;
                min-height: 140px;
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
            }

            .upload-dropzone-copy {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .upload-artwork-thumb {
                width: 54px;
                height: 54px;
                border-radius: 10px;
                background: var(--gray-10);
                overflow: hidden;
                display: grid;
                place-items: center;

                .upload-artwork-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .upload-file-actions {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .upload-secondary-btn {
                border: 1px solid var(--gray-60);
                border-radius: 999px;
                background: #ffffff;
                padding: 0 20px;
                box-shadow: none;
            }

            .upload-icon-btn {
                width: 44px;
                height: 44px;
                border: 1px solid var(--gray-60);
                border-radius: 10px;
                background: #ffffff;
                display: grid;
                place-items: center;
                box-shadow: none;
                padding: 0;
            }

            .upload-notes {
                display: grid;
                gap: 8px;

                .upload-notes-textarea {
                    width: 100%;
                    min-height: 130px;
                }

                :deep(.upload-notes-textarea .ui-textarea-field) {
                    min-height: 130px;
                    padding: 14px 16px;
                }
            }
        }

        .upload-modal-footer {
            padding: 0 28px 24px;
            display: flex;
            justify-content: flex-end;
            gap: 14px;
        }

        .upload-skip-btn {
            border-radius: 0;
            padding: 0;
            min-height: auto;
            --btn-soft: transparent;

            &:disabled {
                opacity: 0.45;
            }
        }

        .upload-primary-btn {
            border-radius: 999px;
            gap: 8px;
            padding: 0 22px;

            &:disabled {
                background: var(--gray-40);
            }
        }
    }
}

.upload-modal-fade-enter-active,
.upload-modal-fade-leave-active {
    transition: opacity 0.18s ease;
}

.upload-modal-fade-enter-from,
.upload-modal-fade-leave-to {
    opacity: 0;

    .upload-modal {
        transform: translateY(10px);
    }
}
</style>
