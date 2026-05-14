<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';

const { t: translate } = useI18n();

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		modelValue?: boolean;
		title?: string;
		closeOnBackdrop?: boolean;
		closeOnEsc?: boolean;
		width?: string;
		padding?: string;
		gap?: string;
		align?: 'top' | 'center' | 'bottom';
		modalClass?: string;
		footerClass?: string;
		hideHeader?: boolean;
		maxHeight?: string;
		scrollable?: boolean;
	}>(),
	{
		modelValue: false,
		title: '',
		closeOnBackdrop: true,
		closeOnEsc: true,
		width: '504px',
		padding: '',
		gap: '',
		align: 'top',
		modalClass: '',
		footerClass: '',
		hideHeader: false,
		maxHeight: '',
		scrollable: false,
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'close'): void;
}>();
const attrs = useAttrs();

const modal_style = computed(() => ({
	'--ui-modal-width': props.width,
	'--ui-modal-padding': props.padding || null,
	'--ui-modal-gap': props.gap || null,
	'--ui-modal-max-height': props.maxHeight || null,
}));

function closeModal() {
	emit('update:modelValue', false);
	emit('close');
}

function onBackdropClick(event: MouseEvent) {
	if (!props.closeOnBackdrop) return;
	if (event.target !== event.currentTarget) return;
	closeModal();
}

function onKeydown(event: KeyboardEvent) {
	if (!props.closeOnEsc || !props.modelValue) return;
	if (event.key !== 'Escape') return;
	closeModal();
}

watch(
	() => props.modelValue,
	(isOpen) => {
		if (typeof document === 'undefined') return;
		document.body.classList.toggle('has-ui-modal-open', Boolean(isOpen));
	}
);

onMounted(() => {
	window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', onKeydown);
	if (typeof document !== 'undefined') {
		document.body.classList.remove('has-ui-modal-open');
	}
});
</script>

<template>
	<Teleport to="body">
		<Transition name="ui-modal-fade">
			<div
				v-if="modelValue"
				class="ui-modal-overlay"
				:class="{
					'ui-modal-overlay--top': align === 'top',
					'ui-modal-overlay--center': align === 'center',
					'ui-modal-overlay--bottom': align === 'bottom',
				}"
				role="presentation"
				@click="onBackdropClick"
			>
				<div
					:class="[
						'ui-modal',
						'auth-shell-enter',
						{ 'ui-modal--scrollable': scrollable },
						modalClass,
					]"
					role="dialog"
					aria-modal="true"
					:aria-label="title || 'Modal'"
					:style="modal_style"
					v-bind="attrs"
				>
					<slot name="overlay" />

					<header
						v-if="title || $slots.header || $slots.actions"
						class="ui-modal-header"
					>
						<div class="ui-modal-header-main">
							<slot name="header">
								<h3 v-if="title" class="ui-modal-title">
									{{ title }}
								</h3>
							</slot>
						</div>

						<div class="ui-modal-header-actions">
							<slot name="actions" />
							<UiButton
								type="button"
								variant="ghost"
								tone="neutral"
								size="24"
								class="ui-modal-close"
								:aria-label="translate('ui.modal.close')"
								@click="closeModal"
							>
								<UiIcon
									name="regular-times"
									:size="24"
									color="currentColor"
								/>
							</UiButton>
						</div>
					</header>

					<div class="ui-modal-body">
						<slot />
					</div>

					<footer
						v-if="$slots.footer"
						class="ui-modal-footer"
						:class="footerClass"
					>
						<slot name="footer" />
					</footer>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>