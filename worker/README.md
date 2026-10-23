<!-- SESSION SSOT: 0008C -->
# SESSION SSOT Header Worker — deployment candidate

**Status:** SOURCE IMPLEMENTED, NOT DEPLOYED. No Cloudflare account connection is available in this workflow.

This Worker reads the current session from the public GitHub SSOT registry and adds `X-Session-SSOT` to proxied responses. For HTML/JS/CSS/Markdown it can prepend a session comment when `ENABLE_BODY_INJECTION=true`. Body injection is disabled by default to prevent accidental breakage.

## Deployment prerequisites

1. Verify which existing Cloudflare Worker serves each site and its current routes.
2. Configure `UPSTREAM` service binding to that Worker, or integrate this module directly into the existing Worker. Avoid recursive routing.
3. Test on a workers.dev preview domain first. Verify CSP, caching, Content-Type, scripts, and HTML rendering.
4. Enable body injection only after tests; route production traffic only with approval.
5. If GitHub is unavailable, pass upstream response unchanged rather than fabricating an identifier.
6. Registry is public. NEVER store private conversation summaries in this public repository.

## Important boundaries

- Retroactive means responses for existing pages are stamped when served, **not** historical GitHub commits rewritten.
- Entity-specific history requires verified `entity_history` mappings in the registry; no historical file attribution is inferred from the global sessions array.
- JSON is never mutated by this initial release: `X-Session-SSOT` works without breaking strict JSON schemas.
- Binary assets and non-GET requests are not rewritten.
- Source repository writes, conversation capture, and Cloudflare deployment are separate features, not implemented by this Worker.
- Some content-security policies, signatures, caches, and SRI require site-specific validation before HTML/script injection.
- Cloudflare costs and permissions must be checked before deployment.
