#!/usr/bin/env node
// Build an explicit public-only Firebase Hosting directory. Does not deploy.
import {readdirSync,lstatSync,mkdirSync,copyFileSync,rmSync,readFileSync} from 'node:fs';
import {join,resolve,extname,relative,sep} from 'node:path';
const root=resolve(import.meta.dirname,'..'),destination=join(root,'dist-public');
const allowedExtensions=new Set(['.html','.css','.js','.webp','.png','.jpg','.jpeg','.svg','.ico','.woff','.woff2','.txt','.xml','.webmanifest','.gif','.avif']);
const allowedDirectories=new Set(['assets']);
const forbiddenRootNames=new Set(['package.json','firebase.json','public-content-config.local.js','olayori-central.html']);
// Obsolete branded artwork is deliberately excluded from any public release bundle.
const forbiddenPublicAssets=new Set(['assets/contact-bg-clean@2x.webp']);
const allowedRootTxt=new Set(['robots.txt','humans.txt']);
const allowedRootXml=new Set(['sitemap.xml']);
const files=[];
function scan(dir,rel=''){
 for(const name of readdirSync(dir)){
  if(name.startsWith('.'))continue;
  const location=join(dir,name),path=rel?rel+'/'+name:name;
  const info=lstatSync(location);
  if(info.isSymbolicLink())throw Error('Symlink not supported: '+path);
  if(info.isDirectory()){
   if(rel===''&&allowedDirectories.has(name))scan(location,path);
   continue;
  }
  if(!info.isFile())continue;
  if(forbiddenPublicAssets.has(path))continue;
  if(rel===''&&forbiddenRootNames.has(name))continue;
  if(rel===''&&!allowedExtensions.has(extname(name).toLowerCase()))continue;
  if(rel===''&&extname(name).toLowerCase()==='.txt'&&!allowedRootTxt.has(name))continue;
  if(rel===''&&extname(name).toLowerCase()==='.xml'&&!allowedRootXml.has(name))continue;
  if(rel!==''&&!allowedExtensions.has(extname(name).toLowerCase()))continue;
  if(/(?:credentials|secret|token|private|internal|draft|backup)/i.test(name))throw Error('Sensitive filename in public assets: '+path);
  files.push({source:location,path});
 }
}
scan(root);
if(!files.some(x=>x.path==='index.html'))throw Error('Required index.html missing');
if(files.some(x=>x.path.startsWith('tools/')||x.path.startsWith('docs/')))throw Error('Unexpected development content');
for(const f of files){
 if(f.path.endsWith('.js')&&/\b(?:firebase-admin|process\.env|serviceAccount|private_key)\b/.test(readFileSync(f.source,'utf8')))throw Error('Server-only JavaScript detected in public build: '+f.path);
}
rmSync(destination,{recursive:true,force:true});
mkdirSync(destination,{recursive:true});
for(const f of files){
 const target=join(destination,f.path);
 mkdirSync(resolve(target,'..'),{recursive:true});
 copyFileSync(f.source,target);
}
console.log(JSON.stringify({status:'PUBLIC_BUNDLE_BUILT',fileCount:files.length,target:'dist-public',productionDeployAuthorized:false}));
