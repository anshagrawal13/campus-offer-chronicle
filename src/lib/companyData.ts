// Pure normalizers. Inputs are raw JSON shapes (short_json / full_json / skill_levels) so
// Phase 2 can pipe database rows in untouched.
import { SKILL_TOPICS } from "@/data/skillTopics";

export type CompanyType = "Super Dream" | "Dream" | "Standard" | "Regular";
export type Difficulty = "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";
export type Bloom = "CU" | "AP" | "AS" | "EV" | "CR";
export type Criticality = "Critical" | "Important" | "Baseline";

export interface CompanySummary {
  companyId: number;
  name: string;
  shortName: string;
  logoUrl: string;
  category: string;
  companyType: CompanyType;
  incorporationYear: string;
  employeeSize: string;
  headquarters: string;
  operatingCountries: string;
  officeLocations: string;
  yoyGrowthRate: string;
  websiteUrl: string;
}

export type CompanyProfile = Record<string, string>;

export interface DashboardSkill {
  id: number;
  name: string;
  score: number;
  proficiency: string;
  bloom: Bloom;
  criticality: Criticality;
  difficulty: Difficulty;
  topics: { level: number; topic: string }[];
}

// Banned fields: never surfaced anywhere.
const BANNED = /ctc|stipend|selection_ratio/i;

export function asString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(asString).join("; ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v).trim();
}

export function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

export function splitItems(v: string): string[] {
  return v
    .split(/\n|;|•|\u2022|\.(?=\s+[A-Z])/)
    .map((s) => s.trim().replace(/^[-*]\s*/, ""))
    .filter(Boolean);
}

export function titleCaseFromCode(code: string): string {
  return code
    .split("_")
    .map((w) => (w.length <= 3 && /^(tam|sam|som|ceo|esg|csr|ai|ml|cac|ltv|yoy)$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export function scoreToDifficulty(score: number): Difficulty {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
}

export function proficiencyToBloom(level: number): Bloom {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
}

export function scoreToCriticality(score: number): Criticality {
  if (score >= 7) return "Critical";
  if (score >= 5) return "Important";
  return "Baseline";
}

export function isNullish(v: unknown): boolean {
  const s = asString(v).toLowerCase();
  return ["", "na", "n/a", "none", "-", "null", "undefined"].includes(s);
}

function toCompanyType(v: unknown): CompanyType {
  const s = asString(v).toLowerCase();
  if (s.includes("super")) return "Super Dream";
  if (s.includes("dream")) return "Dream";
  if (s.includes("standard")) return "Standard";
  return "Regular";
}

export function normalizeCompanySummary(shortJson: unknown, companyId = 0): CompanySummary {
  const r = asRecord(shortJson);
  return {
    companyId,
    name: asString(r.name),
    shortName: asString(r.short_name) || asString(r.name),
    logoUrl: asString(r.logo_url),
    category: asString(r.category),
    companyType: toCompanyType(r.company_type),
    incorporationYear: asString(r.incorporation_year),
    employeeSize: asString(r.employee_size),
    headquarters: asString(r.headquarters_address),
    operatingCountries: asString(r.operating_countries),
    officeLocations: asString(r.office_locations),
    yoyGrowthRate: asString(r.yoy_growth_rate),
    websiteUrl: asString(r.website_url),
  };
}

export function normalizeCompanyProfile(fullJson: unknown, shortJson: unknown): CompanyProfile {
  const merged = { ...asRecord(shortJson), ...asRecord(fullJson) };
  const out: CompanyProfile = {};
  for (const [k, v] of Object.entries(merged)) {
    if (BANNED.test(k)) continue;
    out[k] = asString(v);
  }
  return out;
}

export function normalizeDashboardSkills(skillLevels: unknown): DashboardSkill[] {
  const arr = Array.isArray(skillLevels) ? skillLevels : [];
  return arr
    .map((raw) => {
      const r = asRecord(raw);
      const id = Number(r.skill_set_id) || 0;
      const score = Math.max(0, Math.min(10, Number(r.required_level) || 0));
      const ladder = SKILL_TOPICS[id] ?? [];
      return {
        id,
        name: asString(r.skill_set_name),
        score,
        proficiency: asString(r.required_proficiency),
        bloom: proficiencyToBloom(score),
        criticality: scoreToCriticality(score),
        difficulty: scoreToDifficulty(score),
        topics: Array.from({ length: 10 }, (_, i) => ({ level: i + 1, topic: ladder[i] ?? "Topic to be defined" })),
      };
    })
    .sort((a, b) => b.score - a.score);
}
