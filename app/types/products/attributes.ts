export interface SizeSpec {
	id: number | null,
	width: number
	height: number
	label: string | null,
	custom?: boolean | null
}

export interface QuantitySpec {
	custom?: boolean | null,
	nr: number,
	price: number,
}

export interface ProductAttributes {
	featured_sizes: SizeSpec[],
	quantities: SizeSpec[],
}

export interface AttributeSelection {
	size		: SizeSpec
	quantity	: QuantitySpec,
}