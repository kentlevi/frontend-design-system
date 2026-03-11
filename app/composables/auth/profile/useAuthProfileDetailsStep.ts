import { ref } from 'vue';

export function useAuthProfileDetailsStep(params: {
	emitUpdateFirstName: (value: string) => void;
	emitUpdateLastName: (value: string) => void;
	emitPhotoFilePicked: (file: File) => void;
}) {
	const file_input = ref<HTMLInputElement | null>(null);

	function openFilePicker() {
		file_input.value?.click();
	}

	function onFilePicked(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		params.emitPhotoFilePicked(file);
		target.value = '';
	}

	function updateFirstName(value: string) {
		params.emitUpdateFirstName(value);
	}

	function updateLastName(value: string) {
		params.emitUpdateLastName(value);
	}

	return {
		fileInput: file_input,
		openFilePicker: openFilePicker,
		onFilePicked: onFilePicked,
		updateFirstName: updateFirstName,
		updateLastName: updateLastName,
	};
}