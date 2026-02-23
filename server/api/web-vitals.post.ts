import { addWebVitalSample, type WebVitalPayload } from '../utils/webVitalsStore';
import { exportWebVitalsEvent } from '../utils/webVitalsExporter';
import type { PageType } from '../utils/performanceBudgets';

type WebVitalName = WebVitalPayload['name'];
type WebVitalRating = WebVitalPayload['rating'];
type NavType = WebVitalPayload['navType'];
type InteractionTarget = WebVitalPayload['interactionTarget'];

function isPageType(value: unknown): value is PageType {
    return (
        value === 'home' ||
        value === 'product-list' ||
        value === 'product-detail' ||
        value === 'auth' ||
        value === 'account' ||
        value === 'other'
    );
}

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
    return (
        value === 'visibilitychange' ||
        value === 'pagehide' ||
        value === 'routechange'
    );
}

function isNavType(value: unknown): value is NavType {
    return value === 'initial' || value === 'soft';
}

function isInteractionTarget(value: unknown): value is InteractionTarget {
    return (
        value === 'menu' ||
        value === 'modal' ||
        value === 'search' ||
        value === 'form' ||
        value === 'other'
    );
}

function isThirdPartySummary(
    value: unknown
): value is WebVitalPayload['thirdPartySummary'] {
    if (!Array.isArray(value)) return false;

    return value.every((item) => {
        if (!isObject(item)) return false;
        if (typeof item.host !== 'string' || !item.host.trim()) return false;
        if (
            item.lcpImpactMs !== undefined &&
            (typeof item.lcpImpactMs !== 'number' || !Number.isFinite(item.lcpImpactMs))
        ) {
            return false;
        }
        if (
            item.inpImpactMs !== undefined &&
            (typeof item.inpImpactMs !== 'number' || !Number.isFinite(item.inpImpactMs))
        ) {
            return false;
        }
        if (
            item.transferSize !== undefined &&
            (typeof item.transferSize !== 'number' || !Number.isFinite(item.transferSize))
        ) {
            return false;
        }
        return true;
    });
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
        pageType,
        navType,
        sessionId,
        traceId,
        interactionTarget,
        jsLongTaskP95,
        hydrationMs,
        thirdPartySummary,
        errorCount,
        apiFailureCount,
    } = input;

    if (!isName(name)) return null;
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    if (!isRating(rating)) return null;
    if (typeof route !== 'string' || route.length === 0 || route.length > 512) return null;
    if (typeof url !== 'string' || url.length === 0 || url.length > 2048) return null;
    if (typeof ts !== 'string' || Number.isNaN(Date.parse(ts))) return null;
    if (!isSource(source)) return null;
    if (element !== undefined && typeof element !== 'string') return null;
    if (pageType !== undefined && !isPageType(pageType)) return null;
    if (navType !== undefined && !isNavType(navType)) return null;
    if (sessionId !== undefined && typeof sessionId !== 'string') return null;
    if (traceId !== undefined && typeof traceId !== 'string') return null;
    if (
        interactionTarget !== undefined &&
        !isInteractionTarget(interactionTarget)
    ) {
        return null;
    }
    if (
        jsLongTaskP95 !== undefined &&
        (typeof jsLongTaskP95 !== 'number' || !Number.isFinite(jsLongTaskP95))
    ) {
        return null;
    }
    if (
        hydrationMs !== undefined &&
        (typeof hydrationMs !== 'number' || !Number.isFinite(hydrationMs))
    ) {
        return null;
    }
    if (thirdPartySummary !== undefined && !isThirdPartySummary(thirdPartySummary)) {
        return null;
    }
    if (
        errorCount !== undefined &&
        (typeof errorCount !== 'number' || !Number.isFinite(errorCount))
    ) {
        return null;
    }
    if (
        apiFailureCount !== undefined &&
        (typeof apiFailureCount !== 'number' || !Number.isFinite(apiFailureCount))
    ) {
        return null;
    }

    return {
        name,
        value,
        rating,
        route,
        url,
        ts,
        source,
        element,
        pageType,
        navType,
        sessionId,
        traceId,
        interactionTarget,
        jsLongTaskP95,
        hydrationMs,
        thirdPartySummary,
        errorCount,
        apiFailureCount,
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
    void exportWebVitalsEvent(payload);

    return {
        ok: true,
    };
});
