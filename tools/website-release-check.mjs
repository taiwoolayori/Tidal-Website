#!/usr/bin/env node
// Website release preflight. No deployment, network calls or file writes.
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=(p)=>readFileSync(resolve(root,p),'utf8');
const requiredPages=['index.html','about.html','group.html','businesses.html','developments.html','agro.html','farms.html','governance.html','foundation.html','contact.html'];
const errors=[];
for(const path of requiredPages){if(!existsSync(resolve(root,path)))errors.push('Required public page missing: '+path);}
const config=JSON.parse(read('firebase.json'));
if(config.hosting.public==='.'||config.hosting.public==='./')errors.push('Firebase Hosting publishes repository root; isolate a reviewed public directory before release');
if(!Array.isArray(config.hosting.ignore)||!config.hosting.ignore.includes('**/.*'))errors.push('Missing hidden-file exclusion');
const home=read('index.html');
if(!home.includes('Every legacy')||!home.includes('begins somewhere.'))errors.push('Approved homepage title absent');
for(const path of requiredPages.filter(p=>existsSync(resolve(root,p)))){
 const html=read(path);
 if(/(?:https?:\/\/)?(?:localhost|127\.0\.0\.1):\d+/i.test(html))errors.push('Local service address in '+path);
 if(/firebase-adminsdk|PRIVATE KEY-----|oauth-client\.local\.json/i.test(html))errors.push('Sensitive server configuration reference in '+path);
}
if(existsSync(resolve(root,'public-content-config.js'))){
 const cfg=read('public-content-config.js');
 if(/url:\s*['"](?:https?:\/\/)?example\./.test(cfg))errors.push('Placeholder public social URL');
}
console.log(JSON.stringify({status:errors.length?'RELEASE_BLOCKED':'REVIEW_READY',testedPages:requiredPages.length,errors,productionDeployAuthorized:false},null,2));
if(errors.length)process.exitCode=1;
