<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, type CSSProperties } from 'vue'
import { resolveLetteringPaintSpec } from '~/utils/products/letteringPaint'

const props = withDefaults(defineProps<{
	text: string;
	width: number | null;
	height: number | null;
	font: string;
	colorKey: string;
	hexCode?: string;
	redirecting?: boolean;
	activeSize?: 'width' | 'height';
	isLoadingFeatures?: boolean;
	selectionNavigationInFlight?: boolean;
	letteringNavigationFlight?: boolean;
	hasLetteringEditor?: boolean;
}>(), {
	hexCode: undefined,
	redirecting: false,
	activeSize: 'height',
	isLoadingFeatures: false,
	selectionNavigationInFlight: false,
	letteringNavigationFlight: false,
	hasLetteringEditor: false,
})

const emit = defineEmits<{
	'update:text': [value: string];
	'update:width': [value: number | null];
	'preview-ready-change': [value: boolean];
	'update:height': [value: number | null];
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
const isMounted = ref(false)
const isReady = ref(Boolean(props.text && props.font))
const fontLoading = ref(false)
const hasSettledOnce = ref(false)
const show_preview_overlay = computed(() =>
	!isMounted.value
	|| !isReady.value
	|| !props.font
	|| props.redirecting
	|| (fontLoading.value && !hasSettledOnce.value)
)
const is_preview_settled = computed(() =>
	isMounted.value
	&& isReady.value
	&& Boolean(props.font)
	&& !props.redirecting
	&& (!fontLoading.value || hasSettledOnce.value)
)
onMounted(() => {
	isMounted.value = true
})
const previewTopInset = 0
const previewBottomReservedSpace = 84
const widthRulerGap = 22
const heightRulerGap = 22
const usablePreviewHeight = 362 - 84
const previewContentCenterY = usablePreviewHeight / 2

const placeholderText = 'Your text'


const formatted_width = computed(() => props.width ? Math.round(props.width * 10) / 10 : 0)
const formatted_height = computed(() => props.height ? Math.round(props.height * 10) / 10 : 0)
const font_family = computed(() => props.font)
const lettering_paint_spec = computed(() => resolveLetteringPaintSpec(props.colorKey, props.hexCode))

const text_color_style = computed<CSSProperties>(() => {
	if (lettering_paint_spec.value.kind === 'solid') {
		return { color: lettering_paint_spec.value.color }
	}

	const gradientDirection = lettering_paint_spec.value.type === 'diagonal' ? '135deg' : '0deg'
	const gradientStops = lettering_paint_spec.value.stops
		.map((stop) => `${stop.color} ${Math.round(stop.offset * 100)}%`)
		.join(', ')

	return {
		backgroundImage: `linear-gradient(${gradientDirection}, ${gradientStops})`,
		backgroundClip: 'text',
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		color: 'transparent',
	}
})

const editor_text_style = computed<CSSProperties>(() => ({
	fontFamily: font_family.value || 'sans-serif',
	textAlign: textAlign.value,
	whiteSpace: 'nowrap',
	width: 'auto',
	lineHeight: '1',
	paddingLeft: `${textSpaceX.value}px`,
	paddingRight: `${textSpaceX.value}px`,
	paddingTop: `${textSpaceY.value}px`,
	paddingBottom: `${textSpaceY.value}px`,
	...containerStyle.value,
	...text_color_style.value,
}))

const text_container_style = computed<CSSProperties>(() => ({
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

const resolveCanvasTextFillStyle = (
	context: CanvasRenderingContext2D,
	width: number,
	height: number
): string | CanvasGradient => {
	const paint = lettering_paint_spec.value
	if (paint.kind === 'solid') {
		return paint.color
	}

	const gradient_width = Math.max(width, 144)
	const gradient_height = Math.max(height, 144)
	const gradient = paint.type === 'diagonal'
		? context.createLinearGradient(0, 0, gradient_width, gradient_height)
		: context.createLinearGradient(0, gradient_height, 0, 0)

	paint.stops.forEach((stop) => {
		gradient.addColorStop(stop.offset, stop.color)
	})

	return gradient
}

const resetContext = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, w: number, h: number) => {
	scale.value = 1
	if (w && h) {
		canvas.width = w
		canvas.height = h
		context.clearRect(0, 0, canvas.width, canvas.height)
	}

	context.font = `100px ${font_family.value ? `"${font_family.value}"` : 'sans-serif'}`
	context.direction = 'ltr'
	context.textAlign = textAlign.value
	context.fillStyle = resolveCanvasTextFillStyle(
		context,
		w || canvas.width || 144,
		h || canvas.height || 144
	)
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

const waitForFont = async (font: string) => {
	if (typeof window === 'undefined' || !('fonts' in document)) return

	// Check if font is already loaded to avoid a flicker/overlay flash
	if (document.fonts.check(`100px "${font}"`)) {
		return;
	}

	try {
		fontLoading.value = true
		// Wait for the font to be loaded. '100px' is used to match the editor/canvas size
		await document.fonts.load(`100px "${font}"`)
	}
	catch (error) {
		if (import.meta.dev) {
			console.warn(`Failed to load font: ${font}`, error)
		}
		fontLoading.value = false
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
	if (textField.value) {
		const rawValue = textField.value.innerText.replace(/\u00A0/g, ' ').replace(/\r/g, '')
		const normalizedValue = rawValue.replace(/\n+/g, ' ')

		if (rawValue !== normalizedValue) {
			textField.value.innerText = normalizedValue
			nextTick(() => {
				focusAtEnd()
			})
		}
	}
	editorReady.value = true
	textHandler()
}

const pasteHandler = (event: ClipboardEvent) => {
	const text = event.clipboardData?.getData('text/plain') ?? ''
	if (textField.value) {
		textField.value.innerText = text.replace(/(?:\r\n|\r|\n)+/g, ' ')
	}
	textHandler()
}

const keydownHandler = (event: KeyboardEvent) => {
	if (event.key !== 'Enter') return
	event.preventDefault()
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
	async (next, prev) => {
		if (next[2] && next[2] !== prev?.[2]) {
			await waitForFont(next[2])
			if (!isReady.value) isReady.value = true
		}
		await textHandler()
		fontLoading.value = false
	},
)

watch(
	is_preview_settled,
	(settled) => {
		if (settled) {
			hasSettledOnce.value = true
		}
		emit('preview-ready-change', settled)
	},
	{ immediate: true },
)

onMounted(async () => {
	if (initialized.value) return
	initialized.value = true

	// If we already have the necessary props, we can start as ready
	// while still waiting for the font in the background/overlay if needed.
	const should_be_ready = Boolean(props.text && props.font)

	setEditorValue(props.text || placeholderText)
	editorReady.value = props.text.length > 0

	await nextTick()
	if (props.font) {
		await waitForFont(props.font)
		await textHandler()
		isReady.value = true
		fontLoading.value = false
	}
	else {
		await textHandler()
		isReady.value = should_be_ready
	}
})


// The internal function that does the work
const generateImage = async (): Promise<Blob | null> => {
	return new Promise((resolve) => {
		if (!canvasRef.value) return resolve(null)

		canvasRef.value.toBlob((blob) => {
			resolve(blob)
		}, 'image/png', 1.0)
	})
}

// Expose the image generator to the parent component.
defineExpose({
	generateImage
})
</script>

<template>
	<div class="vinyl-lettering-designer">
		<div class="lettering_editor">
			<UiLoadingOverlay
				:visible="show_preview_overlay || isLoadingFeatures || selectionNavigationInFlight || letteringNavigationFlight"
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
					:data-width="`${formatted_width}mm`"
					:style="measurementStyle.width"
					contenteditable="false"
				/>

				<div
					class="text_cont"
					:style="[text_container_style, { opacity: fontLoading && !hasSettledOnce ? 0 : 1 }]"
					data-testid="product-category-vinyl-designer-textarea"
				>
					<p
						ref="textField"
						tabindex="1"
						contenteditable="true"
						dir="ltr"
						:style="editor_text_style"
						@input="onEditorInput"
						@keydown="keydownHandler"
						@paste.prevent="pasteHandler"
					/>
				</div>

				<span
					class="lettering_height"
					:data-height="`${formatted_height}mm`"
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
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

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
		white-space: pre-wrap;
		word-break: break-all;
		font-family: inherit;
		min-width: 1px;
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
	font-size: var(--type-size-100);
    line-height: var(--type-line-100);
	text-align: left;

	p {
		margin: 0;
	}
}

</style>