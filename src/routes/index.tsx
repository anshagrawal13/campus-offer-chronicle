import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeCompanySummary, type CompanySummary, type CompanyType } from "@/lib/companyData";
import { CompanyCard } from "@/components/CompanyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/context/CompanyContext";
import { CATEGORY_COLORS, COLLEGE_SHORT, PORTAL_TITLE } from "@/lib/college";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Companies | ${COLLEGE_SHORT} Placement Intelligence Hub` },
      { name: "description", content: "Research recruiting companies and prepare for campus placements at JSSATEN." },
      { property: "og:title", content: `${COLLEGE_SHORT} Placement Intelligence Hub` },
      { property: "og:description", content: "Research recruiting companies and prepare for campus placements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const FILTERS: ("All" | CompanyType)[] = ["All", "Super Dream", "Dream", "Standard", "Regular"];

function Index() {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 250); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setTimeout(() => setDebounced(query), 200); return () => clearTimeout(t); }, [query]);

  const companies = useMemo(() => SEED_COMPANIES.map((c) => normalizeCompanySummary(c.short_json, c.company_id)), []);
  const searched = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return q ? companies.filter((c) => `${c.name} ${c.shortName} ${c.headquarters}`.toLowerCase().includes(q)) : companies;
  }, [companies, debounced]);
  const visible = filter === "All" ? searched : searched.filter((c) => c.companyType === filter);

  const onSelect = useCallback((c: CompanySummary) => {
    selectCompany({ companyId: c.companyId, companyName: c.name, logoUrl: c.logoUrl });
    navigate({ to: "/company/intelligence" });
  }, [selectCompany, navigate]);

  const reset = () => { setQuery(""); setDebounced(""); setFilter("All"); };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
          <span className="inline-block rounded-full border bg-secondary px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
            {COLLEGE_SHORT} · INTELLIGENCE PLATFORM
          </span>
          <h1 className="mt-4 max-w-4xl font-heading text-2xl font-semibold tracking-tight sm:text-4xl">{PORTAL_TITLE}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Your strategic edge for campus placements</p>
          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies by name or location"
              aria-label="Search companies"
              className="h-11 w-full rounded-lg border bg-card pl-9 pr-9 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const count = f === "All" ? searched.length : searched.filter((c) => c.companyType === f).length;
            const color = f === "All" ? undefined : CATEGORY_COLORS[f];
            const active = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${active && !color ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}
                style={color ? (active ? { backgroundColor: color, borderColor: color, color: "#fff" } : { color, borderColor: `${color}55` }) : undefined}>
                {f}
                <span className="rounded-full bg-secondary px-1.5 text-xs text-secondary-foreground">{count}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border bg-card py-16 text-center">
            <SearchX className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-heading font-semibold">No companies match</p>
            <p className="text-sm text-muted-foreground">Try a different search or category.</p>
            <Button variant="outline" className="mt-4" onClick={reset}>Reset filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((c) => <CompanyCard key={c.companyId} company={c} onSelect={onSelect} />)}
          </div>
        )}
      </main>
    </div>
  );
}
