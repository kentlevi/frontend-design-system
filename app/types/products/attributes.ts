
import type { CSSProperties } from 'vue'

export interface ProductSpec {
	url_slug: string
	name: string
	description: string,
	image: string,
}

export interface FontSpec {
	id: number
	label: string
	value: string
	code: string
	style: { fontFamily: string }
}

export type SwatchStyleSpec = CSSProperties

export interface ColorSpec {
	id: number
	name: string
	keyword: string
	hex_code: string
	style: SwatchStyleSpec
}
export interface SizeSpec {
	id?: number | null
	width: number | null
	height: number | null
	label: string | null
	custom?: boolean | null
	code?: string | null,
	image?: string | null,
	desc_key?: string | null,
	src?: string
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
	lettering_text: string | null
	lettering_file: File | null
}

export interface FeaturedDataResponse {
	product: {
		pcm_id: number
		url_slug: string
		name: string
		description: string
		image: string
	}
	featured_sizes: SizeSpec[]
	variants: {
		colors: ColorSpec[],
		fonts: {
			id: number,
			name: string,
			code: string,
			style: Record<string, unknown>
		}[],
	},
	quantities: {
		product_variant_id: number,
		data: QuantitySpec[],
	}
}

export interface PricingParameters {
	width: number
	height: number
	color_id?: number
	font_id?: number
	quantity?: number
}

export interface PricingResponse {
	product_variant_id: number,
	prices: QuantitySpec [],
}

export interface PricePoint {
	nr: number;
	price: number;
}

export interface PriceCalculationResult {
	bound_qty_diff: number;
	qty_diff: number;
	lower_price: number;
	upper_price: number;
	bound_price_diff: number;
	bound_diff: number;
	diff: number;
	price: number;
}