#!/usr/bin/env node
// Consolidated release candidate acceptance checklist. No deploy or external requests.
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..'),pub=join(root,'dist-public');
const failures=[],pending=[];
const config=JSON.parse(readFileSync(join(root,'firebase.json'),'utf8'));
if(config.hosting.public!=='dist-public')failures.push('Hosting must publish isolated dist-public');
if(!existsSync(join(pub,'index.html')))failures.push('Public build missing');
const pages=existsSync(pub)?readdirSync(pub).filter(x=>x.endsWith('.html')):[];
for(const page of pages){
 const html=readFileSync(join(pub,page),'utf8');
 if(/Tidal Crest Capital Limited|contact-bg-clean@2x\.webp/i.test(html))failures.push('Obsolete branding '+page);
 if(/mailto:(?:foods|processing|supplychain|logistics|technology|infrastructure|media|hospitality|research|projects|partnerships|suppliers)@tidalcrestgroup\.com/i.test(html))failures.push('Unverified mail link '+page);
}
if(pages.length<10)failures.push('Public site has unexpectedly few pages: '+pages.length);
pending.push('Owner-approved visual review of desktop, tablet, mobile and Safari');
pending.push('Review of official crest and hero imagery');
pending.push('Live inbound/reply validation for proposed dedicated Google Workspace addresses');
pending.push('Explicit approval before merge or Firebase deployment');
console.log(JSON.stringify({status:failures.length?'TECHNICAL_BLOCKED':'TECHNICALLY_REVIEW_READY',pages:pages.length,failures,pending,mergeAuthorized:false,deployAuthorized:false},null,2));
if(failures.length)process.exitCode=1;
