import { addWebVitalSample, type WebVitalPayload } from '../utils/webVitalsStore';

type WebVitalName = WebVitalPayload['name'];
type WebVitalRating = WebVitalPayload['rating'];

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isName(value: unknown): value is WebVitalName {
    return value === 'LCP' || value === 'CLS' || value === 'INP';
}

function isRating(value: unknown): value is WebVitalRating {
    return value === 'good' || value === 'needs-improvement' || value === 'poor';
}

function isSource(value: unknown): value is WebVitalPayload['source'] {
    return value === 'visibilitychange' || value === 'pagehide';
}

function toPayload(input: unknown): WebVitalPayload | null {
    if (!isObject(input)) return null;

    const {
        name,
        value,
        rating,
        route,
        url,
        ts,
        source,
        element,
    } = input;

    if (!isName(name)) return null;
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    if (!isRating(rating)) return null;
    if (typeof route !== 'string' || route.length === 0 || route.length > 512) return null;
    if (typeof url !== 'string' || url.length === 0 || url.length > 2048) return null;
    if (typeof ts !== 'string' || Number.isNaN(Date.parse(ts))) return null;
    if (!isSource(source)) return null;
    if (element !== undefined && typeof element !== 'string') return null;

    return {
        name,
        value,
        rating,
        route,
        url,
        ts,
        source,
        element,
    };
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const payload = toPayload(body);

    if (!payload) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid web vitals payload',
        });
    }

    const ip =
        getRequestHeader(event, 'x-forwarded-for') ||
        getRequestIP(event) ||
        'unknown';

    console.info('[web-vitals:ingest]', {
        ...payload,
        ip,
    });
    addWebVitalSample(payload);

    return {
        ok: true,
    };
});
