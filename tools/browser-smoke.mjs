#!/usr/bin/env node
// Synthetic local browser checks only; no Firebase authentication or deployment.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'../dist-public');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
const server=createServer(async(req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 const filename=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(filename!==root&&!filename.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{const info=await stat(filename);if(!info.isFile())throw Error('not file');res.writeHead(200,{'Content-Type':types[extname(filename)]||'application/octet-stream'}).end(await readFile(filename));}
 catch{res.writeHead(404).end('Not found');}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});
const errors=[],checks=[];
try{
 for(const [label,width,height] of [['mobile',375,812],['tablet',768,1024],['desktop',1440,900]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const jsErrors=[];page.on('pageerror',e=>jsErrors.push(e.message));
  for(const path of ['/','/businesses.html','/farms.html','/governance.html','/foundation.html','/contact.html']){
   const response=await page.goto(base+path,{waitUntil:'networkidle'});
   if(response?.status()!==200)errors.push(label+' '+path+' HTTP '+response?.status());
   const data=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth,h1:document.querySelectorAll('h1').length}));
   if(data.scrollWidth>data.innerWidth+3)errors.push(label+' '+path+' horizontal overflow: '+data.scrollWidth+' > '+data.innerWidth);
   if(data.h1!==1)errors.push(label+' '+path+' expected one H1, observed '+data.h1);
   checks.push(label+' '+path);
  }
  if(width===375){
   await page.goto(base+'/',{waitUntil:'networkidle'});
   const menu=page.locator('button.menu');
   if(await menu.isVisible()){
    await menu.click();
    if(await menu.getAttribute('aria-expanded')!=='true')errors.push('mobile menu did not open');
    await page.keyboard.press('Escape');
    if(await menu.getAttribute('aria-expanded')!=='false')errors.push('mobile menu did not close with Escape');
   }
  }
  for(const err of jsErrors)errors.push(label+' JavaScript: '+err);
  await page.close();
 }
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
console.log(JSON.stringify({status:errors.length?'BROWSER_REVIEW_REQUIRED':'BROWSER_SMOKE_PASSED',checks:checks.length,errors,productionDeployAuthorized:false},null,2));
if(errors.length)process.exitCode=1;
