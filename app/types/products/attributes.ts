export interface SizeOption {
	id: number,
	width: number
	height: number
	label: string
}

export interface ProductAttributes {
	featured_sizes: SizeOption[],
	quantities: SizeOption[],
}