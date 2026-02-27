import fs from 'node:fs';
import path from 'node:path';

const LHCI_DIR = path.resolve(process.cwd(), '.lighthouseci');
const OUTPUT_DIR = path.resolve(process.cwd(), '.perf');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'lab-summary.json');

const budgets = {
    home: { LCP: 2200, INP: 180, CLS: 0.08, jsBytes: 180000, imageBytes: 300000 },
    'product-list': { LCP: 2500, INP: 200, CLS: 0.1, jsBytes: 220000, imageBytes: 350000 },
    'product-detail': { LCP: 2600, INP: 220, CLS: 0.1, jsBytes: 240000, imageBytes: 450000 },
    auth: { LCP: 2400, INP: 250, CLS: 0.1, jsBytes: 170000, imageBytes: 350000 },
    account: { LCP: 2600, INP: 250, CLS: 0.1, jsBytes: 190000, imageBytes: 350000 },
    other: { LCP: 2500, INP: 200, CLS: 0.1, jsBytes: 200000, imageBytes: 350000 },
};

function classifyPageType(pathname) {
    const value = pathname.toLowerCase();
    if (value === '/') return 'home';
    if (/^\/(stickers|sheet-stickers|roll-stickers)\/[^/]+$/.test(value)) return 'product-detail';
    if (['/stickers', '/sheet-stickers', '/roll-stickers'].includes(value)) return 'product-list';
    if (value.startsWith('/auth/')) return 'auth';
    if (value.startsWith('/account/')) return 'account';
    return 'other';
}

function readLighthouseReports() {
    if (!fs.existsSync(LHCI_DIR)) return [];
    const files = fs.readdirSync(LHCI_DIR).filter((name) => name.startsWith('lhr-') && name.endsWith('.json'));
    return files
        .map((name) => {
            const full = path.join(LHCI_DIR, name);
            try {
                return JSON.parse(fs.readFileSync(full, 'utf8'));
            } catch {
                return null;
            }
        })
        .filter(Boolean);
}

function getAuditValue(report, id) {
    const audit = report?.audits?.[id];
    if (!audit) return null;
    const value = audit.numericValue;
    return Number.isFinite(value) ? value : null;
}

function mean(values) {
    if (!values.length) return null;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
}

const reports = readLighthouseReports();

if (!reports.length) {
    console.log('[perf:check-budgets] No Lighthouse reports found; skipping.');
    process.exit(0);
}

const grouped = new Map();

for (const report of reports) {
    const finalUrl = report?.finalDisplayedUrl || report?.finalUrl || report?.requestedUrl || '';
    if (!finalUrl) continue;
    const pathname = new URL(finalUrl).pathname;
    const key = pathname || '/';

    if (!grouped.has(key)) {
        grouped.set(key, []);
    }
    grouped.get(key).push(report);
}

let coreFailures = 0;
let corePass = 0;
let secondaryWarn = 0;
let secondaryPass = 0;

const routes = [];

for (const [route, routeReports] of grouped.entries()) {
    const pageType = classifyPageType(route);
    const budget = budgets[pageType];

    const lcp = mean(routeReports.map((r) => getAuditValue(r, 'largest-contentful-paint')).filter((v) => v !== null));
    const cls = mean(routeReports.map((r) => getAuditValue(r, 'cumulative-layout-shift')).filter((v) => v !== null));
    const inp = mean(routeReports.map((r) => getAuditValue(r, 'interaction-to-next-paint')).filter((v) => v !== null));
    const jsBytes = mean(routeReports.map((r) => getAuditValue(r, 'resource-summary:script:size')).filter((v) => v !== null));
    const imageBytes = mean(routeReports.map((r) => getAuditValue(r, 'resource-summary:image:size')).filter((v) => v !== null));

    const core = {
        LCP: { value: lcp, threshold: budget.LCP, status: lcp !== null && lcp <= budget.LCP ? 'pass' : 'fail' },
        INP: {
            value: inp,
            threshold: budget.INP,
            status: inp === null ? 'skip' : inp <= budget.INP ? 'pass' : 'fail',
        },
        CLS: { value: cls, threshold: budget.CLS, status: cls !== null && cls <= budget.CLS ? 'pass' : 'fail' },
    };

    const secondary = {
        jsBytes: {
            value: jsBytes,
            threshold: budget.jsBytes,
            status: jsBytes !== null && jsBytes <= budget.jsBytes ? 'pass' : 'warn',
        },
        imageBytes: {
            value: imageBytes,
            threshold: budget.imageBytes,
            status: imageBytes !== null && imageBytes <= budget.imageBytes ? 'pass' : 'warn',
        },
    };

    for (const item of Object.values(core)) {
        if (item.status === 'fail') coreFailures += 1;
        else if (item.status === 'pass') corePass += 1;
    }
    for (const item of Object.values(secondary)) {
        if (item.status === 'warn') secondaryWarn += 1;
        else secondaryPass += 1;
    }

    routes.push({ route, pageType, core, secondary });
}

const summary = {
    generatedAt: new Date().toISOString(),
    routeCount: routes.length,
    routes,
    totals: {
        coreFail: coreFailures,
        corePass,
        secondaryWarn,
        secondaryPass,
    },
};

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2));

if (secondaryWarn > 0) {
    console.warn(`[perf:check-budgets] Secondary warnings: ${secondaryWarn}`);
}

if (coreFailures > 0) {
    console.error(`[perf:check-budgets] Core budget failures: ${coreFailures}`);
    process.exit(1);
}

console.log('[perf:check-budgets] Core budgets passed.');
