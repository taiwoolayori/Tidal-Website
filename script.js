const button=document.querySelector('.menu');
const nav=document.querySelector('.nav');

if(button&&nav){
  button.setAttribute('aria-controls','primary-navigation');
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-label','Open navigation');
  nav.id='primary-navigation';

  const closeMenu=()=>{
    nav.classList.remove('open');
    nav.querySelectorAll('.nav-group.expanded').forEach(group=>{
      group.classList.remove('expanded');
      const submenu=group.querySelector('.nav-submenu');
      const toggle=group.querySelector('.nav-subtoggle');
      if(submenu)submenu.hidden=true;
      if(toggle)toggle.setAttribute('aria-expanded','false');
    });
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label','Open navigation');
  };

  button.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });

  nav.addEventListener('click',event=>{
    if(event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&nav.classList.contains('open')){
      const focusWasInside=nav.contains(document.activeElement);
      closeMenu();
      if(focusWasInside) button.focus();
    }
  });

  document.addEventListener('pointerdown',event=>{
    if(nav.classList.contains('open')&&!nav.contains(event.target)&&!button.contains(event.target)){
      closeMenu();
    }
  });

  window.addEventListener('resize',()=>{
    if(window.innerWidth>1200) closeMenu();
  });
}

// Accessible navigation groups. Existing top-level links remain working destinations.
const primaryNav=document.querySelector('.nav[aria-label="Primary"]');
if(primaryNav){
 const groups={
  'businesses.html':[['Developments','developments.html'],['Agro','agro.html'],['Farms','farms.html'],['Foods and future capabilities','businesses.html']],
  'farms.html':[['Estate Journey','farms.html#the-journey'],['Poultry','farm-poultry.html'],['Livestock','farm-livestock.html'],['Aquaculture','farm-aquaculture.html'],['Crops and Orchards','farm-crops.html'],['Resources','farm-resources.html'],['Learning and Research','farm-learning.html']],
  'group.html':[['Projects and Innovation','projects.html'],['Project Calls and Announcements','opportunities.html'],['Research Publications','publications.html'],['Media and Journal','media.html'],['Work With Us','work-with-us.html']]
 };
 for(const link of [...primaryNav.querySelectorAll(':scope > a')]){
  const options=groups[link.getAttribute('href')];
  if(!options)continue;
  const group=document.createElement('div');group.className='nav-group';
  link.before(group);group.append(link);
  const button=document.createElement('button');button.className='nav-subtoggle';button.type='button';
  button.setAttribute('aria-label','Show '+link.textContent+' pages');
  button.setAttribute('aria-expanded','false');button.textContent='⌄';
  const menu=document.createElement('div');menu.className='nav-submenu';menu.hidden=true;
  for(const [label,href] of options){const a=document.createElement('a');a.href=href;a.textContent=label;menu.append(a);}
  group.append(button,menu);
  const close=()=>{menu.hidden=true;button.setAttribute('aria-expanded','false');group.classList.remove('expanded');};
  button.addEventListener('click',()=>{
    const next=menu.hidden;
    primaryNav.querySelectorAll('.nav-group.expanded').forEach(other=>{
      if(other===group)return;
      other.classList.remove('expanded');
      const otherMenu=other.querySelector('.nav-submenu');
      const otherButton=other.querySelector('.nav-subtoggle');
      if(otherMenu)otherMenu.hidden=true;
      if(otherButton)otherButton.setAttribute('aria-expanded','false');
    });
    menu.hidden=!next;button.setAttribute('aria-expanded',String(next));group.classList.toggle('expanded',next);
  });
  group.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){close();button.focus();}});
  document.addEventListener('pointerdown',e=>{if(!group.contains(e.target))close();});
  primaryNav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
 }
}

const principleButtons=document.querySelectorAll('[data-principle]');
const principleDialogs=document.querySelectorAll('.principle-dialog');

principleButtons.forEach(trigger=>{
  const dialog=document.getElementById(`principle-${trigger.dataset.principle}`);
  if(!dialog) return;
  trigger.setAttribute('aria-haspopup','dialog');
  trigger.setAttribute('aria-controls',dialog.id);
  trigger.addEventListener('click',()=>{
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});

principleDialogs.forEach(dialog=>{
  const close=dialog.querySelector('.principle-close');
  close?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target===dialog) dialog.close();
  });
  dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
});


// Shared public destination directory. Preserves approved primary navigation and legacy URLs.
const publicFooter=document.querySelector('.footer .footer-center');
if(publicFooter && document.querySelector('nav.nav[aria-label="Primary"]')){
  const links=[
    ['Projects & Innovation','projects.html'],
    ['Media & Journal','media.html'],
    ['Publications & Journals','publications.html'],
    ['Work With Us','work-with-us.html']
  ];
  const directory=document.createElement('nav');
  directory.className='footer-destinations';
  directory.setAttribute('aria-label','Explore Tidal Crest');
  for(const [label,url] of links){
    const anchor=document.createElement('a');
    anchor.href=url;
    anchor.textContent=label;
    if(location.pathname.endsWith('/'+url)) anchor.setAttribute('aria-current','page');
    directory.append(anchor);
  }
  publicFooter.append(directory);
}

// Optional public-only media and official social profiles, with safe empty state.
function renderTidalPublicContent(){
  const data=window.TIDAL_PUBLIC_CONTENT;
  if(!data)return;
  const validUrl=url=>{try{const u=new URL(url);return u.protocol==='https:';}catch{return false;}};
  const footer=document.querySelector('.footer .footer-center');
  if(footer&&!footer.querySelector('[data-tidal-social]')){const social=document.createElement('nav');social.setAttribute('aria-label','Official social channels');social.dataset.tidalSocial='';footer.append(social);}
  const activeSocial=(data.social||[]).filter(x=>x.url&&validUrl(x.url));
  document.querySelectorAll('[data-tidal-social]').forEach(host=>{
    if(!activeSocial.length){host.hidden=true;return;}
    host.hidden=false;
    const heading=document.createElement('h3');heading.textContent='Follow Tidal Crest';host.append(heading);
    for(const item of activeSocial){const a=document.createElement('a');a.href=item.url;a.textContent=item.label;a.target='_blank';a.rel='noopener noreferrer';host.append(a);}
  });
  const releases=(data.releases||[]).filter(x=>x.status==='published'&&x.title&&validUrl(x.url));
  document.querySelectorAll('[data-tidal-media]').forEach(host=>{
    const type=host.getAttribute('data-tidal-media');
    const scoped=releases.filter(x=>type==='all'||x.type===type).sort((a,b)=>(b.publishedAt||'').localeCompare(a.publishedAt||''));
    if(!scoped.length){host.hidden=true;return;}
    host.hidden=false;
    for(const item of scoped){
      const article=document.createElement('article');article.className='card tidal-release';
      const h=document.createElement('h3');h.textContent=item.title;article.append(h);
      if(item.summary){const p=document.createElement('p');p.textContent=item.summary;article.append(p);}
      const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='View publication';article.append(link);
      // No third-party embed is loaded until a visitor explicitly chooses to watch.
      if(item.embedUrl&&item.type==='video'&&item.embedUrl.startsWith('https://www.youtube-nocookie.com/embed/')){
        const button=document.createElement('button');button.type='button';button.textContent='Play video here';
        button.addEventListener('click',()=>{const frame=document.createElement('iframe');frame.src=item.embedUrl;frame.title=item.title;frame.loading='lazy';frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';frame.allowFullscreen=true;button.replaceWith(frame);});
        article.append(button);
      }
      host.append(article);
    }
  });
}
const tidalConfig=document.createElement('script');
tidalConfig.src='public-content-config.js';
tidalConfig.onload=renderTidalPublicContent;
document.head.append(tidalConfig);
