import fs from 'node:fs';
import path from 'node:path';

const docsRoot = process.cwd();
const repoRoot = path.resolve(docsRoot, '..');
const guideDataPath = path.join(docsRoot, 'app', 'data', 'guide', 'guides.ts');
const guideDocsDataPath = path.join(docsRoot, 'app', 'data', 'guide', 'docs.ts');
const guideSource = fs.readFileSync(guideDataPath, 'utf8');
const docsSource = fs.readFileSync(guideDocsDataPath, 'utf8');

const usedInPathMatches = Array.from(
    guideSource.matchAll(/path:\s*'([^']+)'/g),
    (match) => match[1]
).filter((value) => value.startsWith('frontend/') || value.startsWith('playwright-shared/'));

const docsPathMatches = Array.from(
    docsSource.matchAll(/path:\s*'([^']+)'/g),
    (match) => match[1]
).filter((value) =>
    value.startsWith('frontend/') ||
    value.startsWith('frontend-documentation/') ||
    value.startsWith('playwright-shared/')
);

const allPathMatches = Array.from(new Set([...usedInPathMatches, ...docsPathMatches]));

const missing = allPathMatches.filter((relativePath) => {
    const absolutePath = path.join(repoRoot, relativePath);
    return !fs.existsSync(absolutePath);
});

if (missing.length) {
    console.error('Invalid guide path references found in guide metadata/docs:');
    for (const missingPath of missing) {
        console.error(`- ${missingPath}`);
    }
    process.exit(1);
}

console.log(`Validated ${allPathMatches.length} guide path references.`);
