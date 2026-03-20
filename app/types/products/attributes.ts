
export interface FontSpec {
	id: number
	name: string
	key: string
}

export interface SwatchStyleSpec {
	background: string
	border?: string
}

export interface ColorSpec {
	id: number
	name: string
	key: string
	code: string
	swatch_style: SwatchStyleSpec
}
export interface SizeSpec {
	id: number | null
	width: number | null
	height: number | null
	label: string | null
	custom?: boolean | null
}

export interface QuantitySpec {
	custom?: boolean | null
	nr: number | null
	price: number | null
}

export interface ProductAttributes {
	fonts: FontSpec[]
	colors: ColorSpec[]
	featured_sizes: SizeSpec[]
	quantities: SizeSpec[]
}

export interface AttributeSelection {
	size: SizeSpec
	quantity: QuantitySpec
	color: ColorSpec | null
	font: FontSpec | null
	lettering_text: string | null,
}

export interface LetteringSpec {
	active: 'width' | 'height',
	width: number,
	height: number,
	text: string,
}