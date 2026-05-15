<script setup lang="ts">
import { computed } from 'vue'
import MuText from './MuText.vue'
import { parseMuTooltipPlacement } from '~/composables/ui/useMuTooltip'

const {
	visible,
	text,
	x,
	y,
	placement,
	icon_left,
	icon_right,
} = useMuTooltip()

const resolveMuColor = (value?: string) => {
	if (!value) return undefined
	const v = value.trim()
	if (!v) return undefined
	if (
		v.startsWith('var(')
		|| v.startsWith('#')
		|| v.startsWith('rgb(')
		|| v.startsWith('rgba(')
		|| v.startsWith('hsl(')
		|| v.startsWith('hsla(')
	) {
		return v
	}
	if (v.startsWith('--')) return `var(${v})`
	return `var(--${v})`
}

const icon_left_color = computed(() => resolveMuColor(icon_left.value?.color))
const icon_right_color = computed(() => resolveMuColor(icon_right.value?.color))

const tooltip_style = computed(() => {
	const base = {
		left: `${x.value}px`,
		top: `${y.value}px`,
	}

	const { side, align } = parseMuTooltipPlacement(placement.value)
	const is_horizontal = side === 'left' || side === 'right'

	let tx: string
	let ty: string

	if (is_horizontal) {
		tx = side === 'left' ? 'calc(-100% - 4px)' : '4px'
		switch (align) {
			case 'start':
				ty = '0%'
				break
			case 'end':
				ty = '-100%'
				break
			default:
				ty = '-50%'
		}
	} else {
		ty = side === 'top' ? 'calc(-100% - 10px)' : '10px'
		switch (align) {
			case 'start':
				tx = '0%'
				break
			case 'end':
				tx = '-100%'
				break
			default:
				tx = '-50%'
		}
	}

	return {
		...base,
		transform: `translate(${tx}, ${ty})`,
	}
})
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="visible"
				class="mu-tooltip"
				:style="tooltip_style"
			>
				<UiIcon
					v-if="icon_left"
					:name="icon_left.name"
					:size="icon_left.size ?? 16"
					:color="icon_left_color"
				/>

				<MuText color="white-base" size="medium">
					<slot>
						{{ text }}
					</slot>
				</MuText>

				<UiIcon
					v-if="icon_right"
					:name="icon_right.name"
					:size="icon_right.size ?? 16"
					:color="icon_right_color"
				/>

			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.mu-tooltip {
	position: fixed;
	z-index: 99999;
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 4px 12px;
	background: #252E35;
	border-radius: 16px;
	pointer-events: none;
	white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
	transition: .15s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
