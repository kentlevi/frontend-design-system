import type { FlagCode } from "~/data/flags"

/**
 * Shape of a locale object used in Nuxt i18n config
 */
export interface AppLocale {
  code: string        // "en", "fil", etc.
  name: string        // "English", "Filipino"
  file: string        // "en.json"
  flag: FlagCode      // "us", "ph" → must match your flags dataset
}