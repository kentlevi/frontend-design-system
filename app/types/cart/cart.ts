export interface CartItem {
	id: number | null
	user_id: number | null
	product_config_mapping_id: number
	url_slug: string
	product: string
	product_thumbnail: string
	color: string | null
	color_id: number | null
	font: string | null
	font_id: number | null
	width: number
	height: number
	quantity: number
	cost: number
	lettering_text: string | null
	artwork_file: string | null
	artwork_file_name: string | null
	instruction: string | null
	local_identity: string | null
	artwork_preview?: string | null
	file_path?: string | null
}

export interface CartItemCreationSpec {
	item: { id: number }
}