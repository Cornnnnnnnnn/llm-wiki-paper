(() => {
 const slides=[...document.querySelectorAll('.slide')],links=[...document.querySelectorAll('[data-goto]')];
 const previous=document.querySelector('#prev-slide'),next=document.querySelector('#next-slide'),counter=document.querySelector('#page-counter');
 let index=0;const format=n=>String(n).padStart(2,'0');
 function go(n,updateHash=true){
  index=Math.max(0,Math.min(slides.length-1,n));
  const overview=document.body.classList.contains('overview');
  slides.forEach((slide,i)=>{slide.classList.toggle('active',i===index);slide.setAttribute('aria-hidden',String(!overview&&i!==index))});
  links.forEach(link=>{if(Number(link.dataset.goto)===index)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});
  counter.textContent=`${format(index+1)} / ${format(slides.length)}`;
  document.querySelector('#progress-fill').style.width=`${(index+1)/slides.length*100}%`;
  previous.disabled=index===0;next.disabled=index===slides.length-1;
  if(updateHash)history.replaceState(null,'',`#slide-${index+1}`);
  if(overview)slides[index].scrollIntoView({behavior:'instant',block:'start'});
 }
 links.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();go(Number(link.dataset.goto))}));
 previous.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));
 document.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.target.closest('input,textarea,button,select,[contenteditable]'))return;
  const moves={ArrowRight:1,PageDown:1,' ':1,ArrowLeft:-1,PageUp:-1};
  if(event.key in moves){event.preventDefault();go(index+moves[event.key]);}
  if(event.key==='Home'||event.key==='End'){event.preventDefault();go(event.key==='Home'?0:slides.length-1);}
 });
 for(const [id,mode] of [['overview-toggle','overview'],['focus-toggle','focus']])document.getElementById(id).addEventListener('click',event=>{
  const value=document.body.classList.toggle(mode);event.currentTarget.setAttribute('aria-pressed',String(value));go(index,false);
 });
 document.querySelector('#print-deck').addEventListener('click',()=>window.print());
 function fromHash(){const n=Number(location.hash.match(/^#slide-(\d+)$/)?.[1]||1);go(n-1,false)}
 window.addEventListener('hashchange',fromHash);
 // Printing exposes all slides to assistive technology as well as the layout.
 window.addEventListener('beforeprint',()=>slides.forEach(s=>s.setAttribute('aria-hidden','false')));
 window.addEventListener('afterprint',()=>go(index,false));
 fromHash();document.documentElement.classList.remove('no-js');
})();
