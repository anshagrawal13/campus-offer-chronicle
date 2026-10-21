# JSS Academy Of Technical Education, Noida — Companies Research & Placement Analytics Portal

a.k.a. **JSSATEN Placement Intelligence Hub**.

- **Phase 1 is UI-only.** All data comes from the hardcoded seed in `src/data/seedCompanies.ts` (Accenture) plus `src/data/skillTopics.ts`. No database, no backend.
- **Fully public.** There is no login; every page is reachable by any visitor.
- **College:** COLLEGE_NAME = "JSS Academy Of Technical Education, Noida", COLLEGE_SHORT = "JSSATEN" (see `src/lib/college.ts`).
- **Phase 2** will swap the data source to a database. The normalizers in `src/lib/companyData.ts` already accept the raw `short_json` / `full_json` / `skill_levels` shapes, so only the data source changes.

Routes: `/` (company grid), `/company` → `/company/intelligence`, `/company/skills`.
Optional env: `VITE_LOGO_DEV_PUBLISHABLE_KEY` for Logo.dev logos.
CTC, stipend and selection ratio are never displayed.
