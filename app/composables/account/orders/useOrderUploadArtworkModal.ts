import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useOrdersService } from '~/services/account/orders.service'

export const useOrderUploadArtworkModal = () => {
	const orders_service = useOrdersService()
	const file_input_ref = ref<HTMLInputElement | null>(null)
	const selected_files = ref<File[]>([])
	const special_instructions = ref('')
	const primary_file_preview_url = ref('')

	const is_open = computed(() => orders_service.is_upload_modal_open.value)
	const item = computed(() => orders_service.active_upload_item.value)
	const primary_file = computed(() => selected_files.value[0] || null)

	const primary_file_extension = computed(() => {
		if (!primary_file.value) return ''
		const parts = primary_file.value.name.split('.')
		return parts.length > 1 ? `.${parts.pop()?.toLowerCase() || ''}` : ''
	})

	const primary_file_size_label = computed(() => {
		if (!primary_file.value) return ''
		const size_in_mb = primary_file.value.size / (1024 * 1024)
		return `${size_in_mb.toFixed(1)}MB`
	})

	const reset_form = () => {
		selected_files.value = []
		special_instructions.value = ''
		if (file_input_ref.value) {
			file_input_ref.value.value = ''
		}
	}

	const revoke_primary_file_preview = () => {
		if (!primary_file_preview_url.value) return
		URL.revokeObjectURL(primary_file_preview_url.value)
		primary_file_preview_url.value = ''
	}

	const close_modal = () => {
		orders_service.closeUploadModal()
	}

	const open_file_picker = () => {
		file_input_ref.value?.click()
	}

	const handle_file_change = (event: Event) => {
		const target = event.target as HTMLInputElement | null
		selected_files.value = Array.from(target?.files || [])
	}

	const remove_selected_artwork = () => {
		selected_files.value = []
		if (file_input_ref.value) {
			file_input_ref.value.value = ''
		}
	}

	watch(is_open, (value) => {
		if (!value) return
		reset_form()
	})

	watch(primary_file, (file) => {
		revoke_primary_file_preview()

		if (!file || !file.type.startsWith('image/')) return
		primary_file_preview_url.value = URL.createObjectURL(file)
	})

	onBeforeUnmount(() => {
		revoke_primary_file_preview()
	})

	return {
		is_open,
		item,
		file_input_ref,
		selected_files,
		special_instructions,
		primary_file,
		primary_file_preview_url,
		primary_file_extension,
		primary_file_size_label,
		close_modal,
		open_file_picker,
		handle_file_change,
		remove_selected_artwork,
	}
}