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
  var els=[].slice.call(document.querySelectorAll('.reveal,[data-io]'));
  if(d.classList.contains('static')||reduce||!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in')});
  }else{
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(e){io.observe(e)});
  }

  /* ---- town search: filters the table live (town-name search only) ---- */
  var T=window.HP_TOWNS||{};
  var tform=document.getElementById('townform'),tq=document.getElementById('town-q'),tmsg=document.getElementById('townMsg');
  var rows=[].slice.call(document.querySelectorAll('#tbl tbody tr')),empty=document.getElementById('tblEmpty'),scroller=document.getElementById('tblScroll');
  function norm(s){return s.toLowerCase().replace(/,?\s*(ct|conn\.?|connecticut)\s*$/,'').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim()}
  function filter(){
    var n=norm(tq.value),shown=0;
    rows.forEach(function(r){
      var show=!n||norm(r.getAttribute('data-town')).indexOf(n)>-1;
      r.hidden=!show;if(show)shown++;
    });
    empty.hidden=shown>0||/^\d{5}/.test(tq.value.trim());
    scroller.scrollTop=0;
    return shown;
  }
  tq.addEventListener('input',function(){tmsg.textContent='';filter()});
  tform.addEventListener('submit',function(e){
    e.preventDefault();
    var raw=tq.value.trim();
    tmsg.textContent='';
    if(!raw){tmsg.textContent='Enter your town name to continue.';return}
    if(/^\d{5}(-\d{4})?$/.test(raw)){tmsg.textContent='Try your town name.';return}
    var n=norm(raw);
    var exact=Object.keys(T).filter(function(x){return norm(x)===n})[0];
    if(exact){location.href='town-placeholder.html?town='+T[exact].slug;return}
    var vis=rows.filter(function(r){return !r.hidden});
    if(vis.length===1){location.href=vis[0].querySelector('a').getAttribute('href');return}
    if(vis.length>1){tmsg.textContent=vis.length+' towns match. Choose yours in the list below.';document.getElementById('tblScroll').scrollIntoView({block:'nearest'});return}
    tmsg.textContent="We couldn't find that town. Check the spelling.";
  });

  /* ---- attorney field: placeholder only ---- */
  var f=document.getElementById('finder'),msg=document.getElementById('finderMsg'),loc=document.getElementById('loc');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v=loc.value.trim();
    msg.textContent=v?('Design preview: the attorney search is not built yet. You entered "'+v+'".'):'Enter a town or ZIP code to continue.';
  });
})();
