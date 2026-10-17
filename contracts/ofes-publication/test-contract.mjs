import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
const root=new URL('.',import.meta.url);
const schema=JSON.parse(readFileSync(new URL('publication-manifest.schema.json',root),'utf8'));
const candidates=JSON.parse(readFileSync(new URL('synthetic-candidates.json',root),'utf8'));
const ajv=new Ajv2020({allErrors:true,strict:true,strictRequired:false});
addFormats(ajv);
const validate=ajv.compile(schema);
const allowed=new Set(Object.keys(schema.$defs.release.properties));
const approvedRefs=new Set(['public_test-farm','public_test-research']);
const rights=r=>r.facts_verified===true&&r.privacy_cleared===true&&r.rights_cleared===true&&r.authorization_confirmed===true;
function acceptable(r){
 if(r.status!=='published'||!rights(r))return false;
 if(Object.keys(r).some(k=>!allowed.has(k)))return false;
 if(r.public_project_ref&&!approvedRefs.has(r.public_project_ref))return false;
 if(r.public_entity_ref&&!approvedRefs.has(r.public_entity_ref))return false;
 if(r.public_research_ref&&!approvedRefs.has(r.public_research_ref))return false;
 if(r.media?.some(x=>!/^https:\/\/(?:tidalcrestgroup\.com|media\.tidalcrestgroup\.com)\//.test(x.public_url)))return false;
 return true;
}
function exportPublic(items){
 const releases=items.filter(acceptable).sort((a,b)=>a.publication_id.localeCompare(b.publication_id));
 return {schema_version:'0.2.0-draft',generated_at:'2026-10-17T00:00:00Z',releases};
}
const published=exportPublic(candidates);
assert.equal(published.releases.length,1);
assert.ok(validate(published),JSON.stringify(validate.errors));
function rejected(record,description){
 const manifest={...published,releases:[record]};
 assert.equal(validate(manifest),false,description);
}
const base=candidates[0];
rejected({...base,publication_id:undefined},'Missing required ID');
rejected({...base,published_at:'not-a-date'},'Malformed timestamp');
rejected({...base,publication_id:'INVALID'},'Invalid publication ID');
rejected({...base,unknown_internal_field:'secret'},'Unexpected field');
rejected({...base,kind:'research'},'Research fields required');
rejected({...base,kind:'entity'},'Entity public reference required');
rejected({...base,media:[{public_url:'https://tidalcrestgroup.com/public.png',alt:'',private_link:'hidden'}]},'Nested object restrictions');
const research={...base,publication_id:'pub_synthetic_research_01',kind:'research',public_research_ref:'public_test-research',research_output_type:'technical-note',review_label:'not-peer-reviewed',authors:['Synthetic Researcher']};
assert.ok(validate({schema_version:'0.2.0-draft',generated_at:'2026-10-17T00:00:00Z',releases:[research]}),JSON.stringify(validate.errors));
assert.equal(exportPublic([{...research,public_research_ref:'public_unapproved'}]).releases.length,0);
assert.equal(exportPublic([{...base,media:[{public_url:'file:///private/example',alt:'test'}]}]).releases.length,0);
assert.equal(exportPublic([{...base,summary:'SYNTHETIC_RESTRICTED_SITE_LAYOUT'}]).releases.length,1,'Text privacy requires separately authorized human review and cannot be proven by schema');
assert.deepEqual(exportPublic(candidates),exportPublic(candidates),'Deterministic ordering');
assert.equal(exportPublic([]).releases.length,0);
for(const term of ['SYNTHETIC_PRIVATE_CANONICAL_ID','SYNTHETIC_SECURITY_LAYOUT','SYNTHETIC_RESTRICTED_LOCATION']){
 assert.ok(!JSON.stringify(published).includes(term));
}
console.log('OFES draft v0.2 schema tests passed; content safety, revision conflict and takedown are NOT production validated.');
