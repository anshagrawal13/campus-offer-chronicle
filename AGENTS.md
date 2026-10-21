<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Data flows seed/raw JSON -> pure normalizers in src/lib/companyData.ts -> UI; keeps the future database swap a one-file change.
- Selected company persists in localStorage "selected-company" via CompanyContext; /company/* pages redirect to / when missing, never 404.
- Routing uses TanStack file routes (the fixed stack), mirroring the requested React Router layout: /company layout with <Outlet />.
