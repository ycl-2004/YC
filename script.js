/* YC personal site — interactions: reveal, cursor, parallax, counters, marquee, name-card modal, tilt. */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scenes: build + auto-scroll + drag + click-to-zoom ---- */
  var sceneData = [
    ['01-city-walks','City Walks &amp; Good Days','城市漫步'],
    ['04-cafe-coding','Caf&eacute; &amp; Creative Time','咖啡与代码'],
    ['05-music-studio','Music Creator Mode','音乐创作'],
    ['06-books','Books &amp; Big Ideas','阅读与思考'],
    ['03-park-picnic','Park Picnic Vibes','公园野餐'],
    ['07-travel','Travel &amp; Explore','旅行探索'],
    ['09-sunset-dreams','Sunset Plans &amp; Dreams','日落计划'],
    ['02-hoops','Hoops &amp; Hustle','运动时刻'],
    ['08-fun-mode','Fun Mode Unlocked','尽情玩乐']
  ];
  var track = document.getElementById('sceneTrack');
  var row = document.getElementById('sceneRow');
  if(track){
    function cardHTML(s,i){ return '<figure class="scene-card" data-i="'+i+'"><img src="assets/scenes/'+s[0]+'.jpg" alt="YC 场景 · '+s[2]+'" draggable="false" loading="lazy"><span class="zoomhint" aria-hidden="true">⤢</span><figcaption class="cap">'+s[1]+'<span class="zh">'+s[2]+'</span></figcaption></figure>'; }
    var html=''; for(var pass=0; pass<2; pass++){ sceneData.forEach(function(s,i){ html+=cardHTML(s,i); }); }
    track.innerHTML = html;
  }
  if(row && track){
    var paused=false, half=0, down=false, startX=0, startLeft=0, moved=0;
    function measure(){ half=track.scrollWidth/2; }
    setTimeout(measure,80); window.addEventListener('resize',measure);
    (function autoscroll(){ if(!paused && !reduce && half>0){ row.scrollLeft+=0.5; if(row.scrollLeft>=half) row.scrollLeft-=half; } requestAnimationFrame(autoscroll); })();
    row.addEventListener('mouseenter',function(){ paused=true; });
    row.addEventListener('mouseleave',function(){ if(!down) paused=false; });
    row.addEventListener('pointerdown',function(e){ down=true; moved=0; startX=e.clientX; startLeft=row.scrollLeft; paused=true; row.classList.add('grabbing'); });
    window.addEventListener('pointermove',function(e){ if(!down) return; var dx=e.clientX-startX; moved=Math.max(moved,Math.abs(dx)); var nl=startLeft-dx; if(half>0){ if(nl>=half){nl-=half; startLeft-=half;} else if(nl<0){nl+=half; startLeft+=half;} } row.scrollLeft=nl; });
    window.addEventListener('pointerup',function(){ if(!down) return; down=false; row.classList.remove('grabbing'); setTimeout(function(){ paused=false; },800); });
    track.addEventListener('click',function(e){ var card=e.target.closest('.scene-card'); if(!card||moved>6) return; openLightbox(+card.getAttribute('data-i')); });
  }

  /* ---- scene lightbox (click to zoom) ---- */
  var lb=document.getElementById('sceneLightbox'), lbImg=document.getElementById('lbImg'), lbCap=document.getElementById('lbCap'), lbI=0;
  function openLightbox(i){ if(!lb) return; lbI=(i+sceneData.length)%sceneData.length; var s=sceneData[lbI]; lbImg.src='assets/scenes/'+s[0]+'.jpg'; lbImg.alt='YC 场景 · '+s[2]; lbCap.innerHTML=s[1]+'<span class="zh">'+s[2]+'</span>'; lb.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeLightbox(){ if(!lb) return; lb.classList.remove('open'); document.body.style.overflow=''; }
  if(lb){
    lb.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click',closeLightbox); });
    var pv=document.getElementById('lbPrev'), nx=document.getElementById('lbNext');
    if(pv) pv.addEventListener('click',function(e){ e.stopPropagation(); openLightbox(lbI-1); });
    if(nx) nx.addEventListener('click',function(e){ e.stopPropagation(); openLightbox(lbI+1); });
    document.addEventListener('keydown',function(e){ if(!lb.classList.contains('open')) return; if(e.key==='Escape') closeLightbox(); else if(e.key==='ArrowLeft') openLightbox(lbI-1); else if(e.key==='ArrowRight') openLightbox(lbI+1); });
  }

  /* ---- portrait animation lightbox ---- */
  var pl=document.getElementById('portraitLightbox'), plImg=document.getElementById('portraitLbImg'), plCap=document.getElementById('portraitLbCap');
  var portraitOpener=null;
  function openPortraitLightbox(portrait){
    if(!pl || !plImg) return;
    var img=portrait.querySelector('.pillar-img');
    if(!img) return;
    var card=portrait.closest('.pillar');
    var en=card && card.querySelector('.en') ? card.querySelector('.en').textContent : '';
    var title=card && card.querySelector('h3') ? card.querySelector('h3').textContent : '';
    plImg.src=img.currentSrc || img.getAttribute('src') || '';
    plImg.alt=img.alt || title || 'YC 角色动画';
    if(plCap) plCap.textContent=[en,title].filter(Boolean).join(' · ');
    portraitOpener=portrait;
    pl.classList.add('open');
    document.body.style.overflow='hidden';
    var close=pl.querySelector('.portrait-lightbox-close');
    if(close) close.focus();
  }
  function closePortraitLightbox(){
    if(!pl) return;
    pl.classList.remove('open');
    document.body.style.overflow='';
    if(portraitOpener) portraitOpener.focus();
    portraitOpener=null;
  }
  if(pl){
    pl.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click',closePortraitLightbox); });
    document.addEventListener('keydown',function(e){
      if(!pl.classList.contains('open')) return;
      if(e.key==='Escape') closePortraitLightbox();
      else if(e.key==='Tab') e.preventDefault();
    });
  }
  document.querySelectorAll('.motion-portrait').forEach(function(portrait){
    portrait.addEventListener('click',function(e){ e.stopPropagation(); openPortraitLightbox(portrait); });
  });

  /* ---- reveal on scroll ---- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold:0.12 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---- count up ---- */
  var counted=false;
  function runCount(){
    if(counted) return; counted=true;
    document.querySelectorAll('[data-count]').forEach(function(el){
      var target=+el.getAttribute('data-count'), cur=0, step=Math.max(1,Math.round(target/26));
      if(reduce){ el.textContent=target; return; }
      var t=setInterval(function(){ cur+=step; if(cur>=target){cur=target; clearInterval(t);} el.textContent=cur; }, 34);
    });
  }
  var heroStats=document.querySelector('.hero-stats');
  if(heroStats){ var io2=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ runCount(); io2.disconnect(); } }); },{threshold:.4}); io2.observe(heroStats); }

  /* ---- role rotator ---- */
  var roles=['creator','engineer','dreamer','music maker','life-long learner','romantic'];
  var ri=0, rot=document.getElementById('rotator');
  if(rot && !reduce){
    setInterval(function(){
      ri=(ri+1)%roles.length;
      rot.style.transition='opacity .3s'; rot.style.opacity='0';
      setTimeout(function(){ rot.textContent=roles[ri]; rot.style.opacity='1'; },300);
    }, 2200);
  }

  /* ---- nav scrolled + scroll progress + active link + parallax ---- */
  var nav=document.getElementById('nav'), progress=document.getElementById('progress');
  var sections=['about','work','scenes','values'].map(function(id){ return document.getElementById(id); });
  var navAnchors={};
  document.querySelectorAll('.navlinks a').forEach(function(a){ navAnchors[a.getAttribute('href').slice(1)]=a; });
  var parallaxEls=[].slice.call(document.querySelectorAll('[data-parallax]'));
  function onScroll(){
    var y=window.scrollY, h=document.documentElement.scrollHeight-window.innerHeight;
    if(progress) progress.style.width=(h>0?(y/h*100):0)+'%';
    if(nav) nav.classList.toggle('scrolled', y>40);
    // active link
    var cur=null;
    sections.forEach(function(s){ if(s && s.getBoundingClientRect().top<=window.innerHeight*0.4) cur=s.id; });
    Object.keys(navAnchors).forEach(function(id){ navAnchors[id].classList.toggle('active', id===cur); });
    // parallax
    if(!reduce){ parallaxEls.forEach(function(el){ var sp=+el.getAttribute('data-parallax'); el.style.transform=(el.classList.contains('hero-bgword')?'translateY(-50%) ':'')+'translateY('+(y*sp*0.12)+'px)'; }); }
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---- custom cursor + magnetic ---- */
  if(!reduce && window.matchMedia('(hover:hover)').matches){
    var dot=document.querySelector('.cursor-dot');
    if(dot){
      var active=false;
      document.addEventListener('mousemove',function(e){ dot.style.left=e.clientX+'px'; dot.style.top=e.clientY+'px';
        if(!active){active=true; dot.style.opacity='1';} });
      document.addEventListener('mouseleave',function(){ dot.style.opacity='0'; });
      document.querySelectorAll('a,button,.tag,.pillar,.scene-card,.ward-rail img').forEach(function(el){
        el.addEventListener('mouseenter',function(){ dot.classList.add('grow'); });
        el.addEventListener('mouseleave',function(){ dot.classList.remove('grow'); });
      });
    }
    // pillar spotlight sheen following cursor
    document.querySelectorAll('.pillar').forEach(function(p){
      p.addEventListener('mousemove',function(e){ var r=p.getBoundingClientRect(); p.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%'); p.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%'); });
    });
    // magnetic
    document.querySelectorAll('[data-magnetic]').forEach(function(el){
      el.addEventListener('mousemove',function(e){ var r=el.getBoundingClientRect(); var x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2; el.style.transform='translate('+(x*0.25)+'px,'+(y*0.35)+'px)'; });
      el.addEventListener('mouseleave',function(){ el.style.transform=''; });
    });
  }

  /* ---- platform links: gentle hint if still placeholder ---- */
  document.querySelectorAll('.platforms a').forEach(function(a){
    a.addEventListener('click',function(ev){
      if(a.getAttribute('href')==='#'){ ev.preventDefault();
        var s=document.getElementById('shareStatus'); s.textContent=a.getAttribute('data-edit')+' 链接还没填，可在 index.html 里把 href="#" 换成你的主页地址';
      }
    });
  });

  /* ---- name card modal ---- */
  var modal=document.getElementById('cardModal'), opener=document.getElementById('shareProfile');
  var statusEl=document.getElementById('shareStatus');
  function setStatus(t){ if(statusEl) statusEl.textContent=t; }
  function openModal(){ if(!modal) return; modal.classList.add('open'); document.body.style.overflow='hidden'; setStatus('YC 名片已打开'); }
  function closeModal(){ if(!modal) return; modal.classList.remove('open'); document.body.style.overflow=''; }
  if(opener) opener.addEventListener('click', openModal);
  if(modal){
    modal.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && modal.classList.contains('open')) closeModal(); });
  }
  var copyBtn=document.getElementById('copyLink');
  if(copyBtn) copyBtn.addEventListener('click', async function(){
    try{ await navigator.clipboard.writeText(location.href); copyBtn.textContent='已复制 ✓'; setStatus('主页链接已复制'); setTimeout(function(){ copyBtn.textContent='复制主页链接'; },1800); }
    catch(e){ setStatus('请手动复制地址栏链接'); }
  });
  var dlBtn=document.getElementById('dlCard'), card=document.getElementById('nameCard');
  if(dlBtn && card) dlBtn.addEventListener('click', function(){
    var orig=dlBtn.innerHTML;
    if(typeof html2canvas!=='function'){ setStatus('导出库未加载，可直接截图保存这张名片'); return; }
    dlBtn.innerHTML='生成中…';
    html2canvas(card,{scale:2, backgroundColor:'#FEFCF6', logging:false, useCORS:true, imageTimeout:15000, scrollX:0, scrollY:0, windowWidth:document.documentElement.offsetWidth, height:card.scrollHeight}).then(function(canvas){
      var a=document.createElement('a'); a.download='YC-namecard.png'; a.href=canvas.toDataURL('image/png'); a.click();
      setStatus('名片已下载为 PNG'); dlBtn.innerHTML='已下载 ✓'; setTimeout(function(){ dlBtn.innerHTML=orig; },1800);
    }).catch(function(err){ console.error('html2canvas error:', err); setStatus('导出失败：'+((err&&err.message)||err)+'（可直接截图保存这张名片）'); dlBtn.innerHTML=orig; });
  });

  /* ---- back to top ---- */
  var backtop=document.getElementById('backTop');
  if(backtop){
    backtop.addEventListener('click', function(){ window.scrollTo({top:0, behavior: reduce?'auto':'smooth'}); });
    window.addEventListener('scroll', function(){ backtop.classList.toggle('show', window.scrollY>window.innerHeight*0.9); }, {passive:true});
  }

  /* ---- pillar 3D tilt ---- */
  if(!reduce && window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.pillar').forEach(function(p){
      p.addEventListener('mousemove', function(e){ var r=p.getBoundingClientRect(); var px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        p.style.transform='translateY(-6px) rotateX('+((0.5-py)*5).toFixed(2)+'deg) rotateY('+((px-0.5)*6).toFixed(2)+'deg)'; });
      p.addEventListener('mouseleave', function(){ p.style.transform=''; });
    });
  }

  /* ============ 21st.dev-style effects ============ */

  /* ---- meteors (dark values section) ---- */
  var meteorBox=document.getElementById('meteors');
  if(meteorBox && !reduce){
    for(var m=0;m<14;m++){
      var mt=document.createElement('span'); mt.className='meteor';
      mt.style.left=(Math.random()*100)+'%';
      mt.style.animationDuration=(2.4+Math.random()*3.2).toFixed(2)+'s';
      mt.style.animationDelay=(Math.random()*6).toFixed(2)+'s';
      meteorBox.appendChild(mt);
    }
  }

  /* ---- text reveal: wrap words, light them up on scroll ---- */
  document.querySelectorAll('.text-reveal').forEach(function(el){
    if(reduce) return;
    var i=0;
    (function wrap(node){
      [].slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){ // text node
          var frag=document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(tok){
            if(tok.trim()===''){ frag.appendChild(document.createTextNode(tok)); return; }
            var sp=document.createElement('span'); sp.className='word'; sp.textContent=tok;
            sp.style.transitionDelay=(i*0.05).toFixed(2)+'s'; i++;
            frag.appendChild(sp);
          });
          node.replaceChild(frag,n);
        } else if(n.nodeType===1 && n.tagName!=='BR'){ wrap(n); }
      });
    })(el);
    var ro=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ el.classList.add('lit'); ro.disconnect(); } }); },{threshold:0.4});
    ro.observe(el);
  });

  /* ---- heart burst on finale button ---- */
  function burstHearts(x,y){
    if(reduce) return;
    var glyphs=['♥','✦','♡'];
    for(var k=0;k<14;k++){
      var h=document.createElement('span'); h.className='heart-burst';
      h.textContent=glyphs[k%glyphs.length];
      var ang=Math.random()*Math.PI*2, dist=50+Math.random()*90;
      h.style.left=x+'px'; h.style.top=y+'px';
      h.style.color=['#B23A48','#CB5A78','#3B6EA5'][k%3];
      h.style.setProperty('--dx',(Math.cos(ang)*dist).toFixed(0)+'px');
      h.style.setProperty('--dy',(Math.sin(ang)*dist-40).toFixed(0)+'px');
      h.style.setProperty('--rot',(Math.random()*120-60).toFixed(0)+'deg');
      document.body.appendChild(h);
      setTimeout((function(node){ return function(){ node.remove(); }; })(h),950);
    }
  }
  var finaleBtn=document.getElementById('shareProfile');
  if(finaleBtn){ finaleBtn.addEventListener('click', function(e){ burstHearts(e.clientX,e.clientY); }); }

  /* ---- click a character → springy hop ---- */
  document.querySelectorAll('.cta-avatar,.ward-rail img,.values-float').forEach(function(img){
    img.addEventListener('click',function(){
      img.classList.remove('hop');           // restart if mid-animation
      void img.offsetWidth;                   // reflow so the class re-applies
      img.classList.add('hop');
    });
    img.addEventListener('animationend',function(e){ if(e.animationName==='hop') img.classList.remove('hop'); });
  });

  /* ---- mobile nav menu (hamburger) ---- */
  var navToggle=document.getElementById('navToggle'), navLinks=document.getElementById('navlinks');
  if(navToggle && navLinks){
    function setMenu(open){
      navLinks.classList.toggle('open',open);
      navToggle.setAttribute('aria-expanded',open?'true':'false');
      navToggle.setAttribute('aria-label',open?'关闭菜单':'打开菜单');
    }
    navToggle.addEventListener('click',function(){ setMenu(!navLinks.classList.contains('open')); });
    navLinks.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ setMenu(false); }); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') setMenu(false); });
  }
})();
