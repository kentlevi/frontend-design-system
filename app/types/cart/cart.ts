export interface CartItem {
	id: number | null
	user_id: number | null
	product_id?: number
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
	local_identity: string
	artwork_preview: string | null
	file_path?: string | null
}

export interface CartItemAPI {
	product_config_mapping_id: number
	color_id: number | null
	font_id: number | null
	width: number
	height: number
	quantity: number
	lettering_text: string | null
	artwork_file: string | null
	artwork_file_name: string | null
	instruction: string | null
	local_identity: string | null
}

export interface ExpectedCartItemData {
	id : number
	product_config_mapping_id : number
	url_slug : string
	product : string
	product_thumbnail : string
	color : string | null
	color_id : number | null
	font : string | null
	font_id : number | null
	width : number
	height : number
	quantity : number
	cost : number
	lettering_text : string | null
	artwork_file : string | null
	artwork_file_name : string | null
	instruction : string | null
	local_identity : string
	file_path : string | null
}


export interface SavedDraftResponse {
	success: Record<string, unknown>[]
	failure: Record<string, unknown>[]
}

export interface ResponseNumberSpec {
	total_cost: number
	total_count: number
}

export interface CartRow {
	id: string;
	image: string;
	title: string;
	metadata: string;
	url_slug: string;
	width: number;
	height: number;
	qty: number;
	total: number;
	sizeKey: string;
	sizeLabel: string;
	customSizeLabel?: string;
	rawItem: CartItem;
	artwork_file_name?: string | null;
	artwork_file?: string | null;
	product_thumbnail?: string;
	file_path?: string | null;
	artworkName?: string;
	artworkSizeLabel?: string;
	artworkPreviewUrl?: string;
	specialInstructions?: string;
	product: {
		name: string;
		image: string;
	};
}

export interface SelectOption {
	label: string
	value: string | number
	description?: string
	style?: Record<string, string | number>
};