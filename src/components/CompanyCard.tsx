import { memo } from "react";
import { ArrowRight, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";
import { CompanyLogo } from "@/components/CompanyLogo";
import { isNullish, type CompanySummary } from "@/lib/companyData";
import { CATEGORY_COLORS } from "@/lib/college";

function Val({ v }: { v: string }) {
  return isNullish(v) ? <span className="italic text-muted-foreground">not publicly available</span> : <span>{v}</span>;
}

export const CompanyCard = memo(function CompanyCard({ company, onSelect }: { company: CompanySummary; onSelect: (c: CompanySummary) => void }) {
  const color = CATEGORY_COLORS[company.companyType];
  const negative = company.yoyGrowthRate.trim().startsWith("-");
  const Trend = negative ? TrendingDown : TrendingUp;
  return (
    <button
      type="button"
      onClick={() => onSelect(company)}
      className="group relative flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <CompanyLogo name={company.name} logoUrl={company.logoUrl} websiteUrl={company.websiteUrl} />
        <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ color, backgroundColor: `${color}14`, border: `1px solid ${color}40` }}>
          {company.companyType}
        </span>
      </div>
      <div>
        <h3 className="font-heading text-base font-semibold leading-tight">{company.name}</h3>
        <p className="text-sm text-muted-foreground">{company.shortName}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /><Val v={company.headquarters} /></li>
        <li className="flex items-center gap-2"><Users className="h-4 w-4 shrink-0" /><Val v={company.employeeSize} /></li>
        <li className={`flex items-center gap-2 ${negative ? "text-destructive" : ""}`}>
          <Trend className="h-4 w-4 shrink-0" />
          {isNullish(company.yoyGrowthRate) ? <Val v="" /> : <span>{company.yoyGrowthRate} YoY growth</span>}
        </li>
      </ul>
      <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
});
