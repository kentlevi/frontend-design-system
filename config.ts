// config.ts
import fs from "node:fs";
import path from "node:path";
import { config as dotenvConfig } from "dotenv";

export function loadAppEnv() {
    const envName = process.env.ENV;

    const allowed = ["development", "homestead", "production"];
    if (!allowed.includes(envName)) {
        throw new Error(`[env] Invalid ENV "${envName}"`);
    }

    // supports your old style: .homestead.env
    const preferred = path.resolve(process.cwd(), `.${envName}.env`);

    // supports your new style too: environments/.env.homestead (optional)
    const alt = path.resolve(process.cwd(), `environments/.env.${envName}`);

    // fallback
    const fallback = path.resolve(process.cwd(), ".env");

    const selected =
        (fs.existsSync(preferred) && preferred) ||
        (fs.existsSync(alt) && alt) ||
        fallback;

    dotenvConfig({ path: selected });

    // Optional: log once so you know what loaded (remove if you want)
    // console.log(`[env] loaded: ${selected}`);
}
