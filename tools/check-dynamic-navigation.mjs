#!/usr/bin/env node
// Inspect dynamically generated navigation destinations against the built website.
import {readFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const htmlRoot=join(root,'dist-public');
const script=readFileSync(join(root,'script.js'),'utf8');
const errors=[];
const destinations=[...script.matchAll(/\[['"][^'"\]]+['"],['"]([^'"]+\.html(?:#[^'"]+)?)['"]\]/g)].map(m=>m[1]);
for(const destination of new Set(destinations)){
 const [page,fragment]=destination.split('#');
 const path=join(htmlRoot,page);
 if(!existsSync(path)){errors.push('Dynamic navigation page missing: '+destination);continue;}
 if(fragment){
  const html=readFileSync(path,'utf8');
  const ids=new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]));
  if(!ids.has(fragment))errors.push('Dynamic navigation anchor missing: '+destination);
 }
}
console.log(JSON.stringify({status:errors.length?'BLOCKED':'DYNAMIC_NAV_VALIDATED',destinations:destinations.length,errors,productionDeployAuthorized:false},null,2));
if(errors.length)process.exitCode=1;
