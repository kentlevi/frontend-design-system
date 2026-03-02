import axios, { AxiosHeaders, type AxiosRequestConfig } from 'axios';

type ApiOptions = Omit<AxiosRequestConfig, 'url' | 'data' | 'baseURL'> & {
    body?: unknown;
};

export const useApi = () => {
    const config = useRuntimeConfig();

    const client = axios.create({
        baseURL: config.public.apiBase,
    });

    client.interceptors.request.use((request) => {
        const token = useCookie<string | null>('auth_token').value;
        if (!token) return request;

        const headers = AxiosHeaders.from(request.headers);
        headers.set('Authorization', `Bearer ${token}`);
        request.headers = headers;

        return request;
    });

    return async function api<T>(url: string, options: ApiOptions = {}): Promise<T> {
        const { body, ...rest } = options;

        try {
            const response = await client.request<T>({
                url,
                data: body,
                ...rest,
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const normalizedError = new Error(
                    (error.response?.data as { message?: string } | undefined)?.message ||
                        error.message
                ) as Error & { data?: unknown; statusCode?: number };

                normalizedError.data = error.response?.data;
                normalizedError.statusCode = error.response?.status;
                throw normalizedError;
            }

            throw error;
        }
    };
};
