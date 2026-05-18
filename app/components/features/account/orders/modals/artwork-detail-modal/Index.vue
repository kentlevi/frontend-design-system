<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import { useArtworkDetailModal } from '~/composables/features/account/orders/useArtworkDetailModal';
import Header from './Header.vue';
import Content from './content/Index.vue';
import Footer from './Footer.vue';

const { is_open, close_modal, is_dark_background } = useArtworkDetailModal();

const BODY_LOCK_CLASS = 'has-artwork-detail-modal-open';

watch(is_open, (open) => {
	if (typeof document === 'undefined') return;
	document.body.classList.toggle(BODY_LOCK_CLASS, open);
});

function onKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape' && is_open.value) close_modal();
}

onMounted(() => {
	if (!import.meta.client) return;
	window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
	if (typeof document !== 'undefined') {
		document.body.classList.remove(BODY_LOCK_CLASS);
	}
	if (!import.meta.client) return;
	window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
	<Teleport to="body">
		<Transition name="artwork-detail-fade">
			<MuLinearWrapper
				v-if="is_open"
				direction="column"
				class="artwork-detail-modal"
				:class="{ 'is-dark': is_dark_background }"
				role="dialog"
				aria-modal="true"
				aria-label="Sample Modal"
			>
				<Header />

				<main class="artwork-detail-modal__body">
					<Content />
				</main>

				<Footer />
			</MuLinearWrapper>
		</Transition>
	</Teleport>
</template>

<style lang="scss">
body.has-artwork-detail-modal-open {
	overflow: hidden;
}
</style>

<style scoped lang="scss">
.artwork-detail-modal {
	position: fixed;
	inset: 0;
	z-index: 1000;
	background: var(--bg-surface);
	overflow: hidden;
	transition: background 200ms ease;

	&.is-dark {
		--bg-surface: var(--abyss-base);
		--bg-muted: var(--abyss-70);
		--text-primary: var(--abyss-10);
		--text-secondary: var(--abyss-20);
		--text-muted: var(--abyss-30);
		--border-default: var(--abyss-60);
		--gray-10: var(--abyss-70);
		--gray-20: var(--abyss-60);
		--gray-30: var(--abyss-50);
	}

	&__body {
		flex: 1;
		min-height: 0;
		display: flex;
	}
}

.artwork-detail-fade-enter-active,
.artwork-detail-fade-leave-active {
	transition: opacity 180ms ease;
}

.artwork-detail-fade-enter-from,
.artwork-detail-fade-leave-to {
	opacity: 0;
}
</style>