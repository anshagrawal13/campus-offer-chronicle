import { describe, expect, it } from "vitest";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeDashboardSkills, normalizeCompanyProfile, proficiencyToBloom, scoreToCriticality } from "@/lib/companyData";
import { buildIntelligenceSections } from "@/data/intelligenceData";

describe("company data", () => {
  const c = SEED_COMPANIES[0];
  it("builds 22 sections", () => expect(buildIntelligenceSections(normalizeCompanyProfile(c.full_json, c.short_json))).toHaveLength(22));
  it("12 skills with 10-level ladders, sorted desc", () => {
    const s = normalizeDashboardSkills(c.skill_levels);
    expect(s).toHaveLength(12);
    expect(s[0].score).toBe(8);
    expect(s.every((k) => k.topics.length === 10 && !k.topics.some((t) => t.topic === "Topic to be defined"))).toBe(true);
  });
  it("bloom mapping", () => { expect(proficiencyToBloom(2)).toBe("CU"); expect(proficiencyToBloom(8)).toBe("EV"); expect(proficiencyToBloom(9)).toBe("CR"); });
  it("criticality", () => { expect(scoreToCriticality(7)).toBe("Critical"); expect(scoreToCriticality(5)).toBe("Important"); expect(scoreToCriticality(4)).toBe("Baseline"); });
});
