import { createFileRoute } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Linkedin, PlayCircle, Star } from "lucide-react";
import { useCompany, getSeedCompany } from "@/context/CompanyContext";
import { isNullish, normalizeCompanyProfile, splitItems } from "@/lib/companyData";
import { buildIntelligenceSections, type IntelSection } from "@/data/intelligenceData";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/company/intelligence")({
  head: () => ({
    meta: [
      { title: "Company Intelligence | JSSATEN Placement Intelligence Hub" },
      { name: "description", content: "22-section research profile of the selected recruiting company." },
      { property: "og:title", content: "Company Intelligence | JSSATEN" },
      { property: "og:description", content: "Deep research profile of recruiting companies for JSSATEN students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CompanyIntelligence,
});

const Pill = ({ children, muted }: { children: React.ReactNode; muted?: boolean }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${muted ? "bg-muted text-muted-foreground italic" : "bg-secondary text-secondary-foreground"}`}>{children}</span>
);

function renderValue(key: string, v?: string) {
  if (v === undefined || isNullish(v)) return <Pill muted>Not Available</Pill>;
  if (/^https?:\/\//.test(v)) {
    const video = /youtube|vimeo|video/i.test(v) || key.includes("video");
    return (
      <a href={v} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 break-all text-[#2563EB] hover:underline">
        {video ? <PlayCircle className="h-4 w-4 shrink-0" /> : <ExternalLink className="h-4 w-4 shrink-0" />}{v}
      </a>
    );
  }
  if (key.endsWith("_email") || key.includes("contact_email")) return <a href={`mailto:${v}`} className="text-[#2563EB] hover:underline">{v}</a>;
  const rating = v.match(/^(\d(?:\.\d)?)\s*\/\s*5$/);
  if (rating) {
    const n = Number(rating[1]);
    return (
      <span className="inline-flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(n) ? "fill-[#eab308] text-[#eab308]" : "text-muted-foreground/40"}`} />)}
        <span className="ml-1 font-medium">{v}</span>
      </span>
    );
  }
  if (v.length > 140 && !v.includes(";")) return <p className="leading-relaxed">{v}</p>;
  if (v.includes(";")) {
    const items = splitItems(v);
    if (items.every((i) => i.length <= 40)) return <div className="flex flex-wrap gap-1.5">{items.map((i) => <Pill key={i}>{i}</Pill>)}</div>;
    return <ul className="list-disc space-y-1 pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul>;
  }
  if (v.split(", ").length >= 3 && v.length <= 80 && v.split(",").every((p) => p.trim().length <= 25 && p.trim().split(" ").length <= 3)) {
    return <div className="flex flex-wrap gap-1.5">{v.split(",").map((i) => <Pill key={i}>{i.trim()}</Pill>)}</div>;
  }
  return <span>{v}</span>;
}

const FieldRow = ({ label, k, value }: { label: string; k: string; value?: string }) => (
  <div className="flex flex-col gap-1 border-b py-3 last:border-0 sm:flex-row sm:gap-4">
    <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">{label}</dt>
    <dd className="text-sm sm:w-2/3">{renderValue(k, value)}</dd>
  </div>
);

const SectionCard = memo(function SectionCard({ section }: { section: IntelSection }) {
  const filled = section.fields.filter((f) => !isNullish(f.value)).length;
  const Icon = section.icon;
  return (
    <section id={section.id} data-section className="scroll-mt-32 rounded-xl border bg-card p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary"><Icon className="h-4 w-4 text-[#2563EB]" /></div>
        <h2 className="font-heading text-base font-semibold sm:text-lg">{section.title}</h2>
        <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{filled}/{section.fields.length}</span>
      </div>
      <dl>{section.fields.map((f) => <FieldRow key={f.key} k={f.key} label={f.label} value={f.value} />)}</dl>
    </section>
  );
});

function CompanyIntelligence() {
  const { selected } = useCompany();
  const seed = getSeedCompany(selected?.companyId);
  const profile = useMemo(() => (seed ? normalizeCompanyProfile(seed.full_json, seed.short_json) : undefined), [seed]);
  const sections = useMemo(() => buildIntelligenceSections(profile), [profile]);
  const [active, setActive] = useState(0);
  const isScrollingRef = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      if (isScrollingRef.current) return;
      const els = document.querySelectorAll<HTMLElement>("[data-section]");
      let idx = 0;
      els.forEach((el, i) => { if (el.getBoundingClientRect().top < 160) idx = i; });
      setActive(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const scrollToSection = useCallback((idx: number) => {
    isScrollingRef.current = true;
    setActive(idx);
    document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, []);

  if (!seed || !profile) return null;

  return (
    <div>
      <div className="sticky top-0 z-20 border-b bg-card">
        <div className="flex items-center gap-3 px-4 py-3">
          <CompanyLogo name={profile["name"]} logoUrl={profile["logo_url"]} websiteUrl={profile["website_url"]} className="h-10 w-10" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-base font-semibold sm:text-lg">{profile["name"]}</h1>
            <span className="inline-flex rounded-full bg-[#EFF6FF] px-2 py-0.5 text-xs font-medium text-[#2563EB]">{profile["category"]}</span>
          </div>
          {!isNullish(profile["website_url"]) && (
            <Button asChild size="sm" variant="outline"><a href={profile["website_url"]} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /><span className="hidden sm:inline">Website</span></a></Button>
          )}
          {!isNullish(profile["linkedin_url"]) && (
            <Button asChild size="sm" variant="outline"><a href={profile["linkedin_url"]} target="_blank" rel="noreferrer"><Linkedin className="h-4 w-4" /><span className="hidden sm:inline">LinkedIn</span></a></Button>
          )}
        </div>
        <div className="flex gap-1 overflow-x-auto px-2 pb-2 [scrollbar-width:none]">
          {sections.map((s, i) => (
            <button key={s.id} ref={(el) => { tabRefs.current[i] = el; }} onClick={() => scrollToSection(i)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${active === i ? "bg-[#EFF6FF] text-[#2563EB]" : "text-muted-foreground hover:bg-secondary"}`}>
              {s.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-5xl space-y-4 p-4">
        {sections.map((s) => <SectionCard key={s.id} section={s} />)}
      </div>
    </div>
  );
}
