/* Нейросети: выбор модели, цена, вкладки. Общий для sk-ai и sk-ai-more. Данные — af-data.js */
(function(){
'use strict';
var D=window.AF_DATA,MD=D.models,QK=D.quick;
var MORE=/sk-ai-more\/[^\/]*$/.test(location.pathname);
var SOUND=[{k:'suno',n:'Suno AI',mode:'song',pr:'20 кр',u:20,t:'песня'},{k:'eleven',n:'ElevenLabs',mode:'voice',pr:'95 кр / 1000 зн.',u:95,t:'озвучка'}];
MD.sound=SOUND;
QK.sound=['suno','eleven'];
var DEF={chat:'gpt-5-6-sol',photo:'seedream-5-5',video:'grok-imagine-1-5',sound:'suno'};
var FILE={chat:['sk-ai','ai-chat.html'],photo:['sk-ai','ai-photo.html'],video:['sk-ai','ai-video.html'],sound:['sk-ai-more','ai-sound.html']};
var LIST={chat:'models.html',photo:'models-photo.html',video:'models-video.html',sound:'models-sound.html'};
var BYK={};['chat','photo','video','sound'].forEach(function(k){BYK[k]={};MD[k].forEach(function(m){BYK[k][m.k]=m})});

function $(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function param(n){var m=location.search.match(new RegExp('[?&]'+n+'=([^&]*)'));return m?decodeURIComponent(m[1].replace(/\+/g,' ')):null}
function href(folder,file,q){var base=(MORE===(folder==='sk-ai-more'))?'':'../'+folder+'/';return base+file+(q?'?'+q:'')}
function tabHref(kind,q){return href(FILE[kind][0],FILE[kind][1],q)}
function listHref(kind,q){return href('sk-ai-more',LIST[kind],q)}
function cur(kind){var m=param('m');if(m&&BYK[kind][m]){ls('af.m.'+kind,m);return m}
  m=ls('af.m.'+kind);return(m&&BYK[kind][m])?m:DEF[kind]}
function setCur(kind,k){ls('af.m.'+kind,k);try{history.replaceState(null,'',location.pathname+'?m='+encodeURIComponent(k))}catch(e){}}

/* ---------- цены ---------- */
function priceTxt(kind,m){
  if(kind==='chat')return m.p==null?'цена уточняется':m.p+' кр';
  if(kind==='sound')return m.pr;
  return m.pr}
function gridKey(d,q){return(d==null?'':d)+'|'+(q==null?'':q)}
function gridCell(m,d,q){return m.grid?m.grid[gridKey(d,q)]:null}
function videoDefault(m){
  if(m.kind==='fixed')return{};
  var best=null,bk=null;
  Object.keys(m.grid).forEach(function(k){var v=m.grid[k][0];if(best===null||v<best){best=v;bk=k}});
  var p=bk.split('|');var d=p[0]===''?null:(isNaN(+p[0])?p[0]:+p[0]);
  return{d:d,q:p[1]===''?null:p[1]}}
function videoPrice(m,st){
  if(m.kind==='fixed')return m.fixed+' кр';
  var c=gridCell(m,st.d,st.q);if(!c)return m.pr;
  return(c[1]?'от ':'')+c[0]+' кр'}
function voicePrice(n){return Math.ceil(n/1000)*95}

/* ---------- значки ---------- */
var FILL=['#f7a4c9','#fffaf0','#f5dc73'];
function icon(kind,i){var f=FILL[i%3];
  if(kind==='photo')return'<svg class="stk" viewBox="0 0 38 34"><path class="cut" fill="'+f+'" d="m5 7 27-2 1.8 21.4L6.6 28.8Z"/><path class="fine" d="m8.5 23 7-7.5 4.5 4.5 3.5-5 5 7.5"/><circle cx="12" cy="12" r="1.5" fill="#29262a"/></svg>';
  if(kind==='video')return'<svg class="stk" viewBox="0 0 38 34"><path class="cut" fill="'+f+'" d="m4 6.5 25.5-2 2.3 22.6-26.2 1.6Z"/><path class="cut" fill="#29262a" d="m13.5 11.4 10.2 6.3-10 6Z"/></svg>';
  return'<svg class="stk" viewBox="0 0 38 34"><path class="cut" fill="'+f+'" d="M5.2 5.4 31.6 4.2 34 7l-1 14.4-11.5 1.6-8.7 6.6.2-6.2-8.6-1.4L3 8Z"/><path class="fine" d="M10 11.5h15M10 16h9"/></svg>'}
var SONGIC='<svg class="stk" viewBox="0 0 38 34"><path class="cut" fill="#f5dc73" d="m11.5 5.5 20-2.7.7 18.8-4.1.4-.4-9.3-12 1.7.3 11.6Z"/><ellipse cx="9.5" cy="26" rx="5" ry="4" class="cut" fill="#fffaf0" transform="rotate(-18 9.5 26)"/><ellipse cx="26" cy="23.8" rx="5" ry="4" class="cut" fill="#fffaf0" transform="rotate(-18 26 23.8)"/></svg>';
var VOICEIC='<svg class="stk" viewBox="0 0 38 34"><path class="cut" fill="#f7a4c9" d="m5 8 27-2.5 1.6 20.5L6.6 28Z"/><path class="fine" d="M11 17.5v3M15.5 13v11M20 15.5v6M24.5 11v14M29 16v4"/></svg>';
var ARROW='<svg viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 7h14M10 2l5 5-5 5"/></svg>';
function newTag(m){return m.new?'<span class="af-new">Новинка</span>':''}

/* ---------- общее для вкладок ---------- */
function tabCommon(kind){ls('af.tab',kind)}

function renderPick(kind,m){
  $('selname').textContent=m.n;$('selprice').textContent=priceTxt(kind,m);
  var t=$('seltag');if(t){if(m.new){t.hidden=false;t.className='af-new';t.textContent='Новинка'}else{t.hidden=true}}
  if(kind==='photo'){var im=$('selimg');if(im&&m.img)im.src=m.img}
}
/* три строки под карточкой: выбранная меняется местами с прежней, остальные остаются на месте */
function slotsFor(kind,sel){var q=QK[kind],s=q.slice(1),i=q.indexOf(sel);if(i>0)s[i-1]=q[0];return s}
function renderRows(kind,sel,slots,onPick){
  var box=$('rows');if(!box)return;
  var rows=slots.map(function(k){return BYK[kind][k]});
  box.innerHTML=rows.map(function(m,i){return'<button type="button" class="row" data-i="'+i+'" data-k="'+m.k+'"><span class="ic">'+icon(kind,i)+'</span><strong>'+esc(m.n)+newTag(m)+'</strong><em>'+esc(priceTxt(kind,m))+'</em></button>'}).join('')+
   '<a class="row all" id="all" href="'+listHref(kind,'m='+sel)+'"><strong>Все модели · '+MD[kind].length+'</strong>'+ARROW+'</a>';
  [].forEach.call(box.querySelectorAll('.row[data-k]'),function(b){b.onclick=function(){onPick(+b.dataset.i)}});
  var sw=$('swap');if(sw&&kind!=='chat')sw.href=listHref(kind,'m='+sel);
  if(sw&&kind==='chat')sw.href=href('sk-ai-more','change.html','m='+sel);
}

/* ---------- чат ---------- */
var CHIPS={greet:'Придумай поздравление маме',script:'Напиши сценарий ролика про кота'};
function initChat(){
  tabCommon('chat');var sel=cur('chat'),slots=slotsFor('chat',sel),fld=document.querySelector('.field'),cta=$('cta');
  function link(){var q=(fld.value||'').trim();
    cta.href=href('sk-ai-more','chat.html','m='+sel+(q?'&q='+encodeURIComponent(q):''))}
  function draw(){var m=BYK.chat[sel];renderPick('chat',m);renderRows('chat',sel,slots,function(i){var k=slots[i];slots[i]=sel;sel=k;setCur('chat',k);draw()});
    $('ctaprice').textContent=priceTxt('chat',m);link()}
  [].forEach.call(document.querySelectorAll('.chip[data-q]'),function(c){c.onclick=function(){fld.value=CHIPS[c.dataset.q];link();fld.focus()}});
  fld.addEventListener('input',link);draw();
}

/* ---------- фото ---------- */
function initPhoto(){
  tabCommon('photo');var sel=cur('photo'),slots=slotsFor('photo',sel);
  function draw(){var m=BYK.photo[sel];renderPick('photo',m);renderRows('photo',sel,slots,function(i){var k=slots[i];slots[i]=sel;sel=k;setCur('photo',k);draw()});$('ctaprice').textContent=priceTxt('photo',m)}
  [].forEach.call(document.querySelectorAll('.opts .opt'),function(b){b.onclick=function(){[].forEach.call(b.parentNode.querySelectorAll('.opt'),function(x){x.setAttribute('aria-pressed',String(x===b))})}});
  draw();
}

/* ---------- видео ---------- */
function initVideo(){
  tabCommon('video');var sel=cur('video'),st={},slots=slotsFor('video',sel);
  var od=$('optd'),oq=$('optq');
  function lab(v){return typeof v==='number'?v+' с':v}
  function drawOpts(m){
    var dsl=m.ds||[],qsl=m.qs||[];
    if(m.kind==='fixed'){od.hidden=false;od.innerHTML='<span class="af-one">Цена одна</span>';oq.innerHTML='';oq.hidden=true;od.setAttribute('aria-label','Цена');return}
    function grp(box,list,key,other,mk){
      box.hidden=list.length===0;if(!list.length){box.innerHTML='';return}
      box.innerHTML=list.map(function(v){
        var d=key==='d'?v:st.d,q=key==='q'?v:st.q,ok=!!gridCell(m,d,q);
        return'<button type="button" class="opt" data-v="'+esc(v)+'" aria-pressed="'+(v===st[key])+'"'+(ok?'':' aria-disabled="true" disabled')+'>'+esc(lab(v))+'</button>'}).join('');
      [].forEach.call(box.querySelectorAll('.opt'),function(b){b.onclick=function(){var v=b.dataset.v;st[key]=(typeof list[0]==='number')?+v:v;draw()}});
    }
    od.setAttribute('aria-label',typeof dsl[0]==='string'?'Режим':'Длина');
    grp(od,dsl,'d');grp(oq,qsl,'q');
  }
  function draw(){var m=BYK.video[sel];renderPick('video',m);
    renderRows('video',sel,slots,function(i){var k=slots[i];slots[i]=sel;sel=k;setCur('video',k);st=videoDefault(BYK.video[k]);draw()});
    drawOpts(m);$('ctaprice').textContent=videoPrice(m,st)}
  st=videoDefault(BYK.video[sel]);draw();
  (function(){
    /* ролики-примеры: ставим src при загрузке, играет только карточка, видимая целиком, не больше трёх */
    [].forEach.call(document.querySelectorAll('source[data-clip]'),function(s){s.src=s.dataset.clip;s.parentNode.load()});
    var row=$('exr');if(!row)return;
    var reduce=matchMedia('(prefers-reduced-motion: reduce)'),vs=[].slice.call(row.querySelectorAll('video')),ft=document.querySelector('footer');
    function sync(){var r=row.getBoundingClientRect(),top=ft.getBoundingClientRect().top,n=0;
      vs.forEach(function(v){var b=v.parentNode.getBoundingClientRect();
        var vis=Math.min(b.bottom,top)-Math.max(b.top,0),full=!reduce.matches&&!document.hidden&&b.left>=r.left-1&&b.right<=r.right+1&&vis>=b.height*.6;
        if(full&&n<3){n++;v.play().catch(function(){})}else{v.pause()}})}
    var raf=0;function go(){cancelAnimationFrame(raf);raf=requestAnimationFrame(sync)}
    row.addEventListener('scroll',go,{passive:true});addEventListener('scroll',go,{passive:true});addEventListener('resize',go);addEventListener('load',go);document.addEventListener('visibilitychange',go);
    vs.forEach(function(v){v.pause()});go();
  })();
}

/* ---------- звук ---------- */
function initSound(){
  tabCommon('sound');
  var sel=cur('sound'),txt={song:'',voice:''},fld=$('fld'),cnt=$('cnt');
  function mode(){return BYK.sound[sel].mode}
  function price(){var m=BYK.sound[sel];if(m.mode==='song')return m.pr;var n=fld.value.length;return n?voicePrice(n)+' кр':m.pr}
  function draw(pop){
    var m=BYK.sound[sel],v=m.mode==='voice';
    $('o1').setAttribute('aria-pressed',String(!v));$('o2').setAttribute('aria-pressed',String(v));
    $('selname').textContent=m.n;$('selprice').textContent=m.pr;$('seltag').textContent=m.t;$('seltag').className='af-for';$('seltag').hidden=false;
    $('selic').innerHTML=v?VOICEIC:SONGIC;
    $('swap').href=listHref('sound','m='+sel);
    fld.placeholder=v?'Что озвучить':'О чём песня';fld.setAttribute('aria-label',fld.placeholder);
    $('exs').hidden=v;$('exv').hidden=!v;
    $('ctaprice').textContent=price();count();
    if(pop){var i=document.querySelector('.pick-now .info');i.classList.remove('af-pop');void i.offsetWidth;i.classList.add('af-pop')}
  }
  function count(){var m=BYK.sound[sel];
    if(m.mode==='song'){cnt.textContent='Песня целиком · 20 кр';return}
    var n=fld.value.length;cnt.textContent=n?n+' зн. · '+voicePrice(n)+' кр':'1000 зн. · 95 кр'}
  function setMode(v){if((mode()==='voice')===v)return;txt[mode()]=fld.value;sel=v?'eleven':'suno';setCur('sound',sel);if(typeof exStop==='function')exStop();fld.value=txt[mode()];draw(true)}
  $('o1').onclick=function(){setMode(false)};$('o2').onclick=function(){setMode(true)};
  fld.addEventListener('input',function(){$('ctaprice').textContent=price();count()});
  draw(false);
}

/* ---------- списки моделей ---------- */
function initList(kind){
  tabCommon(kind);var sel=cur(kind);
  var rows=[].slice.call(document.querySelectorAll('.am-row'));
  rows.forEach(function(r){var k=r.dataset.k,on=k===sel;r.classList.toggle('on',on);
    r.href=(on&&kind==='photo')?href('sk-ai-more','model.html','m='+k):tabHref(kind,'m='+k)});
  var back=document.querySelector('.am-back a');if(back)back.href=tabHref(kind,'m='+sel);
  var fams=document.querySelector('.am-fams');if(fams)halfCut(fams,'.am-fam');
}

/* ---------- шторка «Сменить» в чате ---------- */
function initSheet(){
  tabCommon('chat');var sel=cur('chat'),list=QK.chat.slice();if(list.indexOf(sel)<0)list.push(sel);
  var ul=document.querySelector('.am-sheet ul'),CHECK='<svg viewBox="0 0 14 13"><path d="m2 7 3.5 3.5L12 3"/></svg>';
  function draw(){
    ul.innerHTML=list.map(function(k,i){var m=BYK.chat[k];return'<li><button type="button" class="am-sr" data-k="'+k+'" aria-pressed="'+(k===sel)+'"><span class="ic">'+icon('chat',i)+'</span><strong>'+esc(m.n)+'</strong><em>'+esc(priceTxt('chat',m))+'</em><span class="mk">'+CHECK+'</span></button></li>'}).join('');
    [].forEach.call(ul.querySelectorAll('.am-sr'),function(b){b.onclick=function(){sel=b.dataset.k;draw()}});
    var m=BYK.chat[sel];$('selname').textContent=m.n;$('selprice').textContent=priceTxt('chat',m);$('ctaprice').textContent=priceTxt('chat',m);
    $('done').href=tabHref('chat','m='+sel);$('all').href=listHref('chat','m='+sel);
  }
  draw();
}

/* ---------- карточка модели (фото) ---------- */
function initCard(){
  tabCommon('photo');var sel=cur('photo'),m=BYK.photo[sel];
  document.title='Chappy · Нейросети · '+m.n;
  $('cname').textContent=m.n;$('cprice').textContent=m.pr;$('cptr').textContent=m.pr;
  var t=$('ctag');t.hidden=!m.new;
  var im=$('cimg');if(im&&m.img)im.src=m.img;
  $('cpick').href=tabHref('photo','m='+sel);
  var back=document.querySelector('.am-back a');if(back)back.href=listHref('photo','m='+sel);
}

/* ---------- ответ чата ---------- */
var ANS={
 greet:{q:'Придумай поздравление маме',a:['Мамочка, с днём рождения!','Спасибо за тепло, заботу и добрые руки. Пусть дома всегда пахнет пирогами, а на душе будет весна.','Здоровья тебе и побольше поводов улыбаться.']},
 script:{q:'Напиши сценарий ролика про кота',a:['Кадр 1. Кот сидит на подоконнике и следит за каплями дождя.','Кадр 2. Лапа тянется к капле на стекле, капля убегает вниз.','Кадр 3. Хозяйка открывает окно, кот запрыгивает ей на плечо. Титр: «Дождь — тоже игра».']}
};
function initAnswer(){
  tabCommon('chat');var sel=cur('chat'),m=BYK.chat[sel],q=(param('q')||ANS.greet.q).trim();
  var key=/сценар/i.test(q)?'script':(/поздрав/i.test(q)?'greet':null);
  $('selname').textContent=m.n;$('selprice').textContent=priceTxt('chat',m);
  $('bq').textContent=q;
  var a=key?ANS[key].a:['Здесь появится ответ выбранной модели на этот вопрос.'];
  $('ba').innerHTML=a.map(function(p){return'<p>'+esc(p)+'</p>'}).join('')+'<p class="am-by">'+esc(m.n)+'</p>';
  $('cost').textContent=m.p==null?'цена уточняется':'−'+m.p+' кр · осталось '+(56-m.p)+' кр';
  $('ctaprice').textContent=priceTxt('chat',m);
  if(m.p!=null){var pu=document.querySelector('.purse');if(pu){pu.textContent=(56-m.p)+' кр';pu.setAttribute('aria-label','Баланс '+(56-m.p)+' кредитов')}}
  $('swap').href=href('sk-ai-more','change.html','m='+sel);
  $('back').href=tabHref('chat','m='+sel);
}

/* ---------- ряд листается: последняя карточка наполовину ---------- */
function halfCut(row,sel){
  function fit(){
    var items=[].slice.call(row.querySelectorAll(sel));if(items.length<3)return;
    row.style.gap='';items.forEach(function(i){i.style.paddingLeft='';i.style.paddingRight=''});
    var cs=getComputedStyle(row),pad=parseFloat(cs.paddingLeft)||0,g0=parseFloat(cs.columnGap)||6,W=row.getBoundingClientRect().width;
    var p0=parseFloat(getComputedStyle(items[0]).paddingLeft)||0;
    var ws=items.map(function(i){return i.getBoundingClientRect().width});
    var x=pad,c=-1,i;for(i=0;i<items.length;i++){if(x+ws[i]>W+.5){c=i;break}x+=ws[i]+g0}
    if(c<1)return;
    var sum=0;for(i=0;i<c;i++)sum+=ws[i];
    var dp=(W-pad-sum-c*g0-.5*ws[c])/(2*c+1);dp=Math.max(-3,Math.min(5,dp));
    var g=(W-pad-sum-2*c*dp-.5*(ws[c]+2*dp))/c;g=Math.max(4,Math.min(14,g));
    items.forEach(function(it){it.style.paddingLeft=it.style.paddingRight=(p0+dp).toFixed(1)+'px'});
    row.style.gap=g.toFixed(1)+'px';
  }
  fit();addEventListener('resize',fit);addEventListener('load',fit);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
}

/* ---------- запуск ---------- */
var root=document.querySelector('[data-af]');if(!root)return;
var t=root.getAttribute('data-af').split('-');
({tab:function(){({chat:initChat,photo:initPhoto,video:initVideo,sound:initSound})[t[1]]();
    window.AF={cur:cur,gridCell:gridCell,videoPrice:videoPrice,BYK:BYK}},
  list:function(){initList(t[1])},sheet:initSheet,card:initCard,answer:initAnswer})[t[0]]();
if(t[0]!=='tab')window.AF={cur:cur,BYK:BYK};
})();
