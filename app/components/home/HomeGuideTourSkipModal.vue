<script setup lang="ts">
import { split_home_guide_tour_skip_copy } from '~/helpers/home/homeGuideTour.helper';

const { t } = useI18n();

withDefaults(
	defineProps<{
		visible?: boolean;
	}>(),
	{
		visible: false,
	}
);

const emit = defineEmits<{
	(event: 'continue-tour'): void;
	(event: 'skip-for-now'): void;
}>();

const skipModalBodyParts = computed(() => {
	return split_home_guide_tour_skip_copy(t('home.tour.skipModal.body'));
});
</script>

<template>
	<UiModal
		:model-value="visible"
		:close-on-backdrop="false"
		:close-on-esc="false"
		align="center"
		width="660px"
		padding="0"
		gap="0"
		modal-class="home-guide-tour-skip-modal-shell"
	>
		<section class="home-guide-tour-skip-modal" data-testid="home-guide-tour-skip-modal">
			<div class="home-guide-tour-skip-modal-copy">
				<div class="home-guide-tour-skip-modal-icon-wrap">
					<img
						src="/home/guide-tour/icon-skip.svg"
						alt=""
						class="home-guide-tour-skip-modal-icon"
					>
				</div>
				<div class="home-guide-tour-skip-modal-text-wrap">
					<h3 class="home-guide-tour-skip-modal-title">
						{{ $t('home.tour.skipModal.title') }}
					</h3>
					<p class="home-guide-tour-skip-modal-text">
						<span>{{ skipModalBodyParts.before }}</span>
						<strong
							v-if="skipModalBodyParts.highlighted"
							class="home-guide-tour-skip-modal-highlight"
						>
							{{ skipModalBodyParts.highlighted }}
						</strong>
						<span>{{ skipModalBodyParts.after }}</span>
					</p>
				</div>
			</div>

			<footer class="home-guide-tour-skip-modal-actions">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					class="home-guide-tour-skip-modal-continue"
					data-testid="home-guide-tour-skip-modal-continue"
					@click="emit('continue-tour')"
				>
					{{ $t('home.tour.skipModal.continue') }}
				</UiButton>
				<UiButton
					variant="filled"
					tone="neutral"
					size="md"
					class="home-guide-tour-skip-modal-skip"
					data-testid="home-guide-tour-skip-modal-skip"
					@click="emit('skip-for-now')"
				>
					{{ $t('home.tour.skipModal.skipNow') }}
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
.home-guide-tour-skip-modal {
    background: var(--contrast-light);
    border-radius: 16px;
    overflow: hidden;

    .home-guide-tour-skip-modal-copy {
        padding: 24px;
        display: flex;
        align-items: flex-start;
        gap: 20px;

        .home-guide-tour-skip-modal-icon-wrap {
            width: 56px;
            height: 56px;
            flex-shrink: 0;
            display: grid;
            place-items: center;

            .home-guide-tour-skip-modal-icon {
                width: 48px;
                height: 48px;
                display: block;
                object-fit: contain;
            }
        }

        .home-guide-tour-skip-modal-text-wrap {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;

            .home-guide-tour-skip-modal-title {

                font-size: var(--type-size-300);
                line-height: var(--type-line-300);
                font-weight: var(--font-weight-bold);
                color: var(--text-primary);
            }

            .home-guide-tour-skip-modal-text {
                font-size: 12px;
                line-height: 20px;
                color: var(--text-secondary);
            }
        }
    }

    .home-guide-tour-skip-modal-highlight {
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
    }

    .home-guide-tour-skip-modal-actions {
        border-top: 1px solid var(--border-default);
        padding: 16px 24px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 22px;

        .home-guide-tour-skip-modal-continue {
            padding: 8px 16px;
            min-height: auto;
            color: var(--text-primary);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            font-weight: var(--font-weight-bold);
            box-shadow: none;
        }

        .home-guide-tour-skip-modal-skip {
            border-radius: 16px;
            box-shadow: none;
        }
    }

    @media (max-width: 860px) {
        .home-guide-tour-skip-modal-copy {
            padding: 24px 20px 18px;
            gap: 14px;

            .home-guide-tour-skip-modal-icon-wrap {
                width: 44px;
                height: 44px;

                .home-guide-tour-skip-modal-icon {
                    width: 36px;
                    height: 36px;
                }
            }
        }

        .home-guide-tour-skip-modal-actions {
            padding: 14px 16px;
            gap: 14px;

            .home-guide-tour-skip-modal-skip {
                min-width: 140px;
            }
        }
    }
}

:global(.home-guide-tour-skip-modal-shell) {
    border-radius: 16px;
    overflow: hidden;
    max-width: 504px;
}
</style>