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

- Use TanStack file routes for distinct product views and route-derived conversation IDs; this preserves navigation and reload isolation.
- Use authenticated server functions and owner-scoped RLS for private records; the browser cannot authorize actions itself.
- Keep AI streaming and tools in server-only modules with a finite action allowlist; proposals are stored separately from explicit execution approval.
- Use AI Elements for chat composition and semantic global design tokens for visual styling; shared primitives remain consistent.
