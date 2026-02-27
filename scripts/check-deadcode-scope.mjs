import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const LEGACY_FILES = [
    join(ROOT, 'app', 'data', 'ui', 'button-demos.ts'),
    join(ROOT, 'app', 'data', 'ui', 'social-icons.ts'),
];
const GUIDE_FILES = [
    join(ROOT, 'app', 'data', 'guide', 'ui', 'button-demos.ts'),
    join(ROOT, 'app', 'data', 'guide', 'ui', 'social-icons.ts'),
];
const RUNTIME_DIRS = [
    join(ROOT, 'app', 'components'),
    join(ROOT, 'app', 'pages'),
    join(ROOT, 'app', 'composables'),
    join(ROOT, 'app', 'layouts'),
    join(ROOT, 'app', 'middleware'),
    join(ROOT, 'app', 'plugins'),
];
const FORBIDDEN_IMPORT_PATTERNS = [
    '/data/ui/button-demos',
    '/data/ui/social-icons',
    '~/data/ui/button-demos',
    '~/data/ui/social-icons',
    '@/data/ui/button-demos',
    '@/data/ui/social-icons',
];

function listFiles(dir) {
    if (!existsSync(dir)) return [];
    const entries = readdirSync(dir);
    const files = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            files.push(...listFiles(fullPath));
            continue;
        }
        files.push(fullPath);
    }
    return files;
}

const errors = [];

for (const legacyFile of LEGACY_FILES) {
    if (existsSync(legacyFile)) {
        errors.push(`Legacy data file should be removed: ${legacyFile}`);
    }
}

for (const guideFile of GUIDE_FILES) {
    if (!existsSync(guideFile)) {
        errors.push(`Guide data file is missing: ${guideFile}`);
    }
}

for (const dir of RUNTIME_DIRS) {
    const files = listFiles(dir).filter((file) => file.endsWith('.ts') || file.endsWith('.vue'));
    for (const file of files) {
        const content = readFileSync(file, 'utf8');
        for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
            if (content.includes(pattern)) {
                errors.push(`Runtime import points to guide-only data: ${file} -> ${pattern}`);
            }
        }
    }
}

if (errors.length) {
    console.error('Dead-code scope check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log('Dead-code scope check passed.');
