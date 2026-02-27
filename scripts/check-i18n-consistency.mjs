import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const LOCALES_ROOT = join(ROOT, 'i18n', 'locales');
const BASE_LOCALE = 'en';
const TARGET_LOCALE = 'kr';

function listJsonFiles(dir) {
    const entries = readdirSync(dir);
    const files = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            files.push(...listJsonFiles(fullPath));
            continue;
        }
        if (entry.endsWith('.json')) {
            files.push(fullPath);
        }
    }
    return files;
}

function flattenKeys(value, parent = '', output = new Map()) {
    if (Array.isArray(value)) {
        output.set(parent, 'array');
        return output;
    }

    if (value !== null && typeof value === 'object') {
        const keys = Object.keys(value);
        if (!keys.length && parent) output.set(parent, 'object');
        for (const key of keys) {
            const nextPath = parent ? `${parent}.${key}` : key;
            flattenKeys(value[key], nextPath, output);
        }
        return output;
    }

    if (parent) output.set(parent, 'leaf');
    return output;
}

function toRelativeLocalePath(fullPath, localeCode) {
    const localeRoot = join(LOCALES_ROOT, localeCode);
    return relative(localeRoot, fullPath).replace(/\\/g, '/');
}

function loadLocaleMap(localeCode) {
    const localeRoot = join(LOCALES_ROOT, localeCode);
    const files = listJsonFiles(localeRoot);
    const map = new Map();
    for (const fullPath of files) {
        const relativePath = toRelativeLocalePath(fullPath, localeCode);
        const content = readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, '');
        const parsed = JSON.parse(content);
        map.set(relativePath, flattenKeys(parsed));
    }
    return map;
}

const baseMap = loadLocaleMap(BASE_LOCALE);
const targetMap = loadLocaleMap(TARGET_LOCALE);

const errors = [];

for (const file of baseMap.keys()) {
    if (!targetMap.has(file)) {
        errors.push(`[missing-file:${TARGET_LOCALE}] ${file}`);
    }
}

for (const file of targetMap.keys()) {
    if (!baseMap.has(file)) {
        errors.push(`[missing-file:${BASE_LOCALE}] ${file}`);
    }
}

for (const [file, baseKeys] of baseMap.entries()) {
    const targetKeys = targetMap.get(file);
    if (!targetKeys) continue;

    for (const [key, baseType] of baseKeys.entries()) {
        if (!targetKeys.has(key)) {
            errors.push(`[missing-key:${TARGET_LOCALE}] ${file} -> ${key}`);
            continue;
        }
        const targetType = targetKeys.get(key);
        if (targetType !== baseType) {
            errors.push(
                `[type-mismatch] ${file} -> ${key} (${BASE_LOCALE}:${baseType}, ${TARGET_LOCALE}:${targetType})`
            );
        }
    }

    for (const key of targetKeys.keys()) {
        if (!baseKeys.has(key)) {
            errors.push(`[missing-key:${BASE_LOCALE}] ${file} -> ${key}`);
        }
    }
}

if (errors.length) {
    console.error('i18n consistency check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log('i18n consistency check passed.');
