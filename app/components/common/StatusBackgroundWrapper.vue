<script setup lang="ts">
withDefaults(
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
		:class="{ 'status-background-page--full': fullHeight }"
		:data-testid="testId"
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

    .status-background-shell {
        width: 100%;
        min-height: calc(100dvh - 252px);
    }

    .status-background-grid {
        width: 100%;
        min-height: inherit;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        background-color: var(--gold-base);
        background-image: url('/illustrations/under-construction/bg-page.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center bottom;
        padding: 24px;
    }
}

.status-background-page--full {
    height: 100dvh;
    min-height: 100dvh;
    padding: 40px;
    display: grid;
    place-items: center;
    overflow: hidden;

    .status-background-shell {
        width: 100%;
        min-height: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 56px;
    }

    .status-background-grid {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 0;
        border-radius: 18px;
        background-size: contain;
        display: flex;
        flex-direction: column;
        gap: 64px;
        align-items: center;
        justify-content: center;
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
            min-height: 100%;
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