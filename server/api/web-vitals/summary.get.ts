import { getWebVitalSummaryByRoute } from '../../utils/webVitalsStore';

export default defineEventHandler(() => {
    const routes = getWebVitalSummaryByRoute();

    return {
        ok: true,
        generatedAt: new Date().toISOString(),
        routeCount: routes.length,
        routes,
    };
});
