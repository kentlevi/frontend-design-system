<script setup lang="ts">
import type { CSSProperties } from 'vue'
const props = withDefaults(defineProps<{
	text: string;
	width: number;
	height: number;
	font: string;
	colorKey: string;
	redirecting?: boolean;
	activeSize?: 'width' | 'height';
}>(), {
	redirecting: false,
	activeSize: 'height',
})

const emit = defineEmits<{
	'update:text': [value: string];
	'update:width': [value: number];
	'update:height': [value: number];
}>()

const editorCont = ref<HTMLElement | null>(null)
const textField = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const canvasWidth = ref(30)
const canvasHeight = ref(30)
const textSpaceX = ref(30)
const textSpaceY = ref(40)
const scale = ref(1)
const textMaxWidth = ref(0)
const textMaxHeight = ref(0)
const textAlign = ref<'left' | 'center' | 'right'>('left')
const containerStyle = ref<Record<string, string>>({})
const measurementStyle = ref({
	width: {} as Record<string, string>,
	height: {} as Record<string, string>,
})
const lineCount = ref(1)
const lines = ref<string[]>([])
const editorReady = ref(Boolean(props.text))
const initialized = ref(false)
const isReady = ref(false)
const showPreviewOverlay = computed(() => !isReady.value || props.redirecting)
const previewTopInset = 0
const previewBottomReservedSpace = 84
const widthRulerGap = 22
const heightRulerGap = 22
const usablePreviewHeight = 362 - 84
const previewContentCenterY = usablePreviewHeight / 2

const placeholderText = 'Your text'


const formattedWidth = computed(() => Math.round(props.width * 10) / 10)
const formattedHeight = computed(() => Math.round(props.height * 10) / 10)
const fontFamily = computed(() => props.font)

const textColorStyle = computed<CSSProperties>(() => {
	switch (props.colorKey) {
		case 'white':
			return { color: '#FFFFFF' }
		case 'red':
			return { color: '#FF0000' }
		case 'orange':
			return { color: '#FFB700' }
		case 'yellow':
			return { color: '#FFE600' }
		case 'green':
			return { color: '#008F00' }
		case 'blue':
			return { color: '#1B1BFF' }
		case 'purple':
			return { color: '#80008F' }
		case 'pink':
			return { color: '#F5A9B8' }
		case 'yellow-orange':
			return { color: '#FFB700' }
		case 'gold':
			return {
				backgroundImage: 'linear-gradient(0deg, rgb(183, 128, 25), rgb(251, 226, 84), rgb(240, 204, 68), rgb(255, 255, 255), rgb(240, 204, 68), rgb(251, 226, 84), rgb(183, 128, 25))',
				backgroundClip: 'text',
				WebkitBackgroundClip: 'text',
				WebkitTextFillColor: 'transparent',
				color: 'transparent',
			}
		case 'silver':
			return {
				backgroundImage: 'linear-gradient(0deg, rgb(137, 137, 137), rgb(207, 207, 207), rgb(172, 172, 172), rgb(255, 255, 255), rgb(172, 172, 172), rgb(207, 207, 207), rgb(137, 137, 137))',
				backgroundClip: 'text',
				WebkitBackgroundClip: 'text',
				WebkitTextFillColor: 'transparent',
				color: 'transparent',
			}
		case 'bronze':
			return {
				backgroundImage: 'linear-gradient(0deg, rgb(110, 58, 6), rgb(205, 127, 49), rgb(158, 93, 28), rgb(252, 208, 96), rgb(158, 93, 28), rgb(205, 127, 49), rgb(110, 58, 6))',
				backgroundClip: 'text',
				WebkitBackgroundClip: 'text',
				WebkitTextFillColor: 'transparent',
				color: 'transparent',
			}
		case 'hologram':
			return {
				backgroundImage: 'linear-gradient(135deg, #B6EEE8 0%, #F5F3EA 32%, #F1B2B9 50%, #D893C1 60%, #B6EEE8 80%)',
				backgroundClip: 'text',
				WebkitBackgroundClip: 'text',
				WebkitTextFillColor: 'transparent',
				color: 'transparent',
			}
		case 'full-color':
			return {
				backgroundImage: 'linear-gradient(90deg, #ff3b30 0%, #ff9500 18%, #ffdb4d 34%, #34c759 50%, #32ade6 68%, #007aff 82%, #af52de 100%)',
				backgroundClip: 'text',
				WebkitBackgroundClip: 'text',
				WebkitTextFillColor: 'transparent',
				color: 'transparent',
			}
		default:
			return { color: '#000000' }
	}
})

const editorTextStyle = computed<CSSProperties>(() => ({
	fontFamily: fontFamily.value,
	textAlign: textAlign.value,
	whiteSpace: 'nowrap',
	width: 'auto',
	lineHeight: '1',
	paddingLeft: `${textSpaceX.value}px`,
	paddingRight: `${textSpaceX.value}px`,
	paddingTop: `${textSpaceY.value}px`,
	paddingBottom: `${textSpaceY.value}px`,
	...containerStyle.value,
	...textColorStyle.value,
}))

const textContainerStyle = computed<CSSProperties>(() => ({
	left: '50%',
	top: `${previewContentCenterY}px`,
	transform: 'translate(-50%, -50%)',
}))

const getEditorValue = () => {
	const raw = textField.value?.innerText?.replace(/\u00A0/g, ' ') ?? ''
	return raw.replace(/\r/g, '').trimEnd()
}

const setEditorValue = (value: string) => {
	if (!textField.value) return
	textField.value.innerText = value
}

const focusAtEnd = () => {
	if (!textField.value) return
	const selection = window.getSelection()
	if (!selection) return
	const range = document.createRange()
	range.selectNodeContents(textField.value)
	range.collapse(false)
	selection.removeAllRanges()
	selection.addRange(range)
	textField.value.focus()
}

const getWidth = (given: number, x: number, y: number) => Math.round((y * given) / x)
const getHeight = (given: number, x: number, y: number) => Math.round((x * given) / y)

const resetContext = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, w: number, h: number) => {
	scale.value = 1
	if (w && h) {
		canvas.width = w
		canvas.height = h
		context.clearRect(0, 0, canvas.width, canvas.height)
	}

	context.fillStyle = '#000000'
	context.font = `100px ${fontFamily.value}`
	context.direction = 'ltr'
	context.textAlign = textAlign.value
	return context
}

const renderToCanvas = () => {
	if (!canvasRef.value || !textField.value) return false

	const canvas = canvasRef.value
	const rawContext = canvas.getContext('2d', { alpha: true })
	if (!rawContext) return false
	let context: CanvasRenderingContext2D = rawContext

	const inputText = getEditorValue() || placeholderText
	const nextLines = inputText.split('\n')
	const metrics: Array<{ top: number; left: number; right: number }> = []
	const textWidth: number[] = []
	const textHeight: number[] = []

	context = resetContext(canvas, context, canvas.width, canvas.height)

	nextLines.forEach((line) => {
		context.clearRect(0, 0, canvas.width, canvas.height)
		const metric = context.measureText(line)
		const width = metric.actualBoundingBoxLeft + metric.actualBoundingBoxRight
		const height = metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent
		metrics.push({
			top: metric.actualBoundingBoxAscent,
			left: metric.actualBoundingBoxLeft,
			right: metric.actualBoundingBoxRight,
		})
		textWidth.push(width)
		textHeight.push(height)
	})

	canvasWidth.value = [...textWidth].sort((a, b) => a - b).pop() ?? 30
	canvasHeight.value = textHeight.reduce((sum, value) => sum + value, 0) + (10 * Math.max(nextLines.length - 1, 0))

	context = resetContext(canvas, context, canvasWidth.value, canvasHeight.value)

	let offsetY = 0
	nextLines.forEach((line, index) => {
		const currentMetric = metrics[index]
		if (!currentMetric) return

		let x = currentMetric.left
		let y = currentMetric.top
		const measuredWidth = currentMetric.left + currentMetric.right

		if (measuredWidth !== canvasWidth.value) {
			if (textAlign.value === 'center') {
				x = canvas.width / 2
			}
			else if (textAlign.value === 'right') {
				x = canvas.width - Math.abs(currentMetric.right)
			}
		}

		if (index !== 0) {
			offsetY += (textHeight[index - 1] ?? 0) + 10
			y = currentMetric.top + offsetY
		}

		context.fillText(line, x, y)
	})

	lines.value = nextLines
	lineCount.value = nextLines.length
	return true
}

const scaleHandler = () => {
	if (!textField.value) return 1

	const width = textField.value.clientWidth
	const height = textField.value.clientHeight
	const nextScale = Math.min(
		textMaxWidth.value / Math.max(width, 1),
		textMaxHeight.value / Math.max(height, 1),
	)

	scale.value = nextScale
	containerStyle.value = {
		transform: `scale(${nextScale})`,
		transformOrigin: 'center center',
	}

	return nextScale
}

const measurementHandler = () => {
	if (!textField.value || !editorCont.value) return

	const child = textField.value.getBoundingClientRect()
	const parent = editorCont.value.getBoundingClientRect()
	const availableTop = previewTopInset
	const availableBottom = Math.max(parent.height - previewBottomReservedSpace, availableTop)
	const horizontalPadding = (textSpaceX.value * 2) * scale.value
	const verticalPadding = (textSpaceY.value * 2) * scale.value
	const visibleWidth = Math.max(child.width - horizontalPadding, 0)
	const visibleHeight = Math.max(child.height - verticalPadding, 0)
	const childLeft = child.left - parent.left + (textSpaceX.value * scale.value)
	const rawChildTop = child.top - parent.top + (textSpaceY.value * scale.value)
	const childTop = Math.min(
		Math.max(rawChildTop, availableTop),
		Math.max(availableBottom - visibleHeight, availableTop),
	)

	measurementStyle.value.width = {
		width: `${Math.max(visibleWidth, 88)}px`,
		left: `${childLeft}px`,
		top: `${Math.max(childTop - widthRulerGap, 18)}px`,
	}

	measurementStyle.value.height = {
		height: `${Math.max(visibleHeight, 1)}px`,
		left: `${childLeft - heightRulerGap}px`,
		top: `${childTop}px`,
	}
}

const calculateDimension = () => {
	const rawValue = getEditorValue().trim()
	if (!rawValue) {
		if (props.width !== 0) {
			emit('update:width', 0)
		}
		return
	}

	let nextWidth = Number.isFinite(canvasWidth.value) ? Math.round(canvasWidth.value * 0.2645833333) : 0
	let nextHeight = Number.isFinite(canvasHeight.value) ? Math.round(canvasHeight.value * 0.2645833333) : 0

	if (props.activeSize === 'height') {
		const resolvedHeight = props.height || nextHeight
		nextWidth = getWidth(resolvedHeight, Math.max(nextHeight, 1), Math.max(nextWidth, 1))
		nextHeight = resolvedHeight
	}
	else {
		const resolvedWidth = props.width || nextWidth
		nextHeight = getHeight(resolvedWidth, Math.max(nextHeight, 1), Math.max(nextWidth, 1))
		nextWidth = resolvedWidth
	}

	if (Number.isFinite(nextWidth) && nextWidth > 0 && nextWidth !== props.width) {
		emit('update:width', nextWidth)
	}

	if (Number.isFinite(nextHeight) && nextHeight > 0 && nextHeight !== props.height) {
		emit('update:height', nextHeight)
	}
}

const textHandler = async (flag?: 'first_load') => {
	await nextTick()
	renderToCanvas()

	if (!textField.value || !editorCont.value) return

	textMaxWidth.value = Math.max(editorCont.value.offsetWidth - 110, 120)
	textMaxHeight.value = Math.max(
		editorCont.value.offsetHeight - previewTopInset - previewBottomReservedSpace,
		80,
	)

	if (textField.value.clientWidth > textMaxWidth.value || textField.value.clientHeight >= textMaxHeight.value) {
		scaleHandler()
	}
	else {
		containerStyle.value = {}
		scale.value = 1
	}

	measurementHandler()
	calculateDimension()

	const value = getEditorValue()
	emit('update:text', value === placeholderText && !editorReady.value ? '' : value)

	if (flag === 'first_load') {
		isReady.value = true
		await nextTick()
		focusAtEnd()
	}
}

const editorOnFocus = () => {
	if (editorReady.value) return
	editorReady.value = true
	setEditorValue('')
	if (props.width !== 0) {
		emit('update:width', 0)
	}
	nextTick(() => {
		textHandler()
	})
}

const caretHandler = (event: MouseEvent) => {
	editorOnFocus()
	const target = event.target as HTMLElement | null
	if (target?.tagName !== 'P') {
		nextTick(() => {
			focusAtEnd()
		})
	}
}

const onEditorInput = () => {
	editorReady.value = true
	textHandler()
}

const pasteHandler = (event: ClipboardEvent) => {
	const text = event.clipboardData?.getData('text/plain') ?? ''
	if (textField.value) {
		textField.value.innerText = text.replace(/(?:\r\n|\r|\n)/g, '\n')
	}
	textHandler()
}

watch(
	() => props.text,
	async (nextText) => {
		if (!textField.value) return
		if (document.activeElement === textField.value) return
		editorReady.value = nextText.length > 0
		setEditorValue(nextText || placeholderText)
		await textHandler()
	},
)

watch(
	() => [props.width, props.height, props.font, props.colorKey, props.activeSize] as const,
	async () => {
		await textHandler()
	},
)

onMounted(async () => {
	if (initialized.value) return
	initialized.value = true
	isReady.value = false
	setEditorValue(props.text || placeholderText)
	editorReady.value = props.text.length > 0
	await nextTick()
	await textHandler()
	isReady.value = true
})
</script>

<template>
	<div class="vinyl-lettering-designer">
		<div class="lettering_editor">
			<UiLoadingOverlay
				:visible="showPreviewOverlay"
				position="absolute"
				background="rgba(58, 58, 58, 0.72)"
				label="Loading preview"
				test-id="vinyl-lettering-preview-loading-overlay"
			/>

			<div v-show="lineCount > 1" class="lettering_alignment">
				<span>Alignment</span>
				<a class="lettering_left" href="javascript:;" @click="textAlign = 'left'">L</a>
				<a class="lettering_center" href="javascript:;" @click="textAlign = 'center'">C</a>
				<a class="lettering_right" href="javascript:;" @click="textAlign = 'right'">R</a>
			</div>

			<label
				id="lettering_editor"
				ref="editorCont"
				class="lettering_textarea"
				@click="caretHandler"
			>
				<span
					ref="canvasWidth"
					class="lettering_width"
					:data-width="`${formattedWidth}mm`"
					:style="measurementStyle.width"
					contenteditable="false"
				/>

				<div class="text_cont" :style="textContainerStyle">
					<p
						ref="textField"
						tabindex="1"
						contenteditable="true"
						dir="ltr"
						:style="editorTextStyle"
						@input="onEditorInput"
						@paste.prevent="pasteHandler"
					/>
				</div>

				<span
					class="lettering_height"
					:data-height="`${formattedHeight}mm`"
					:style="measurementStyle.height"
					contenteditable="false"
				/>
			</label>

			<div class="lettering_footer">
				<p>The surface colour is for illustrative purpose only and won't be produced. Self-adhesive vinyl letters are individually cut and come pre-spaced with application tape applied.</p>
			</div>
		</div>

		<canvas
			ref="canvasRef"
			style="display: none;"
		/>
	</div>
</template>

<style scoped lang="scss">
.vinyl-lettering-designer {
	width: 100%;
}

.lettering_editor {
	position: relative;
	width: 100%;
	height: 362px;
	border-radius: 24px;
	overflow: hidden;
	text-align: center;
	background-color: #64656A;
    background-image: linear-gradient(45deg, #797A7F 25%, transparent 25%, transparent 75%, #797A7F 75%, #797A7F), linear-gradient(45deg, #797A7F 25%, transparent 25%, transparent 75%, #797A7F 75%, #797A7F);
	background-size: 22px 22px;
	background-position: 0 0, 11px 11px;
}

.lettering_alignment {
	position: relative;
	z-index: 2;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-width: 180px;
	padding: 8px 12px;
	border-bottom-right-radius: 10px;
	border-bottom-left-radius: 10px;
	background: #d42941;
	color: #fff;

	a {
		color: inherit;
		text-decoration: none;
		font-weight: 700;
	}
}

:deep(.lettering_editor > .ui-loading-overlay) {
	border-radius: 24px;
	backdrop-filter: blur(2px);
}

.lettering_textarea {
	position: absolute;
	inset: 0;
	overflow: hidden;
	pointer-events: none;

	.text_cont {
		position: absolute;
		left: 50%;
		top: calc(50% + 10px);
		transform: translate(-50%, -50%);
		outline: none;
		pointer-events: none;
	}

	p {
		display: inline-block;
		margin: 0;
		outline: none;
		border: 0;
		padding: 0;
		background: transparent;
		font-size: 100px;
		line-height: 1;
		letter-spacing: 0;
		word-spacing: 0;
		direction: ltr;
		unicode-bidi: plaintext;
		cursor: text;
		caret-color: #ffffff;
		pointer-events: all;
	}

	.lettering_width {
		position: absolute;
		right: auto;
		height: 25px;
		border-top: 1px solid rgba(255, 255, 255, 0.92);
		color: rgba(255, 255, 255, 0.92);
		font-size: 16px;
		font-weight: 600;
		text-align: center;

		&::before {
			content: attr(data-width);
			position: absolute;
			left: 50%;
			bottom: 100%;
			transform: translateX(-50%);
			margin-bottom: 10px;
		}

		&::after {
			content: '';
			position: absolute;
			top: -7px;
			left: 50%;
			width: 100%;
			height: 13px;
			transform: translateX(-50%);
			border-left: 1px solid rgba(255, 255, 255, 0.92);
			border-right: 1px solid rgba(255, 255, 255, 0.92);
		}
	}

	.lettering_height {
		position: absolute;
		width: 25px;
		border-left: 1px solid rgba(255, 255, 255, 0.92);
		color: rgba(255, 255, 255, 0.92);
		font-size: 16px;
		font-weight: 600;
		text-align: center;

		&::before {
			content: attr(data-height);
			position: absolute;
			top: 50%;
			left: -20px;
			transform: translate(-50%, -50%) rotate(-90deg);
		}

		&::after {
			content: '';
			position: absolute;
			top: 50%;
			left: -7px;
			width: 13px;
			height: 101%;
			transform: translateY(-50%);
			border-top: 1px solid rgba(255, 255, 255, 0.92);
			border-bottom: 1px solid rgba(255, 255, 255, 0.92);
		}
	}
}

.lettering_footer {
	position: absolute;
	left: 20px;
	right: 20px;
	bottom: 20px;
	padding: 8px 24px;
	border-radius: 18px;
	background: rgba(95, 95, 99, 0.78);
	color: var(--white-base);
	font-size: var(--type-size-150);
	line-height: 1.6;
	text-align: left;

	p {
		margin: 0;
	}
}
</style>