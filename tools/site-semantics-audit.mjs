#!/usr/bin/env node
// Audit public document semantics and links, without network calls or deployment.
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const dir=resolve(import.meta.dirname,'../dist-public');
if(!existsSync(dir))throw Error('Build dist-public first');
const pages=readdirSync(dir).filter(p=>p.endsWith('.html'));
const errors=[],warnings=[];
let mailtos=0,fragments=0;
const verifiedWorkspaceAddresses=new Set(['info','developments','agro','farms','careers','foundation','investments']);
const futureAddresses=new Set(['foods','processing','supplychain','logistics','technology','infrastructure','media','hospitality','research','projects','partnerships','suppliers']);
for(const page of pages){
 const html=readFileSync(join(dir,page),'utf8');
 const ids=new Set([...html.matchAll(/\bid=(["'])([^"']+)\1/g)].map(m=>m[2]));
 if(!/\bname=["']viewport["']/i.test(html))warnings.push(page+': no viewport metadata');
 if(!/<main\b/i.test(html))warnings.push(page+': no main landmark');
 const images=[...html.matchAll(/<img\b[^>]*>/gi)];
 for(const image of images)if(!/\balt=(["']).*?\1/i.test(image[0]))warnings.push(page+': image lacks explicit alt attribute');
 for(const m of html.matchAll(/\bhref=(["'])([^"']+)\1/g)){
  const href=m[2].replaceAll('&amp;','&');
  if(/^mailto:/i.test(href)){
   mailtos++;
   const address=href.slice(7).split('?')[0].toLowerCase();
   if(!/^[a-z0-9._%+-]+@tidalcrestgroup\.com$/.test(address))warnings.push(page+': non-corporate email target');
   continue;
  }
  if(!href.startsWith('#'))continue;
  const id=decodeURIComponent(href.slice(1));
  if(!id)continue;fragments++;
  if(!ids.has(id))warnings.push(page+': unresolved fragment #'+id);
 }
}
console.log(JSON.stringify({state:errors.length?'BLOCKED':'AUDIT_COMPLETE',pages:pages.length,mailtos,fragments,warnings,errors,productionDeployAuthorized:false},null,2));
if(errors.length)process.exitCode=1;
