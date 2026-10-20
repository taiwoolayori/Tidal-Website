#!/usr/bin/env node
// Release-candidate brand consistency audit, without changing any images.
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'../dist-public');
if(!existsSync(root))throw Error('Build public directory first');
const pages=readdirSync(root).filter(x=>x.endsWith('.html'));
const styles=readdirSync(root).filter(x=>x.endsWith('.css'));
const errors=[],warnings=[];
for(const p of [...pages,...styles]){
 const s=readFileSync(join(root,p),'utf8');
 if(/Tidal Crest Capital Limited|Tidal Crest Capital\b/i.test(s))errors.push('Obsolete company name in public text: '+p);
 if(/contact-bg-clean@2x\.webp/i.test(s))errors.push('Contact obsolete hero still referenced: '+p);
}
const css=styles.map(p=>readFileSync(join(root,p),'utf8')).join('\n');
if(!css.includes(".contact{background-image:url('assets/developments-bg-hq@2x.webp')}"))errors.push('Approved Contact architectural hero substitution missing');
if(pages.some(p=>!/TIDAL CREST GROUP|Tidal Crest Group/.test(readFileSync(join(root,p),'utf8'))))warnings.push('Check canonical Group name on all public pages');
console.log(JSON.stringify({status:errors.length?'BRAND_REVIEW_BLOCKED':'BRAND_TEXT_GATE_PASSED',pages:pages.length,stylesheets:styles.length,errors,warnings,productionDeployAuthorized:false},null,2));
if(errors.length)process.exitCode=1;
