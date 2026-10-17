const button=document.querySelector('.menu');
const nav=document.querySelector('.nav');

if(button&&nav){
  button.setAttribute('aria-controls','primary-navigation');
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-label','Open navigation');
  nav.id='primary-navigation';

  const closeMenu=()=>{
    nav.classList.remove('open');
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
