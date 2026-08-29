const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if(!reducedMotion){
  const reveals=document.querySelectorAll('.reveal,.value-step');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.16,rootMargin:'0px 0px -6% 0px'});
  reveals.forEach(el=>observer.observe(el));

  const stage=document.querySelector('.crest-stage');
  const crest=document.querySelector('.hero-crest-v2');
  if(stage&&crest&&window.matchMedia('(pointer:fine)').matches){
    stage.addEventListener('pointermove',event=>{
      const r=stage.getBoundingClientRect();
      const x=(event.clientX-r.left)/r.width-.5;
      const y=(event.clientY-r.top)/r.height-.5;
      crest.style.transform=`rotateY(${x*9}deg) rotateX(${y*-7}deg) translate3d(${x*10}px,${y*8}px,18px)`;
    });
    stage.addEventListener('pointerleave',()=>{crest.style.transform='';});
  }
}else{
  document.querySelectorAll('.reveal,.value-step').forEach(el=>el.classList.add('in-view'));
}
