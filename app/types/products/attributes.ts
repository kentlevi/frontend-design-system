export interface SizeSpec {
	id: number | null,
	width: number | null
	height: number | null
	label: string | null,
	custom?: boolean | null
}

export interface QuantitySpec {
	custom?: boolean | null,
	nr: number | null,
	price: number | null,
}

export interface ProductAttributes {
	featured_sizes: SizeSpec[],
	quantities: SizeSpec[],
}

export interface AttributeSelection {
	size		: SizeSpec
	quantity	: QuantitySpec,
}