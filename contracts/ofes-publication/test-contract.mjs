import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('.',import.meta.url);
const candidates=JSON.parse(readFileSync(new URL('synthetic-candidates.json',root),'utf8'));
const schema=JSON.parse(readFileSync(new URL('publication-manifest.schema.json',root),'utf8'));
const allowed=new Set(Object.keys(schema.$defs.release.properties));
const required=schema.$defs.release.required;
const types=new Set(schema.$defs.release.properties.kind.enum);
const canPublish=r=>r.status==='published'&&r.facts_verified===true&&r.privacy_cleared===true&&r.rights_cleared===true&&r.authorization_confirmed===true&&Number.isInteger(r.revision)&&r.revision>0&&types.has(r.kind)&&typeof r.publication_id==='string'&&typeof r.title==='string'&&typeof r.summary==='string'&&typeof r.published_at==='string';
const exportPublic=(items)=>({schema_version:schema.properties.schema_version.const,generated_at:'2026-10-17T00:00:00Z',releases:items.filter(canPublish).map(item=>Object.fromEntries(Object.entries(item).filter(([key])=>allowed.has(key))))});
const result=exportPublic(candidates);
assert.equal(result.releases.length,1,'Only the approved synthetic release may export');
assert.equal(result.releases[0].publication_id,'pub_synthetic_public_01');
for(const record of result.releases){
 for(const key of required)assert.ok(Object.hasOwn(record,key),'Missing required field '+key);
 for(const key of Object.keys(record))assert.ok(allowed.has(key),'Non-allowlisted field '+key);
 assert.equal(record.status,'published');
}
for(const word of ['SYNTHETIC_PRIVATE_CANONICAL_ID','SYNTHETIC_SECURITY_LAYOUT','SYNTHETIC_RESTRICTED_LOCATION','pub_synthetic_withdrawn_03','pub_synthetic_superseded_04']){
 assert.equal(JSON.stringify(result).includes(word),false,'Restricted or inactive data leaked: '+word);
}
assert.equal(result.releases.some(r=>r.status!=='published'),false);
assert.equal(exportPublic([]).releases.length,0,'Empty release input must be safe');
const malformed={...candidates[0],privacy_cleared:false};
assert.equal(exportPublic([malformed]).releases.length,0,'Non-cleared records cannot publish');
console.log('OFES contract synthetic compatibility tests passed: allowlist, lifecycle, rights/privacy/authorization, restricted fields, empty fallback.');
