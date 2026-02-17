import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

/* resolve directory of this script */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* absolute paths (safe on Windows/Mac/Linux) */
const SRC_DIR = path.resolve(__dirname, "src")
const PUBLIC_SPRITE = path.resolve(__dirname, "../../public/icons/sprite.svg")
const DATA_FILE = path.resolve(__dirname, "../../app/data/icons.ts")

fs.mkdirSync(path.dirname(PUBLIC_SPRITE), { recursive: true })
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })

const icons = {}
let symbols = ""

function normalizeName(folder, file) {
  let base = file.replace(".svg", "")
  base = base.replace(/^(l|r|s)\./, "")
  base = base.replace(/[._]/g, "-")

  let prefix = "brand"
  if (folder === "light") prefix = "light"
  else if (folder === "regular") prefix = "regular"
  else if (folder === "strong") prefix = "strong"
  else if (folder === "brand-icons") prefix = "brand"

  return `${prefix}-${base}`
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

walk(SRC_DIR)

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols}
</svg>`

fs.writeFileSync(PUBLIC_SPRITE, sprite)

fs.writeFileSync(
  DATA_FILE,
  `export const icons = ${JSON.stringify(icons, null, 2)} as const\n`
)

console.log("✅ Icons built → sprite + typed data")