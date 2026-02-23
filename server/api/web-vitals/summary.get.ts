import { getWebVitalSummaryByRoute } from '../../utils/webVitalsStore';

export default defineEventHandler(() => {
    const routes = getWebVitalSummaryByRoute();
    const budgetTotals = {
        pass: 0,
        warn: 0,
        fail: 0,
    };

    for (const route of routes) {
        for (const result of Object.values(route.budgets)) {
            budgetTotals[result.status] += 1;
        }
    }

    return {
        ok: true,
        generatedAt: new Date().toISOString(),
        routeCount: routes.length,
        budgetTotals,
        routes,
    };
});
