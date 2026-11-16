## Colors

Use Midnight Petrol (`#05252E`) with Bone (`#F9F8F6`) text for primary actions
in light mode, and the inverse in dark mode, through the `primary` tokens.
Use Deep Teal (`#004444`) for verified states on light surfaces and Steel Mist
(`#A8C7D1`) on dark surfaces. Links and focus indicators use theme-aware `link`
and `ring` tokens; dark-mode links use light Twilight (`#A89ACB`).
Use `surface-canvas` (Bone), `surface-raised` (white), and `surface-muted`
(`#F0F4F4`), mapped to `#121212`, `#1C1C1E`, and `#2C2C2E` in dark mode.
Keep theme variables scoped to `.tinfoil-verification-theme` for embedding.

## Code Style Consistency

**Match the existing style of the codebase.**

Avoid introducing patterns that are inconsistent with the surrounding code:
- Don't add comments that wouldn't exist elsewhere in the file
- Don't add defensive checks or try/catch blocks in trusted/validated codepaths unless the codebase does this consistently
- Don't use type casts (e.g., `any`) to work around type issues—fix the underlying problem
- Follow the same patterns, naming conventions, and structure as nearby code

When in doubt, look at how similar code in the project handles the same situation.

## Code Comments

**Keep comments current and minimal.**

- Remove comments referencing old/removed functionality
- Don't describe what changed from previous versions
- Focus on explaining complex logic or business rules

## Icons and SVG Assets

**Never define SVG inline in component code.**

- Always use SVG files from `/public/icons/` directory
- Use `<img>` tag with `src="/icons/icon-name.svg"` or mask-based approach
- Keep SVG definitions separate from component logic for maintainability

## Content Security Policy

**Never add inline scripts or inline styles to the exported HTML.**

- The site ships as a static export under the fixed CSP in `webcat/webcat.config.json` (`script-src 'self'; style-src 'self'`)
- `npm test` serves the export under that CSP and fails on violations

## Performance

**Prioritize initial load and perceived speed.**

- **Parallel Loading**: Fetch independent data simultaneously
- **Cache First**: Show cached data immediately, update with fresh data
- **Lazy Loading**: Defer heavy dependencies and non-critical UI

Before adding dependencies:
1. Check bundle size impact
2. Lazy-load large libraries
3. Consider lighter alternatives

## Finishing Changes

**Group related changes into logical commits.**

When working through multiple tasks (TODOs, refactors, feature implementations):
1. Complete one logical unit of work
2. Summarize the changes and provide a short (<10 word) commit message
3. **Stop and wait** for confirmation before proceeding to the next task

This allows changes to be committed in meaningful groups rather than as one monolithic changeset.
