<template>
	<div :class="['mu-switch', { 'mu-switch--checked': model }, `mu-switch--variant-${props.variant}`]">
		<label class="mu-switch-label">
			<slot v-if="props.variant !== 'label-inside'" name="before" />
			<input
				type="checkbox"
				class="mu-switch-input"
				:checked="model"
				hidden
				@change="onChangeHandler"
			>
			<div class="mu-switch-slider">
				<MuLinearWrapper
					v-if="props.variant === 'label-inside'"
					class="mu-switch-slider-text"
					align="center"
					justify="flex-start"
				>
					<slot>
						<div class="inactive-text">
							<slot name="inactive-text" />
						</div>
						<div class="active-text">
							<slot name="active-text" />
						</div>
					</slot>
				</MuLinearWrapper>
			</div>
			<slot v-if="props.variant !== 'label-inside'" name="after">
				<slot />
			</slot>
		</label>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';

interface Props {
	modelValue?: boolean;
	variant?: 'label-inside' | 'default';
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: false,
	variant: 'default',
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

const model = computed(() => props.modelValue ?? false);

function onChangeHandler(event: Event) {
	const target = event.target as HTMLInputElement;
	emit('update:modelValue', target.checked);
}
</script>

<style scoped lang="scss">
.mu-switch {
	display: inline-flex;
	align-items: center;
	cursor: pointer;

	.mu-switch-label {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;

		.mu-switch-slider {
			min-width: 36px;
			height: 20px;
			background-color: var(--gray-60);
			border-radius: 100px;
			position: relative;
			transition: background-color 0.2s;

			.active-text {
				display: none;
			}
		}

		.mu-switch-slider::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 2px;
			width: 16px;
			height: 16px;
			background: var(--white-base);
			border-radius: 50%;
			transition: left 0.2s;
			transform: translateY(-50%);
		}
	}

	&.mu-switch--checked .mu-switch-slider {
		background-color: var(--abyss-base);
	}

	&.mu-switch--checked .mu-switch-slider::after {
		left: calc(100% - 18px);
	}

	&.mu-switch--variant-label-inside {
		.mu-switch-label {
			.mu-switch-slider {
				min-height: 36px;
				min-width: 108px;

				&::after {
					left: 8px;
					width: 20px;
					height: 20px;
				}

				.mu-switch-slider-text {
					padding: 0 12px 0 36px;
					height: 100%;
				}
			}
		}

		&.mu-switch--checked .mu-switch-slider {
			&::after {
				left: calc(100% - 28px);
			}

			.mu-switch-slider-text {
				padding: 0 36px 0 12px;
				height: 100%;
				color: var(--white-base);
				justify-content: flex-end !important;

				.active-text {
					display: block;
				}

				.inactive-text {
					display: none;
				}
			}
		}
	}
}
</style>
