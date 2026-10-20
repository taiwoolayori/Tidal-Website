#!/usr/bin/env node
// Non-deploying visual evidence capture of the isolated public bundle.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'../dist-public'),output=resolve(import.meta.dirname,'../artifacts/website-visual-qa');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2'};
const paths=['index.html','businesses.html','farms.html','governance.html','foundation.html','contact.html'];
const viewports=[['mobile',375,812],['tablet',768,1024],['desktop',1440,900]];
const server=createServer(async(req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 const filename=resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!filename.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{if(!(await stat(filename)).isFile())throw Error('not file');res.writeHead(200,{'Content-Type':types[extname(filename)]||'application/octet-stream'}).end(await readFile(filename));}
 catch{res.writeHead(404).end('Not found');}
});
await mkdir(output,{recursive:true});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true});
const results=[],errors=[];
try{
 for(const [size,width,height] of viewports){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(size+': '+e.message));
  for(const path of paths){
   const response=await page.goto('http://127.0.0.1:'+server.address().port+'/'+path,{waitUntil:'networkidle'});
   if(response?.status()!==200){errors.push(size+'/'+path+' HTTP '+response?.status());continue;}
   const name=path.replace('.html','')+'-'+size+'.png';
   await page.screenshot({path:join(output,name),fullPage:true,animations:'disabled'});
   results.push({page:path,viewport:size,width,height,screenshot:name});
  }
  await page.close();
 }
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
await writeFile(join(output,'manifest.json'),JSON.stringify({type:'NON_PRODUCTION_VISUAL_QA',captureCount:results.length,errors,results},null,2)+'\n');
console.log(JSON.stringify({state:errors.length?'VISUAL_REVIEW_REQUIRED':'SCREENSHOTS_CAPTURED',screenshots:results.length,errors,output:'artifacts/website-visual-qa',deployAuthorized:false}));
if(errors.length)process.exitCode=1;
