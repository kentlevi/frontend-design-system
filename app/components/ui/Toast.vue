<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
});

withDefaults(
	defineProps<{
		visible?: boolean;
		title?: string | null;
		message?: string | null;
		tone?: 'primary' | 'success' | 'warning' | 'error' | 'info';
		dismissible?: boolean;
		variant?: 'default' | 'outlined';
	}>(),
	{
		visible: false,
		title: '',
		message: '',
		tone: 'primary',
		dismissible: true,
		variant: 'default',
	}
);

const emit = defineEmits<{
	(event: 'close'): void;
}>();

const attrs = useAttrs();

const iconByTone = {
	primary: 'strong-check-circle',
	success: 'strong-check-circle',
	warning: 'strong-exclamation-triangle',
	error: 'strong-times-circle',
	info: 'strong-info-circle',
} as const;
</script>

<template>
	<Teleport to="body">
		<Transition name="ui-toast">
			<div
				v-if="visible"
				class="ui-toast"
				v-bind="attrs"
				:data-tone="tone"
				:data-variant="variant"
				role="status"
				aria-live="polite"
				data-testid="ui-toast"
			>
				<div class="ui-toast-main">
					<UiIcon :name="iconByTone[tone]" :size="24" />
					<span class="ui-toast-text">
						<slot>
							<template v-if="title">
								<strong>{{ title }}</strong>
								<span v-if="message"> - {{ message }}</span>
							</template>
							<template v-else>
								{{ message }}
							</template>
						</slot>
					</span>
				</div>
				<UiButton
					v-if="dismissible"
					type="button"
					variant="ghost"
					tone="neutral"
					size="24"
					:no-hover="true"
					:style="tone === 'error' ? { '--btn-bg': 'var(--white-base)' } : undefined"
					class="ui-toast-close"
					aria-label="Close"
					data-testid="ui-toast-close-button"
					@click="emit('close')"
				>
					<UiIcon name="regular-times" :size="24" />
				</UiButton>
			</div>
		</Transition>
	</Teleport>
</template>