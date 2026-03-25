export function useFileBaseUrl() {
	const runtime_config = useRuntimeConfig();
	const file_url = String(runtime_config.public.file_url || '').trim();
	const s3_file_url = String(runtime_config.public.s3_file_url || '').trim();
	const file_base_url = String(runtime_config.public.file_base_url || '').trim();
	const base_url = file_url || file_base_url || s3_file_url;

	function resolveFileUrl(path: string) {
		const input = String(path || '').trim();
		if (!input) return input;
		if (/^https?:\/\//i.test(input) || input.startsWith('//')) return input;
		if (!base_url) return input;

		const normalized_base = base_url.replace(/\/+$/, '');
		const normalized_path = input.replace(/^\/+/, '');
		return `${normalized_base}/${normalized_path}`;
	}

	return {
		file_url,
		s3_file_url,
		file_base_url,
		effective_file_base_url: base_url,
		resolveFileUrl,
	};
}