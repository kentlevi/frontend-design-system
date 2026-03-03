import fs from 'node:fs';
import path from 'node:path';

const docsRoot = process.cwd();
const repoRoot = path.resolve(docsRoot, '..');
const guidesPath = path.join(docsRoot, 'app', 'data', 'guide', 'guides.ts');
const docsPath = path.join(docsRoot, 'app', 'data', 'guide', 'docs.ts');
const guidePagesDir = path.join(docsRoot, 'app', 'pages', 'guide');

const guidesSource = fs.readFileSync(guidesPath, 'utf8');
const docsSource = fs.readFileSync(docsPath, 'utf8');
const guidePageFiles = fs
    .readdirSync(guidePagesDir)
    .filter((file) => file.endsWith('.vue'))
    .map((file) => path.join(guidePagesDir, file));
const guidePagesSource = guidePageFiles.map((filePath) => ({
    filePath,
    source: fs.readFileSync(filePath, 'utf8'),
}));

const errors = [];

const findLine = (source, index) => source.slice(0, index).split('\n').length;

const forbiddenPatterns = [/`npm run /g, /`npm install`/g, /npm\.cmd/g];
const checkForbidden = (filePath, source) => {
    for (const pattern of forbiddenPatterns) {
        let match = pattern.exec(source);
        while (match) {
            errors.push(`${path.relative(repoRoot, filePath)}:${findLine(source, match.index)} -> use pnpm commands in guide copy.`);
            match = pattern.exec(source);
        }
    }
};

checkForbidden(docsPath, docsSource);
for (const page of guidePagesSource) {
    checkForbidden(page.filePath, page.source);
}

const stableGuideBlocks = Array.from(
    guidesSource.matchAll(/\{[\s\S]*?path:\s*'([^']+)'.*?status:\s*'stable'[\s\S]*?\n\s*},/g),
    (match) => ({ path: match[1], block: match[0] })
).filter((value) => value.path.startsWith('/guide'));

const stableGuidePaths = stableGuideBlocks.map((item) => item.path);

for (const stableGuide of stableGuideBlocks) {
    if (!/owner:\s*\{/.test(stableGuide.block)) {
        errors.push(`app/data/guide/guides.ts -> stable guide ${stableGuide.path} is missing owner metadata.`);
    }
    if (!/reviewDueAt:\s*'[^']+'/.test(stableGuide.block)) {
        errors.push(`app/data/guide/guides.ts -> stable guide ${stableGuide.path} is missing reviewDueAt metadata.`);
    }
}

for (const guidePath of stableGuidePaths) {
    const blockStart = docsSource.indexOf(`'${guidePath}': {`);
    if (blockStart === -1) {
        errors.push(`app/data/guide/docs.ts -> missing docs block for stable guide ${guidePath}.`);
        continue;
    }
    const nextBlockMatch = docsSource.slice(blockStart + 1).match(/\n\s*'\/guide[^']*':\s*\{/);
    const blockEnd = nextBlockMatch ? blockStart + 1 + nextBlockMatch.index : docsSource.length;
    const block = docsSource.slice(blockStart, blockEnd);
    if (!/qaChecklist:\s*\[/.test(block)) {
        errors.push(`app/data/guide/docs.ts -> stable guide ${guidePath} is missing qaChecklist.`);
    }
    if (!/changelog:\s*\[/.test(block)) {
        errors.push(`app/data/guide/docs.ts -> stable guide ${guidePath} is missing changelog.`);
    }
}

const docsPaths = Array.from(
    docsSource.matchAll(/path:\s*'([^']+)'/g),
    (match) => match[1]
).filter((value) =>
    value.startsWith('frontend/') ||
    value.startsWith('frontend-documentation/') ||
    value.startsWith('playwright-shared/')
);

for (const relativePath of docsPaths) {
    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) {
        errors.push(`app/data/guide/docs.ts -> invalid path reference: ${relativePath}`);
    }
}

if (errors.length) {
    console.error('Guide doc drift check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log('Guide doc drift check passed.');
