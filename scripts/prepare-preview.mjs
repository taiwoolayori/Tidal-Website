// Build a controlled, public-safe review artifact; no deploy occurs here.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const out='staging-public';
const pages=['index.html','about.html','group.html','businesses.html','projects.html','developments.html','agro.html','farms.html','farm-poultry.html','farm-livestock.html','farm-aquaculture.html','farm-crops.html','farm-resources.html','farm-markets.html','farm-learning.html','farm-visitors.html','governance.html','foundation.html','careers.html','contact.html','privacy.html','data-deletion.html','olayori-central.html','investments.html','leadership.html'];
const files=[...pages,'styles.css','lean.css','cinematic.css','script.js','cinematic.js','favicon.ico','favicon-32x32.png','apple-touch-icon.png'];
const assets=['home-bg-hq@2x.webp','about-bg-clean@2x.webp','group-bg-hq@2x.webp','developments-bg-hq@2x.webp','agro-bg-hq@2x.webp','governance-bg-clean@2x.webp','foundation-bg-clean@2x.webp','careers-bg-hq@2x.webp','contact-bg-clean@2x.webp','tidal-crest-crest-official.png'];
for (const path of [...files,...assets.map(name=>'assets/'+name)]) if(!existsSync(path)) throw new Error('Missing allowlisted asset: '+path);
rmSync(out,{recursive:true,force:true});mkdirSync(join(out,'assets'),{recursive:true});
for (const path of files) cpSync(path,join(out,path));
for (const name of assets) cpSync(join('assets',name),join(out,'assets',name));
writeFileSync(join(out,'robots.txt'),'User-agent: *\\nDisallow: /\\n'.replaceAll('\\n','\n'));
const actual=readdirSync(out).sort();
if(actual.includes('CNAME')||actual.includes('.firebaserc')||actual.includes('firebase.json')) throw new Error('Unexpected production configuration in staging');
console.log('Preview artifact ready:',files.length,'files;',assets.length,'approved image assets. No deployment performed.');
