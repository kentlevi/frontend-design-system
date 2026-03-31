
import type { CSSProperties } from 'vue'

export interface ProductSpec {
	url_slug: string
	name: string
	description: string
}

export interface FontSpec {
	id: number
	label: string
	value: string
	style: { fontFamily: string }
}

export type SwatchStyleSpec = CSSProperties

export interface ColorSpec {
	id: number
	name: string
	key: string
	hex_code: string
	style: SwatchStyleSpec
}
export interface SizeSpec {
	width: number | null
	height: number | null
	label: string | null
	custom?: boolean | null
	code?: string | null,
	image?: string | null,
	desc_key?: string | null,
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