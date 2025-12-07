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