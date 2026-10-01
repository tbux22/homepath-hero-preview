/* HomePath homepage – interactions (prototype). No dependencies. */
(function(){
  var d=document.documentElement;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- hero (Option A click states) ---- */
  var copy={
    yes:"Next: a short guide to reading court papers and what usually comes next.",
    no:"Next: a short guide to where you are in the process and your options."
  };
  var dest={yes:"#court-papers",no:"#start"};
  var btns=[].slice.call(document.querySelectorAll('.choice')),
      box=document.getElementById('choices'),
      next=document.getElementById('next'),
      text=document.getElementById('nextText'),
      go=document.getElementById('nextGo');
  function pick(k){
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.key===k?'true':'false')});
    box.setAttribute('data-picked',k);
    text.textContent=copy[k];
    go.setAttribute('href',dest[k]);
    next.hidden=false;
    go.focus({preventScroll:false});
  }
  btns.forEach(function(b){b.addEventListener('click',function(){pick(b.dataset.key)})});
  document.getElementById('back').addEventListener('click',function(){
    btns.forEach(function(b){b.setAttribute('aria-pressed','false')});
    box.removeAttribute('data-picked');next.hidden=true;btns[0].focus();
  });
  var h=location.hash.replace('#','');if(copy[h])pick(h);

  /* ---- one-time scroll reveal ---- */
  var els=[].slice.call(document.querySelectorAll('.reveal,[data-io],.landscape'));
  if(d.classList.contains('static')||reduce||!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in')});
  }else{
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(e){io.observe(e)});
  }

  /* ---- View all towns (expand / collapse) ---- */
  [].slice.call(document.querySelectorAll('.more-btn')).forEach(function(b){
    var panel=document.getElementById(b.getAttribute('aria-controls'));
    var lbl=b.querySelector('.lbl');
    function done(open){ if(open){panel.style.height='auto';} else {panel.hidden=true;panel.style.height='';} }
    b.addEventListener('click',function(){
      var open=b.getAttribute('aria-expanded')==='true';
      var animate=!reduce&&!d.classList.contains('static');
      if(!open){
        b.setAttribute('aria-expanded','true');lbl.textContent='Show fewer towns';
        panel.hidden=false;
        if(animate){
          panel.style.height='0px';
          void panel.offsetHeight;
          panel.style.height=panel.scrollHeight+'px';
          var t=function(e){if(e.target!==panel)return;panel.removeEventListener('transitionend',t);done(true)};
          panel.addEventListener('transitionend',t);
        }else done(true);
      }else{
        b.setAttribute('aria-expanded','false');lbl.textContent='View all towns';
        if(animate){
          panel.style.height=panel.scrollHeight+'px';
          void panel.offsetHeight;
          panel.style.height='0px';
          var t2=function(e){if(e.target!==panel)return;panel.removeEventListener('transitionend',t2);done(false)};
          panel.addEventListener('transitionend',t2);
        }else done(false);
      }
    });
  });

  /* ---- town search (prototype) ---- */
  var T=window.HP_TOWNS||{};
  var names=Object.keys(T);
  var tform=document.getElementById('townform'),tq=document.getElementById('town-q'),tmsg=document.getElementById('townMsg');
  function norm(s){return s.toLowerCase().replace(/,?\s*(ct|conn\.?|connecticut)\s*$/,'').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim()}
  tform.addEventListener('submit',function(e){
    e.preventDefault();
    var raw=tq.value.trim();
    tmsg.textContent='';
    if(!raw){tmsg.textContent='Enter your town name to continue.';return}
    if(/^\d{5}(-\d{4})?$/.test(raw)){tmsg.textContent='ZIP lookup connects to the real directory later. Try your town name.';return}
    var n=norm(raw);
    var exact=names.filter(function(x){return norm(x)===n})[0];
    if(exact){location.href='town-placeholder.html?town='+T[exact].slug;return}
    var part=names.filter(function(x){return n.length>=2&&norm(x).indexOf(n)===0});
    if(part.length===1){location.href='town-placeholder.html?town='+T[part[0]].slug;return}
    if(part.length>1){
      tmsg.textContent='Did you mean: ';
      part.slice(0,6).forEach(function(x){var a=document.createElement('a');a.href='town-placeholder.html?town='+T[x].slug;a.textContent=x;tmsg.appendChild(a)});
      return;
    }
    tmsg.textContent="We couldn't find that town. Check the spelling, or browse by Judicial District below.";
  });

  /* ---- attorney field: placeholder only ---- */
  var f=document.getElementById('finder'),msg=document.getElementById('finderMsg'),loc=document.getElementById('loc');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v=loc.value.trim();
    msg.textContent=v?('Design preview: the attorney search is not built yet. You entered "'+v+'".'):'Enter a town or ZIP code to continue.';
  });
})();
