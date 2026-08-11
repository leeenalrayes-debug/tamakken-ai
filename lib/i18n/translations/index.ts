import type { Locale } from "../config";
import { en } from "./en";
import { ar } from "./ar";

export type Translations = typeof en;

export const translations: Record<Locale, Translations> = { en, ar };
