// Offline audit for the staging directory. Run after prepare-preview.mjs.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
const root='staging-public';
const pages=readdirSync(root).filter(x=>x.endsWith('.html'));
let checks=0;
const failures=[];
function checkReference(source, target) {
  const value=target.split(/[?#]/)[0];
  if(!value || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(value)) return;
  const relative=value.startsWith('/')?value.slice(1):join(source==='styles.css'||source==='lean.css'||source==='cinematic.css'?'':source.includes('/')?source.substring(0,source.lastIndexOf('/')):'',value);
  const resolved=normalize(relative);
  checks++;
  if(resolved.startsWith('..') || !existsSync(join(root,resolved))) failures.push(source+' -> '+target);
}
for(const page of pages){
  const html=readFileSync(join(root,page),'utf8');
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) checkReference(page,match[1]);
  const nav=html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0]||'';
  if(!nav.includes('href="businesses.html"')) failures.push(page+' missing Businesses navigation');
}
for(const cssFile of ['styles.css','lean.css','cinematic.css']){
  const css=readFileSync(join(root,cssFile),'utf8');
  for(const match of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) checkReference(cssFile,match[1]);
}
for(const forbidden of ['CNAME','.firebaserc','firebase.json','firebase.preview.json','STAGING.md','README.md']){
  if(existsSync(join(root,forbidden)))failures.push('Forbidden staging file: '+forbidden);
}
if(failures.length){ console.error(failures.join('\n'));process.exitCode=1; }
else console.log('Static preview checks passed:',pages.length,'pages;',checks,'local references verified.');
