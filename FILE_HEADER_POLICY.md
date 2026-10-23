# SESSION SSOT v1.6 — FILE HEADER POLICY

Status: APPROVED BY USER, documented; automatic enforcement NOT DEPLOYED.
Active session identifier: read `session-ssot.json` at operation time; never hard-code `0008C` as a permanent rule.

## Requirement

For each eligible text source file generated or intentionally modified/uploaded through the assistant workflow, insert the active SESSION SSOT identifier as a comment on the FIRST line of file CONTENT, NOT in the filename. Preserve filename and remaining content. Avoid duplicate headers; if a header exists, validate it and do not silently rewrite historical frozen identifiers. Existing repository files are not mass-rewritten without authorization.

## Language-specific first-line examples (active session 0008C)

HTML: `<!-- SESSION SSOT: 0008C -->`
JavaScript / TypeScript: `// SESSION SSOT: 0008C`
Python / YAML / shell (where syntactically valid): `# SESSION SSOT: 0008C`
CSS: `/* SESSION SSOT: 0008C */`
SQL: `-- SESSION SSOT: 0008C`
Markdown: `<!-- SESSION SSOT: 0008C -->`

## Exceptions and compatibility

- JSON does NOT allow comments. Do not add a comment that breaks parsing. Use an approved schema-compatible metadata field, or a separate sidecar manifest if the schema cannot change.
- Do not inject a comment before a mandatory shebang (`#!`), XML declaration, encoding declaration, or other mandatory first-line syntax. Record session metadata at the earliest safe location or in a sidecar. Validity takes precedence over literal first-line placement.
- Never inject text into binary files (PDF, PNG, JPEG, ZIP, DOCX, XLSX, etc.). Use a sidecar manifest or format-native metadata if explicitly approved.
- For signed, generated, vendor-managed, or checksummed files, do not alter content without verifying the impact.
- Existing frozen artifacts remain immutable; annotate a new copy if needed.

## Workflow

1. Read current session from GitHub registry before writing.
2. Detect file type and any mandatory leading syntax.
3. Insert exactly one compatible comment header at the first safe position.
4. Validate syntax/parse, check that content except header is unchanged.
5. Upload or commit only when user has authorized the operation.
6. Report file path, session identifier, verification and commit SHA.

## Automation status

This rule is documented, not automatically enforced on arbitrary direct GitHub uploads. Enforcing it for all GitHub commits requires a separate configured workflow (GitHub Action or pre-commit hook), testing and authorization. ChatGPT uploads do not trigger automatic repository changes.

## Effective date and rollout decision

Effective date: 2026-10-23 (user-authorized policy adoption).
Scope immediately: eligible new files created or modified by assistant workflows in authorized AiVenture repositories. Active session ID is read from session-ssot.json at each operation.
Existing files: inventory and proposed backfill only, no automatic mass rewrite, historical reattribution, or deployment without separate approval.
Central Worker + GitHub webhook/App: preferred future enforcement architecture, NOT deployed. GitHub Actions fallback also NOT deployed. No claim of automatic GitHub interception.
