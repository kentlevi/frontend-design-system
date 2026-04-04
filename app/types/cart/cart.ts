export interface CartItemPreview {
	product: string
	thumbnail: string
	size: string
	quantity: number
	price: number
}

export interface CartItemSource {
	product_config_mapping_id: number,
	width: number
	height: number
	quantity: number
	lettering_text?: string
	color_id?: number
	font_id?:number
	artwork?: string | null
	artwork_original_file_name?: string | null
	instruction?: string | null
	local_identity: string
}


export interface CartItem {
	id: number | string
	submitted: boolean
	user_id?: number | null
	preview: CartItemPreview
	src: CartItemSource
}

export interface CartItemCreationSpec {
	item: { id: number }
}