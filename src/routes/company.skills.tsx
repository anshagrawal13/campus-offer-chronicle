import { createFileRoute } from "@tanstack/react-router";
import { memo, useMemo, useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { useCompany, getSeedCompany } from "@/context/CompanyContext";
import { normalizeDashboardSkills, type Criticality, type DashboardSkill } from "@/lib/companyData";
import { CompanyLogo } from "@/components/CompanyLogo";
import { BLOOM_COLORS, BLOOM_LABELS } from "@/lib/college";

export const Route = createFileRoute("/company/skills")({
  head: () => ({
    meta: [
      { title: "Skill Intelligence | JSSATEN Placement Intelligence Hub" },
      { name: "description", content: "Required skills, Bloom levels and 10-level roadmaps for the selected company." },
      { property: "og:title", content: "Skill Intelligence | JSSATEN" },
      { property: "og:description", content: "Skill roadmaps to prepare for campus placements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SkillIntelligence,
});

const CRIT: Record<Criticality, { color: string; desc: string }> = {
  Critical: { color: "#ef4444", desc: "Score ≥ 7 — must master before interviews" },
  Important: { color: "#d97706", desc: "Score 5–6 — strong working knowledge" },
  Baseline: { color: "#16a34a", desc: "Score < 5 — foundational familiarity" },
};

const SkillCard = memo(function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [open, setOpen] = useState(false);
  const color = BLOOM_COLORS[skill.bloom];
  const crit = CRIT[skill.criticality];
  return (
    <div className="rounded-xl border bg-card">
      <button onClick={() => setOpen((o) => !o)} className="w-full p-4 text-left" aria-expanded={open}>
        <div className="flex items-center gap-2">
          <h3 className="flex-1 font-heading text-sm font-semibold sm:text-base">{skill.name}</h3>
          <span className="rounded px-1.5 py-0.5 text-xs font-bold" style={{ color, backgroundColor: `${color}1f` }}>{skill.bloom}</span>
          <span className="text-sm font-semibold">{skill.score}/10</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full" style={{ width: `${skill.score * 10}%`, backgroundColor: color }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-medium" style={{ color: crit.color }}>{skill.criticality}</span>
          <span className="text-muted-foreground">{skill.proficiency}</span>
        </div>
      </button>
      {open && (
        <ol className="border-t px-4 py-3">
          {skill.topics.map((t) => {
            const locked = t.level > skill.score;
            return (
              <li key={t.level} className={`flex items-center gap-3 py-1.5 text-sm ${locked ? "text-muted-foreground/60" : ""}`}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={locked ? undefined : { backgroundColor: `${color}1f`, color }}>
                  {locked ? <Lock className="h-3.5 w-3.5" /> : t.level}
                </span>
                <span className="flex-1">{t.topic}</span>
                {locked && <span className="text-xs italic">Beyond scope</span>}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
});

function SkillIntelligence() {
  const { selected } = useCompany();
  const seed = getSeedCompany(selected?.companyId);
  const skills = useMemo(() => normalizeDashboardSkills(seed?.skill_levels), [seed]);
  if (!seed || !selected) return null;
  const shortName = String(seed.short_json.short_name ?? selected.companyName);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <div className="flex items-center gap-3 border-b pb-4">
        <CompanyLogo name={selected.companyName} logoUrl={selected.logoUrl} websiteUrl={String(seed.short_json.website_url ?? "")} />
        <div>
          <h1 className="font-heading text-xl font-semibold sm:text-2xl">{shortName} Skill Intelligence</h1>
          <p className="text-sm text-muted-foreground">{skills.length} skills required, sorted by importance</p>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bloom levels</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {(Object.keys(BLOOM_COLORS) as (keyof typeof BLOOM_COLORS)[]).map((b) => (
            <div key={b} className="rounded-lg border p-2.5" style={{ backgroundColor: `${BLOOM_COLORS[b]}12`, borderColor: `${BLOOM_COLORS[b]}40` }}>
              <p className="text-sm font-bold" style={{ color: BLOOM_COLORS[b] }}>{b}</p>
              <p className="text-xs text-muted-foreground">{BLOOM_LABELS[b]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(Object.keys(CRIT) as Criticality[]).map((c) => (
          <div key={c} className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold" style={{ color: CRIT[c].color }}>{c}</p>
            <p className="text-xs text-muted-foreground">{CRIT[c].desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {skills.map((s) => <SkillCard key={s.id} skill={s} />)}
      </div>
    </div>
  );
}
