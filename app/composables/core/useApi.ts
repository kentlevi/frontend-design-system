
import { saveAs } from 'file-saver'

export type ApiStatus = "SUCCESS" | "ERROR";

export type ApiResult<T = unknown> =
    | { status: "SUCCESS"; data: T }
    | { status: "ERROR"; message: string; code?: number; errors?: Record<string, string[]>; data?: unknown };

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// --- Error Normalizer ---
const normalizeError = (err: any): ApiResult => {
    const code = err?.statusCode || err?.status || err?.response?.status || 500;
    const data = err?.data ?? err?.response?._data;

    // Laravel validation error (422)
    if (code === 422) {
        return {
            status: "ERROR",
            message: data?.message || "Validation failed.",
            code,
            errors: data?.errors,
            data,
        };
    }

    // Generic Error
    return {
        status: "ERROR",
        message: data?.message || data?.error || err?.message || "Something went wrong.",
        code,
        data,
    };
};

export const useApi = () => {
    const { country } = useCountry()
    
    const config = useRuntimeConfig();

    // --- Concurrency-Safe Loading State ---
    const busy_count = useState<number>("api_busy_count", () => 0);
    
    const isBusy = computed(() => busy_count.value > 0);

    const busyStart = () => { busy_count.value++; };
    const busyEnd = () => { busy_count.value = Math.max(0, busy_count.value - 1); };

    //Prefix helper
    const withCountry = (url: string) => {
        // allow absolute external url passthrough
        if (/^https?:\/\//i.test(url)) return url

        // if already includes /sys/<country>/..., don't touch
        if (url.startsWith('/sys/')) return url

        // ensure exactly one leading slash
        const path = url.startsWith('/') ? url : `/${url}`
        return `/sys/${country.value}${path}`
    }


    // --- Core Request Handler ---
    const request = async <T>(
        method: Method,
        url: string,
        payload?: any,
        headers: Record<string, string> = {}
    ): Promise<ApiResult<T>> => {
        busyStart();

        try {
            const res = await $fetch<T>(withCountry(url), {
                baseURL: config.public.api_url,
                method,
                // Map payload correctly based on HTTP method
                ...(method === "GET" ? { query: payload } : { body: payload }),
                headers: {
                    Accept: "application/json",
                    // Strip Content-Type if uploading files (FormData) so the browser sets the boundary
                    ...(payload instanceof FormData ? {} : { "Content-Type": "application/json" }),
                    ...headers,
                },
                // Global Error Interceptor (e.g., Session Expired)
                onResponseError({ response }) {
                    if (response.status === 401) {
                        navigateTo('/login'); 
                    }
                }
            });

            return { status: "SUCCESS", data: res };
        } catch (err: any) {
            return normalizeError(err) as ApiResult<T>;
        } finally {
            busyEnd();
        }
    };

    // --- Public Methods ---
    const get = <T = any>(url: string, params?: any, headers?: Record<string, string>) =>
        request<T>("GET", url, params, headers);

    const post = <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
        request<T>("POST", url, body, headers);

    const put = <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
        request<T>("PUT", url, body, headers);

    const patch = <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
        request<T>("PATCH", url, body, headers);

    const destroy = <T = any>(url: string, params?: any, headers?: Record<string, string>) =>
        request<T>("DELETE", url, params, headers);

    // --- File Download Handler ---
    const download = async (url: string, params: Record<string, any>, filename: string) => {
        busyStart()
        try {
            const blob = await $fetch<Blob>(withCountry(url), {
                baseURL: config.public.api_url,
                method: "GET",
                query: params,
                responseType: "blob"
            })

            if (process.server) {
                return { status: "ERROR" as const, message: "Download must run on client." }
            }

            saveAs(blob, filename)

            return { status: "SUCCESS" as const, data: true }
        } catch (err: any) {
            return normalizeError(err)
        } finally {
            busyEnd()
        }
    }

    return { 
        isBusy, 
        get, 
        post, 
        put, 
        patch, 
        destroy, 
        download 
    };
};