import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

const server=spawn('python3',['-m','http.server','8765','--directory','staging-public'],{stdio:'ignore'});
const pages=['index.html','group.html','businesses.html','developments.html','agro.html','farms.html','farm-poultry.html','farm-aquaculture.html','media.html','foundation.html','contact.html'];
const failures=[];
mkdirSync('browser-review',{recursive:true});
let browser;
try {
  for(let i=0;i<30;i++){
    try { const r=await fetch('http://127.0.0.1:8765/index.html'); if(r.ok) break; } catch {}
    if(i===29) throw Error('Local preview server did not become ready');
    await delay(200);
  }
  browser=await chromium.launch({headless:true});
  for(const [name,viewport] of [['desktop',{width:1440,height:900}],['tablet',{width:1024,height:768}],['mobile',{width:390,height:844}]]){
    const context=await browser.newContext({viewport,reducedMotion:'reduce'});
    const page=await context.newPage();
    page.on('pageerror',err=>failures.push(name+' JavaScript: '+err.message));
    for(const file of pages){
      const response=await page.goto('http://127.0.0.1:8765/'+file,{waitUntil:'networkidle'});
      if(response?.status()!==200)failures.push(name+' '+file+' HTTP '+response?.status());
      const r=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,title:document.title,main:!!document.querySelector('main')}));
      if(r.scroll>r.client+3)failures.push(name+' '+file+' horizontal overflow '+r.scroll+'/'+r.client);
      if(!r.title||!r.main)failures.push(name+' '+file+' missing title/main');
      if(file==='media.html'){
        await page.waitForFunction(()=>!!window.TIDAL_PUBLIC_CONTENT);
        if(await page.locator('[data-tidal-media] a').count()) failures.push(name+' unapproved media link visible');
        if(await page.locator('[data-tidal-social] a').count()) failures.push(name+' unapproved social link visible');
      }
      if(['index.html','group.html','businesses.html','farms.html'].includes(file)){
        const destinations=await page.locator('nav.footer-destinations a').count();
        if(destinations!==4)failures.push(name+' '+file+' expected 4 shared destination links, found '+destinations);
      }
      if(['index.html','group.html','businesses.html','farms.html'].includes(file)) await page.screenshot({path:'browser-review/tidal-'+name+'-'+file+'.png',fullPage:true});
    }
    await page.goto('http://127.0.0.1:8765/index.html');
    const businessesGroup=page.locator('.nav-group').filter({has:page.locator('a[href="businesses.html"]')}).first();
    const dropdown=businessesGroup.locator('.nav-subtoggle');
    if(viewport.width<=1200)await page.locator('button.menu').click();
    await dropdown.click();
    if(await dropdown.getAttribute('aria-expanded')!=='true')failures.push(name+' Businesses dropdown failed to open');
    if(await businessesGroup.locator('.nav-submenu a[href="agro.html"]').count()!==1)failures.push(name+' Agro dropdown target missing');
    await dropdown.press('Escape');
    if(await dropdown.getAttribute('aria-expanded')!=='false')failures.push(name+' Escape failed to close dropdown');

    const menu=page.locator('button.menu');
    if(viewport.width<=1200){
      await menu.click();
      if(await menu.getAttribute('aria-expanded')!=='true')failures.push(name+' menu did not open');
      await page.keyboard.press('Escape');
      if(await menu.getAttribute('aria-expanded')!=='false')failures.push(name+' Escape did not close menu');
    } else if(await menu.isVisible()) failures.push(name+' desktop menu unexpectedly visible');
    await context.close();
  }
  if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
  else console.log('Browser QA passed: 10 pages × 3 viewports, no overflow, menu interactions checked.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
