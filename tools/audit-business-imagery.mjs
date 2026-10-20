#!/usr/bin/env node
// Editorial asset audit. A passing build is not visual or authenticity acceptance.
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const home=readFileSync(resolve(root,'index.html'),'utf8');
const styles=readFileSync(resolve(root,'styles.css'),'utf8');
const cards=[...home.matchAll(/<a class="origin-company"[^>]*>\s*<img\s+src="([^"]+)"[^>]*>\s*<div>\s*<span>([^<]+)<\/span>\s*<h3>([^<]+)<\/h3>/g)].map(m=>({image:m[1],status:m[2],business:m[3]}));
const grouped={};
for(const card of cards)(grouped[card.image]??=[]).push(card.business);
const duplicated=Object.entries(grouped).filter(([,names])=>names.length>1).map(([image,businesses])=>({image,businesses}));
const releaseReady=duplicated.length===0;
const approved={
 about:false,governance:false,agro:false
};
console.log(JSON.stringify({
 status:releaseReady?'DISTINCT_CARD_ASSETS':'IMAGE_REVIEW_REQUIRED',
 unresolvedUniqueImageRequirement:!releaseReady,
 inspectedCards:cards.length,duplicated,
 heroFraming:'PER_PAGE_FOCAL_POINT_CANDIDATE_NOT_VISUALLY_ACCEPTED',
 ownerImageApproval:approved,
 warnings:['No authenticity or crop approval can be established from file names or CI alone.'],
 productionDeployAuthorized:false
},null,2));
// Report-only until owner-approved source assets are supplied. Do not invent substitutes.
