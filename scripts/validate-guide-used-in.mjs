import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const guideDataPath = path.join(projectRoot, 'app', 'data', 'guide', 'guides.ts');
const source = fs.readFileSync(guideDataPath, 'utf8');

const usedInPathMatches = Array.from(
    source.matchAll(/path:\s*'([^']+)'/g),
    (match) => match[1]
).filter((value) => value.startsWith('frontend/'));

const missing = usedInPathMatches.filter((relativePath) => {
    const normalized = relativePath.replace(/^frontend\//, '');
    const absolutePath = path.join(projectRoot, normalized);
    return !fs.existsSync(absolutePath);
});

if (missing.length) {
    console.error('Invalid usedIn references found in app/data/guide/guides.ts:');
    for (const missingPath of missing) {
        console.error(`- ${missingPath}`);
    }
    process.exit(1);
}

console.log(`Validated ${usedInPathMatches.length} usedIn references.`);
