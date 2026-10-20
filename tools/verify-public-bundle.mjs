#!/usr/bin/env node
// Inspect only the publish directory, never deployment or remote resources.
import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {join,resolve,extname} from 'node:path';
const root=resolve(import.meta.dirname,'../dist-public');
const errors=[],files=[];
function walk(folder,rel=''){
 for(const name of readdirSync(folder)){
  const path=rel?rel+'/'+name:name,full=join(folder,name),st=statSync(full);
  if(st.isDirectory())walk(full,path);else files.push(path);
 }
}
if(!existsSync(root))throw Error('Run node tools/build-public.mjs before verifying bundle');
walk(root);
const fileSet=new Set(files);
if(fileSet.has('olayori-central.html'))errors.push('Private household application page must not ship');
if(fileSet.has('assets/contact-bg-clean@2x.webp'))errors.push('Obsolete Contact hero image must not ship');
for(const f of files){
 if(f.startsWith('.')||/(^|\/)(?:tools|docs|tests|\.github)\//.test(f))errors.push('Development artifact: '+f);
 if(/(?:\.env|\.md|\.mjs|\.map|\.json|\.yml|\.yaml|\.sh)$/i.test(f))errors.push('Unexpected public source artifact: '+f);
 if(extname(f)!=='.html')continue;
 const html=readFileSync(join(root,f),'utf8');
 if(/olayori-central\.html/i.test(html))errors.push('Public page references private household application: '+f);
 if(!/<title>[^<]+<\/title>/i.test(html))errors.push('Missing title: '+f);
 for(const m of html.matchAll(/(?:href|src)=(["'])(.*?)\1/g)){
  const ref=m[2];
  if(/^(?:https?:|mailto:|tel:|data:|#)/i.test(ref))continue;
  const clean=ref.split(/[?#]/)[0];
  if(!clean||clean.startsWith('/')||clean.includes('..'))continue;
  if(!fileSet.has(clean))errors.push('Broken publish link: '+f+' -> '+clean);
 }
}
console.log(JSON.stringify({state:errors.length?'BLOCKED':'PUBLIC_BUNDLE_VALIDATED',files:files.length,htmlPages:files.filter(x=>x.endsWith('.html')).length,errors,deployAuthorized:false},null,2));
if(errors.length)process.exitCode=1;
