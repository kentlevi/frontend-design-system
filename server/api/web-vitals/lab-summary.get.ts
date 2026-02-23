import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type LabSummary = {
    generatedAt: string;
    routeCount: number;
    routes: Array<{
        route: string;
        pageType: string;
        core: Record<string, { value: number | null; threshold: number; status: string }>;
        secondary: Record<string, { value: number | null; threshold: number; status: string }>;
    }>;
    totals: {
        coreFail: number;
        corePass: number;
        secondaryWarn: number;
        secondaryPass: number;
    };
};

const EMPTY_SUMMARY: LabSummary = {
    generatedAt: '',
    routeCount: 0,
    routes: [],
    totals: {
        coreFail: 0,
        corePass: 0,
        secondaryWarn: 0,
        secondaryPass: 0,
    },
};

export default defineEventHandler(() => {
    const path = resolve(process.cwd(), '.perf', 'lab-summary.json');

    if (!existsSync(path)) {
        return {
            ok: true,
            hasData: false,
            ...EMPTY_SUMMARY,
        };
    }

    try {
        const raw = readFileSync(path, 'utf8');
        const parsed = JSON.parse(raw) as LabSummary;
        return {
            ok: true,
            hasData: true,
            ...parsed,
        };
    } catch {
        return {
            ok: false,
            hasData: false,
            ...EMPTY_SUMMARY,
        };
    }
});
