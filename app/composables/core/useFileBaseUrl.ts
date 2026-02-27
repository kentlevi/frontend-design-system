export function useFileBaseUrl() {
    const runtimeConfig = useRuntimeConfig();
    const fileUrl = String(runtimeConfig.public.file_url || '').trim();
    const s3FileUrl = String(runtimeConfig.public.s3_file_url || '').trim();
    const fileBaseUrl = String(runtimeConfig.public.file_base_url || '').trim();
    const baseUrl = fileUrl || fileBaseUrl || s3FileUrl;

    function resolveFileUrl(path: string) {
        const input = String(path || '').trim();
        if (!input) return input;
        if (/^https?:\/\//i.test(input) || input.startsWith('//')) return input;
        if (!baseUrl) return input;

        const normalizedBase = baseUrl.replace(/\/+$/, '');
        const normalizedPath = input.replace(/^\/+/, '');
        return `${normalizedBase}/${normalizedPath}`;
    }

    return {
        fileUrl,
        s3FileUrl,
        fileBaseUrl,
        effectiveFileBaseUrl: baseUrl,
        resolveFileUrl,
    };
}
