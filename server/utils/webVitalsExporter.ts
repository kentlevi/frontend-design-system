import type { WebVitalPayload } from './webVitalsStore';

function isEnabled(): boolean {
    return String(process.env.WEB_VITALS_EXPORT_ENABLED || '').toLowerCase() === 'true';
}

function getExportUrl(): string {
    return String(process.env.WEB_VITALS_EXPORT_URL || '').trim();
}

export async function exportWebVitalsEvent(
    payload: WebVitalPayload
): Promise<void> {
    if (!isEnabled()) return;

    const url = getExportUrl();
    if (!url) return;

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch {
        // Best-effort export hook; ignore exporter failures.
    }
}
