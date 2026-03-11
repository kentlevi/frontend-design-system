<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		testId?: string;
		fullHeight?: boolean;
	}>(),
	{
		testId: 'status-background-page',
		fullHeight: false,
	}
);
</script>

<template>
	<section
		class="status-background-page"
		:class="{ 'status-background-page--full': props.fullHeight }"
		:data-testid="props.testId"
	>
		<div class="status-background-shell">
			<div class="status-background-grid">
				<slot />
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.status-background-page {
    min-height: calc(100dvh - 176px);
    background: var(--gold-base);
    padding: 38px 36px;
    --status-shell-min-height: calc(100dvh - 252px);
    --status-grid-radius: 16px;
    --status-grid-bg-size: cover;
    --status-grid-gap: 0;
    --status-grid-alignment: stretch;

    .status-background-shell {
        width: 100%;
        min-height: var(--status-shell-min-height);
    }

    .status-background-grid {
        position: relative;
        width: 100%;
        min-height: inherit;
        border-radius: var(--status-grid-radius);
        border: 1px solid rgba(255, 255, 255, 0.4);
        background-color: var(--gold-base);
        background-image: url('/illustrations/under-construction/bg-page.png');
        background-repeat: no-repeat;
        background-size: var(--status-grid-bg-size);
        background-position: center bottom;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: var(--status-grid-gap);
        align-items: var(--status-grid-alignment);
        justify-content: var(--status-grid-alignment);
    }
}

.status-background-page--full {
    height: 100dvh;
    min-height: 100dvh;
    padding: 40px;
    display: grid;
    place-items: center;
    overflow: hidden;
    --status-shell-min-height: 100%;
    --status-grid-radius: 18px;
    --status-grid-bg-size: contain;
    --status-grid-gap: 64px;
    --status-grid-alignment: center;

    .status-background-shell {
        height: 100%;
        gap: 56px;
    }

    .status-background-grid {
        height: 100%;
        min-height: 0;
    }
}

@media (max-width: 900px) {
    .status-background-page,
    .status-background-page--full {
        padding: 16px;

        .status-background-shell {
            min-height: calc(100dvh - 208px);
        }

        .status-background-grid {
            min-height: inherit;
            padding: 18px;
        }
    }

    .status-background-page--full {
        .status-background-shell {
            gap: 14px;
        }

        .status-background-grid {
            height: min(58vh, 480px);
            border-radius: 14px;
            background-position: center top;
        }
    }
}
</style>