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
    if(event.key==='Escape') closeMenu();
  });

  window.addEventListener('resize',()=>{
    if(window.innerWidth>900) closeMenu();
  });
}
