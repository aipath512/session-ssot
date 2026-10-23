# START HERE — SESSION SSOT LITE

Canonical repository: https://github.com/aipath512/session-ssot

## Mandatory restart procedure for any new ChatGPT conversation

1. Fetch `session-ssot.json` from this repository, never guess current session.
2. Read `START_HERE.md` and `WORKING_CONTEXT.md`.
3. Check the latest GitHub commit and distinguish verified facts from planned work.
4. Tell the user: current session, current priority, next step, any missing context.
5. Do not claim automatic synchronization of ChatGPT conversations. Record material decisions in GitHub only when requested or authorized.
6. Do not deploy or create paid Cloudflare resources without explicit approval.

## Message to paste in a new conversation

"SESSION SSOT: citește repository-ul GitHub aipath512/session-ssot, fișierele session-ssot.json, START_HERE.md și WORKING_CONTEXT.md. Verifică sesiunea curentă, rezumă unde am rămas și continuă de acolo. Nu presupune că memoria conversației este completă."

## Roles

User approves priorities and changes; assistant fetches context, explains actions, and verifies any commits. This is a manual GitHub-based continuity protocol, not a Cloudflare SSOT v1.5 implementation.

## Mandatory v1.6 file annotation rule

Before creating or editing eligible text source files, read `FILE_HEADER_POLICY.md`. The active session ID must be inserted as a language-compatible comment at the earliest safe line in file content, never as a filename prefix. Respect JSON/binary/mandatory first-line exceptions. This is currently a manual assistant workflow, not an installed GitHub Action.
