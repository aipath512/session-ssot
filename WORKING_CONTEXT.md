# WORKING CONTEXT — 0008C

Status: provisional snapshot, requires ongoing manual updates.
Session: 0008C ACTIVE; 0007H FROZEN.
Authoritative current session ID: `session-ssot.json`.

## Objective

Maintain cross-conversation continuity for AiVenture at zero additional Cloudflare infrastructure cost while full SESSION SSOT v1.5 remains unimplemented.

## Important scope

Four future ADI pilot sites: aiventure.ro, 5thelement.ai, firmsfinder.eu, aireadyinjector.com.
ecbtax.com is an external partner and excluded from automatic AiVenture deployments.

## Architectural policies

P01–P18 are specified, not proven deployed. P09: one lifetime T per H family, even after promotion/trash. P18: fail-closed writes; signed verified stale projection only, not yet implemented.

## Current operational position

- GitHub repo `aipath512/session-ssot` created.
- `session-ssot.json` records 0007H and 0008C.
- No Cloudflare Worker, D1, R2, or KV created for SSOT LITE.
- GitHub file commits are manual; ChatGPT conversation content is NOT automatically archived.
- SESSION SSOT v1.5 remains an engineering draft and cannot be represented as deployed.

## Next action

For each significant task, record verified result, pending actions, and relevant links here or in dedicated project files. Keep entries concise and dated. At new-chat startup, re-read this file from GitHub.
