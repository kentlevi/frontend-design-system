import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SRC_DIR = path.resolve(__dirname, "src")
const APP_DIR = path.resolve(__dirname, "../../app")
const ICON_SCAN_DIRS = [
  "components",
  "pages",
  "layouts",
  "composables",
  "middleware",
  "plugins",
  "utils",
]
const PUBLIC_SPRITE = path.resolve(__dirname, "../../public/icons/sprite.svg")
const DATA_FILE = path.resolve(__dirname, "../../app/data/icons.ts")
const GUIDE_ICONS_REF = process.env.GUIDE_ICONS_REF || "site-with-guide"

fs.mkdirSync(path.dirname(PUBLIC_SPRITE), { recursive: true })
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })

const icons = {}
let symbols = ""
const copiedFromGuide = []
const missingInGuide = []

function normalizeName(folder, file) {
  let base = file.replace(".svg", "")
  base = base.replace(/^(l|r|s|b)\./, "")
  base = base.replace(/[._]/g, "-")

  let prefix = "brand"
  if (folder === "light") prefix = "light"
  else if (folder === "regular") prefix = "regular"
  else if (folder === "strong") prefix = "strong"
  else if (folder === "brand-icons") prefix = "brand"

  return `${prefix}-${base}`
}

function getSourceFileFromIconName(iconName) {
  const [set, ...rest] = iconName.split("-")
  const base = rest.join("-")
  if (!set || !base) return null

  const folderMap = {
    light: "light",
    regular: "regular",
    strong: "strong",
    brand: "brand-icons",
  }
  const prefixMap = {
    light: "l",
    regular: "r",
    strong: "s",
    brand: "b",
  }

  const folder = folderMap[set]
  const prefix = prefixMap[set]
  if (!folder || !prefix) return null

  const file = `${prefix}.${base.replace(/-/g, ".")}.svg`
  return {
    folder,
    file,
    fullPath: path.join(SRC_DIR, folder, file),
  }
}

function collectUsedIconNames(dir) {
  const names = new Set()
  const codeFileExt = new Set([".vue", ".ts", ".js"])

  function walkFiles(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const full = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        walkFiles(full)
        continue
      }

      if (!codeFileExt.has(path.extname(entry.name))) continue

      const content = fs.readFileSync(full, "utf8")
      const patterns = [
        /\bname\s*=\s*["']((?:light|regular|strong|brand)-[a-z0-9-]+)["']/g,
        /\bicon\s*=\s*["']((?:light|regular|strong|brand)-[a-z0-9-]+)["']/g,
        /\b(?:name|icon)\s*:\s*["']((?:light|regular|strong|brand)-[a-z0-9-]+)["']/g,
      ]
      for (const pattern of patterns) {
        const matches = content.matchAll(pattern)
        for (const match of matches) {
          if (match[1]) names.add(match[1])
        }
      }
    }
  }

  for (const scanDir of ICON_SCAN_DIRS) {
    const full = path.join(dir, scanDir)
    if (fs.existsSync(full)) {
      walkFiles(full)
    }
  }

  return Array.from(names)
}

function copyMissingIconsFromGuide() {
  const usedIcons = collectUsedIconNames(APP_DIR)

  for (const iconName of usedIcons) {
    const source = getSourceFileFromIconName(iconName)
    if (!source) continue
    if (fs.existsSync(source.fullPath)) continue

    const guidePath = `app/icons/src/${source.folder}/${source.file}`
    try {
      const svg = execSync(`git show ${GUIDE_ICONS_REF}:${guidePath}`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      })
      fs.mkdirSync(path.dirname(source.fullPath), { recursive: true })
      fs.writeFileSync(source.fullPath, svg)
      copiedFromGuide.push(iconName)
    } catch {
      missingInGuide.push(iconName)
    }
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      walk(full)
      continue
    }

    if (!entry.name.endsWith(".svg")) continue

    const folder = path.basename(path.dirname(full))
    const svg = fs.readFileSync(full, "utf8")
    const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)
    if (!match) continue

    const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] || "0 0 24 24"
    const name = normalizeName(folder, entry.name)
    const id = `icon-${name}`

    symbols += `
  <symbol id="${id}" viewBox="${viewBox}">
    ${match[1].trim()}
  </symbol>`

    icons[name] = { id, viewBox }
  }
}

copyMissingIconsFromGuide()
walk(SRC_DIR)

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols}
</svg>`

fs.writeFileSync(PUBLIC_SPRITE, sprite)
fs.writeFileSync(
  DATA_FILE,
  `export const icons = ${JSON.stringify(icons, null, 2)} as const\n`
)

console.log("Icons built -> sprite + typed data")
if (copiedFromGuide.length) {
  console.log(
    `Auto-copied ${copiedFromGuide.length} icon(s) from ${GUIDE_ICONS_REF}: ${copiedFromGuide.join(", ")}`
  )
}
if (missingInGuide.length) {
  console.warn(
    `Missing icon source in ${GUIDE_ICONS_REF}: ${missingInGuide.join(", ")}`
  )
}
