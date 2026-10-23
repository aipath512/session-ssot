// SESSION SSOT: 0008C
const GH = 'https://raw.githubusercontent.com/aipath512/session-ssot/main/session-ssot.json';
const TYPES = [
  [/text\/html/i, id => '<!-- SESSION SSOT: '+id+' -->'],
  [/(javascript|ecmascript)/i, id => '// SESSION SSOT: '+id],
  [/text\/css/i, id => '/* SESSION SSOT: '+id+' */'],
  [/(text\/plain|text\/markdown)/i, id => '<!-- SESSION SSOT: '+id+' -->']
];
const validId = id => /^\d{4,}[CHT]$/.test(id);
const firstLine = (body, header) => {
  if (body.startsWith(header+'\n') || body === header) return body;
  // Preserve mandatory leading declarations. Skip unsafe transformations.
  if (/^(#!|<\?xml|\uFEFF)/.test(body)) return null;
  return header+'\n'+body;
};
async function registry(env) {
  const url = env.SSOT_REGISTRY_URL || GH;
  const r = await fetch(url, {headers:{'Accept':'application/json'}, cf:{cacheTtl:60,cacheEverything:true}});
  if (!r.ok) throw new Error('Registry HTTP '+r.status);
  const obj = await r.json();
  const id = obj.current_session;
  if (!validId(id) || !Array.isArray(obj.sessions) || !obj.sessions.some(s=>s.id===id && s.status==='ACTIVE')) throw new Error('Invalid SSOT registry');
  return {id, obj};
}
function stampResponse(response,id,history) {
  const headers = new Headers(response.headers);
  headers.set('X-Session-SSOT',id);
  if(history?.length) headers.set('X-Session-SSOT-History',history.join(', '));
  headers.delete('Content-Length');
  headers.delete('Content-MD5');
  headers.delete('ETag');
  return headers;
}
export default {
  async fetch(request,env) {
    // Use service binding to avoid recursive route fetch; do not expose GitHub registry as a public write API.
    if (!env.UPSTREAM) return new Response('SSOT upstream service binding not configured', {status:503});
    const upstream = await env.UPSTREAM.fetch(request);
    let state;
    try { state = await registry(env); }
    catch (_) { return upstream; } // fail open for delivery; no invented session ID
    const {id} = state;
    const ct = upstream.headers.get('content-type') || '';
    const method = request.method.toUpperCase();
    if (method==='HEAD' || !['GET'].includes(method) || !upstream.ok || upstream.headers.has('content-range') ||
        upstream.headers.has('content-encoding') || upstream.headers.get('cache-control')?.includes('no-transform')) {
      return new Response(upstream.body,{status:upstream.status,statusText:upstream.statusText,headers:stampResponse(upstream,id)});
    }
    // Session history is entity-specific: only use explicit path mappings, never global sessions list.
    const pathname = new URL(request.url).pathname;
    const history = state.obj.entity_history?.[pathname];
    const lineage = Array.isArray(history) ? [...new Set(history.filter(validId))].sort((a,b)=>Number(b.slice(0,-1))-Number(a.slice(0,-1))) : [];
    const historyIds = [id,...lineage.filter(x=>x!==id)];
    const match = TYPES.find(([re])=>re.test(ct));
    const max = Number(env.MAX_TRANSFORM_BYTES || 262144);
    const length = Number(upstream.headers.get('content-length') || 0);
    if (!match || (length && length>max) || request.headers.has('range')) {
      return new Response(upstream.body,{status:upstream.status,statusText:upstream.statusText,headers:stampResponse(upstream,id,lineage)});
    }
    const body = await upstream.text();
    if(new TextEncoder().encode(body).byteLength>max) {
      return new Response(body,{status:upstream.status,statusText:upstream.statusText,headers:stampResponse(upstream,id,lineage)});
    }
    let output=body;
    // Retain only explicit, verifiable per-entity history; idempotent across cached/injected bodies.
    const prefix = historyIds.map(x=>match[1](x)).join('\n');
    const escaped = body.replace(/^(?:(?:<!-- SESSION SSOT: \d{4,}[CHT] -->|\/\/ SESSION SSOT: \d{4,}[CHT]|\/\* SESSION SSOT: \d{4,}[CHT] \*\/)\r?\n)+/,'');
    const candidate=firstLine(escaped,prefix);
    if(candidate!==null) output=candidate;
    const headers=stampResponse(upstream,id,lineage);
    if (output!==body) {
      // Original CSP/SRI or hashes can make body rewriting unsafe; allow disabling injection per deployment.
      if(env.ENABLE_BODY_INJECTION==='true') return new Response(output,{status:upstream.status,statusText:upstream.statusText,headers});
    }
    return new Response(body,{status:upstream.status,statusText:upstream.statusText,headers});
  }
};
