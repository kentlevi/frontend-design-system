import { ref } from 'vue';

export function useAuthProfileDetailsStep(params: {
	emitUpdateFirstName: (value: string) => void;
	emitUpdateLastName: (value: string) => void;
	emitPhotoFilePicked: (file: File) => void;
}) {
	const file_input = ref<HTMLInputElement | null>(null);

	function open_file_picker() {
		file_input.value?.click();
	}

	function on_file_picked(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		params.emitPhotoFilePicked(file);
		target.value = '';
	}

	function update_first_name(value: string) {
		params.emitUpdateFirstName(value);
	}

	function update_last_name(value: string) {
		params.emitUpdateLastName(value);
	}

	return {
		fileInput: file_input,
		openFilePicker: open_file_picker,
		onFilePicked: on_file_picked,
		updateFirstName: update_first_name,
		updateLastName: update_last_name,
	};
}