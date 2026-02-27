import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = [
    join(ROOT, 'app', 'components', 'auth'),
    join(ROOT, 'app', 'components', 'account'),
    join(ROOT, 'app', 'components', 'checkout'),
    join(ROOT, 'app', 'pages', 'auth'),
    join(ROOT, 'app', 'pages', '[country]', 'account'),
    join(ROOT, 'app', 'pages', '[country]', 'checkout'),
];
const EXCLUDED_PATH_PARTS = [
    '/guide/',
    '\\guide\\',
    '.spec.',
    '.test.',
    '__tests__',
    'components/layout/DevOnboarding.vue',
    'components\\layout\\DevOnboarding.vue',
];

function listVueFiles(dir) {
    if (!existsSync(dir)) return [];
    const entries = readdirSync(dir);
    const files = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            files.push(...listVueFiles(fullPath));
            continue;
        }
        if (entry.endsWith('.vue')) files.push(fullPath);
    }
    return files;
}

function isExcluded(path) {
    return EXCLUDED_PATH_PARTS.some((part) => path.includes(part));
}

function findTemplateBlock(source) {
    const match = source.match(/<template[\s\S]*?>([\s\S]*?)<\/template>/i);
    return match?.[1] ?? '';
}

function normalizeText(raw) {
    return raw.replace(/\s+/g, ' ').trim();
}

function shouldReportText(text) {
    if (!text) return false;
    if (text.includes('{{') || text.includes('}}')) return false;
    if (/^[-+*/=|:&()[\]{}.,!?'"`~<>\\]+$/.test(text)) return false;
    if (/^(true|false|null)$/i.test(text)) return false;

    const alpha = (text.match(/[A-Za-z]/g) || []).length;
    if (alpha < 4) return false;

    const words = text.split(/\s+/).filter(Boolean);
    if (words.length < 2) return false;

    return true;
}

const findings = [];

for (const dir of TARGET_DIRS) {
    const files = listVueFiles(dir).filter((file) => !isExcluded(file));
    for (const file of files) {
        const source = readFileSync(file, 'utf8');
        const template = findTemplateBlock(source);
        if (!template) continue;

        const textOnly = template
            .replace(/\{\{[\s\S]*?\}\}/g, ' ')
            .replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g, '\n');
        const lines = textOnly.split('\n');

        for (let i = 0; i < lines.length; i += 1) {
            const text = normalizeText(lines[i] || '');
            if (!shouldReportText(text)) continue;
            findings.push({
                file: file.replace(`${ROOT}\\`, '').replace(`${ROOT}/`, ''),
                line: i + 1,
                text,
            });
        }
    }
}

if (findings.length) {
    console.error('Hardcoded UI text detected in components/pages:');
    for (const finding of findings) {
        console.error(`- ${finding.file}:${finding.line} -> "${finding.text}"`);
    }
    process.exit(1);
}

console.log('UI literal check passed.');
