/* Нейросети: выбор модели, цена, вкладки. Общий для sk-ai и sk-ai-more. Данные — af-data.js */
(function(){
'use strict';
/* ПРИМЕР, ждёт решения владельца: правила суточного лимита и памяти ещё не названы */
var FREE_TOTAL=10,FREE_LEFT=7,MEM_START=33,MEM_STEP=9;
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
function newTag(m){return isNew(m)?'<span class="ab-new" role="img" aria-label="Новая модель">NEW</span>':''}
/* сведения о модели: AF_DATA.about[ключ] = {line,strong[],more[],input,src,draft}; нет — работают facts */
function AB(k){var a=D.about;return(a&&a[k])||null}
function inputOf(kind,m){var a=AB(m.k);/* 19.11.2026: в данных «text» значит «фото необязательно» — у фото и видео зону своего фото оставляем */if(a&&a.input)return(a.input==='text'&&(kind==='photo'||kind==='video'))?'text+photo':a.input;var i=(D.inputs||{})[m.k];if(i)return i;return(kind==='photo'||kind==='video')?'text+photo':'text'}
function lineOf2(kind,m){var a=AB(m.k);return(a&&a.line)?a.line:lineOf(kind,m)}

/* ---------- общее для вкладок ---------- */
function tabCommon(kind){ls('af.tab',kind)}
var KINDS=['chat','photo','video','sound'];
var WORK='work.html';
function workHref(k,q){return href('sk-ai',WORK,'m='+encodeURIComponent(k)+(q?'&q='+encodeURIComponent(q):''))}
var NEWRE=/^Нов/;
function isNew(m){return !!m.new||NEWRE.test(m.s||'')}
var FAMS={
 chat:{chatgpt:'ChatGPT',claude:'Claude',gemini:'Gemini','grok-text':'Grok',deepseek:'DeepSeek',perplexity:'Perplexity','gpt-5-6':'GPT-5.6',qwen:'Qwen',minimax:'MiniMax'},
 photo:{flux:'FLUX',imagen4:'Imagen',gpt_image:'GPT Image',flux_2:'FLUX 2',flux_3:'FLUX 3',grok_imagine_image:'Grok Imagine',ideogram_v3:'Ideogram',seedream:'Seedream',nano_banana:'Nano Banana',recraft:'Recraft',recraft_tools:'Recraft Tools',minimax_h3:'MiniMax H3'},
 video:{veo:'VEO',wan:'Wan',runway:'Runway',kling:'Kling','gemini-omni':'Gemini Omni',seedance:'Seedance','grok-imagine':'Grok Imagine',happyhorse:'HappyHorse',pixverse:'Pixverse',luma:'Luma',omnihuman:'OmniHuman'},
 sound:{}};
/* число для «самая доступная»: чат — p, фото — число из «от N кр», видео — base */
function numPrice(kind,m){if(kind==='chat')return m.p;if(kind==='video')return m.base;if(kind==='photo'){var x=/\d+/.exec(m.pr||'');return x?+x[0]:null}return null}
var CHEAP={};
['chat','photo','video'].forEach(function(kind){var b=null,bk=null,tie=false;
  MD[kind].forEach(function(m){var v=numPrice(kind,m);if(v==null)return;if(b===null||v<b){b=v;bk=m.k;tie=false}else if(v===b)tie=true});
  if(bk&&!tie)CHEAP[kind]=bk});
/* сильные стороны — только из данных: метка каталога (s), опции таблицы цен (facts, сетка цен), самая низкая цена в виде */
function strengths(kind,m){
  var a=[],f=(D.facts||{})[m.k]||{};
  if(kind==='sound'){a.push(m.mode==='song'?'Песня целиком':'Озвучка текста');return a}
  if(m.s&&!NEWRE.test(m.s))a.push(m.s);
  if(CHEAP[kind]===m.k)a.push('Самая доступная');
  if(kind==='video'){
    if(f.snd)a.push('Со звуком');
    var ds=m.ds||[],qs=m.qs||[];
    if(ds.length&&typeof ds[0]==='string')a.push(ds.join(' / '));
    else if(ds.length>1)a.push('До '+Math.max.apply(null,ds)+' с');
    if(qs.length>1)a.push('До '+qs[qs.length-1]);
  }
  if(kind==='photo'){
    if(f.res&&f.res!=='1K')a.push('До '+f.res);
    if(f.n)a.push('До '+f.n+' картинок');
  }
  return a.slice(0,3)}
function lineOf(kind,m){return strengths(kind,m).slice(0,2).join(' · ')}
function pictoOf(kind,m,i){
  if(kind==='sound')return m.mode==='voice'?VOICEIC:SONGIC;
  return icon(kind,i)}
var CHEV='<svg viewBox="0 0 14 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 5 5 5-5"/></svg>';

/* ---------- шаг 1: список нейросетей вида ---------- */
function rowHtml(kind,m,i){
  var ln=lineOf2(kind,m),pic=(kind==='photo'&&m.img)?'<span class="th"><img src="'+m.img+'" alt=""></span>':'<span class="ic">'+pictoOf(kind,m,i)+'</span>';
  return'<a class="ac-r" href="'+workHref(m.k)+'">'+pic+'<span class="tx"><strong>'+esc(m.n)+newTag(m)+'</strong>'+(ln?'<small>'+esc(ln)+'</small>':'')+'</span><em>'+esc(priceTxt(kind,m))+'</em></a>'}
function initCat(kind){
  var q=param('q'),pm=param('m');
  if(q||(pm&&BYK[kind][pm])){location.replace(workHref((pm&&BYK[kind][pm])?pm:cur(kind),q));return}
  var saved=ls('af.tab');
  if(!location.search&&saved&&saved!==kind&&FILE[saved]){location.replace(tabHref(saved,'t=1'));return}
  tabCommon(kind);
  var all=MD[kind],box=$('ac'),h='';
  var news=all.filter(isNew);
  if(news.length){
    h+='<section class="ac-s" aria-label="Новинки"><h2 class="ac-h"><span>Новинки</span></h2><div class="ac-row" id="acnew" tabindex="0">'+
      news.map(function(m,i){var ab=AB(m.k),ln=(ab&&ab.strong&&ab.strong.length)?ab.strong[0]:lineOf(kind,m),
        cv=(kind==='photo'&&m.img)?'<img src="'+m.img+'" alt="">':pictoOf(kind,m,i);
        return'<a class="ac-c" href="'+workHref(m.k)+'"><span class="ac-cv c'+(i%3)+'">'+cv+newTag(m)+'</span><strong>'+esc(m.n)+'</strong>'+(ln?'<small>'+esc(ln)+'</small>':'')+'<span class="plate">'+esc(priceTxt(kind,m))+'</span></a>'}).join('')+'</div></section>'}
  var rec=QK[kind].map(function(k){return BYK[kind][k]}).filter(Boolean);
  h+='<section class="ac-s" aria-label="Популярные"><h2 class="ac-h"><span>Популярные</span></h2><div class="ac-recs">'+rec.map(function(m,i){return rowHtml(kind,m,i)}).join('')+'</div></section>';
  if(all.length>rec.length){
    var order=[],groups={};
    all.forEach(function(m){var f=m.f||'';if(!groups[f]){groups[f]=[];order.push(f)}groups[f].push(m)});
    var full=order.map(function(f){var fm=FAMS[kind][f];
      return(fm?'<h3 class="ac-g">'+esc(fm)+'</h3>':'')+groups[f].map(function(m,i){return rowHtml(kind,m,i)}).join('')}).join('');
    h+='<section class="ac-s" aria-label="Все"><button type="button" class="ac-all" id="acallb" aria-expanded="false" aria-controls="acfull"><strong>Все · '+all.length+'</strong>'+CHEV+'</button><div class="ac-full" id="acfull" hidden>'+full+'<a class="ac-r ac-find" href="'+listHref(kind)+'"><span class="tx"><strong>Искать в списке</strong></span>'+ARROW+'</a></div></section>'}
  box.innerHTML=h;
  var b=$('acallb');if(b)b.onclick=function(){var o=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(o));$('acfull').hidden=!o};
  var nr=$('acnew');if(nr)halfCut(nr,'.ac-c');
}

/* ---------- шаг 2: экран одной модели ---------- */
var CHATQ={plan:'Составь план поста о запуске нового сервиса',letter:'Напиши письмо клиенту о сроках заказа'};
var ANS_W={
 plan:['План поста.','1. Заголовок: что нового и зачем это нужно.','2. Три коротких пункта пользы для клиента.','3. Призыв: попробовать уже сегодня.'],
 letter:['Здравствуйте!','Подтверждаем получение вашего заказа. Срок выполнения — три рабочих дня, о готовности сообщим отдельно.','С уважением, команда.']};
var BAL=56;
function setBal(n){var p=$('purse');p.textContent=n+' кр';p.setAttribute('aria-label','Баланс '+n+' кредитов, пополнить')}
function collapse(){var s=$('str');if(s)s.classList.add('is-min')}
function p1(a){return a.map(function(x){return'<p>'+esc(x)+'</p>'}).join('')}

function paintCard(kind,m){
  document.title='Chappy · '+m.n;$('selname').textContent=m.n;
  var a=AB(m.k),tags=(a&&a.strong&&a.strong.length)?a.strong.slice(0,3):strengths(kind,m),line=(a&&a.line)||'',nw=isNew(m);
  $('newtag').hidden=!nw;
  var ln=$('line');ln.textContent=line;ln.hidden=!line;
  $('tags').innerHTML=tags.map(function(t){return'<span class="ac-tag">'+esc(t)+'</span>'}).join('');
  $('str').classList.toggle('has-line',!!line);
  $('one').textContent=line||tags.slice(0,2).join(' · ');
  $('str').classList.toggle('no-tags',!tags.length&&!line&&!nw);
  $('selprice').textContent=priceTxt(kind,m)}
function workChat(m0){
  var m=m0,fld=$('fld'),form=$('compose'),th=$('thread'),bal=BAL,sendP=$('ctaprice'),send=$('send');
  var freeLeft=(param('free')!=null&&!isNaN(+param('free')))?Math.max(0,Math.min(FREE_TOTAL,+param('free'))):FREE_LEFT;
  var mem=param('full')==='1'?100:MEM_START;
  function paintSend(){
    var showP=freeLeft<=0&&m.p!=null;
    sendP.style.display=showP?'':'none';
    if(showP)sendP.textContent=m.p+' кр';
    send.setAttribute('aria-label',showP?'Отправить за '+m.p+' кр':(freeLeft>0?'Отправить бесплатно':'Отправить'))}
  function paintMeters(){
    $('freeTxt').textContent='Бесплатно сегодня · '+freeLeft+' из '+FREE_TOTAL;
    $('freeBar').style.width=(freeLeft/FREE_TOTAL*100)+'%';
    $('memBar').style.width=mem+'%';
    var full=mem>=100;
    $('compose').hidden=full;$('fullbar').hidden=!full;$('meters').classList.toggle('is-full',full);
    if(full){collapse()}}
  function end(){var l=th.lastElementChild;if(l&&l.scrollIntoView)l.scrollIntoView({block:'end',behavior:'smooth'})}
  function addBot(txt,html,cost){
    var w=document.createElement('div');w.className='ac-m';
    w.innerHTML='<span class="ac-av" aria-hidden="true">'+esc(m.n.charAt(0).toUpperCase())+'</span><div class="ac-b">'+html+'</div>';th.appendChild(w);
    if(cost){var c=document.createElement('div');c.className='ac-cost';c.textContent=cost;th.appendChild(c)}}
  function addUser(t){var u=document.createElement('div');u.className='ac-u';u.textContent=t;th.appendChild(u)}
  if(mem>=100){addUser(CHATQ.plan);addBot('',p1(ANS_W.plan),'бесплатно')}
  /* смена модели: список открывается здесь же, лента остаётся */
  var swb=$('swb'),sw=$('sw');
  function drawSw(){
    sw.innerHTML=MD.chat.filter(function(x){return x.k!==m.k}).map(function(x){return'<button type="button" class="ac-sr" data-k="'+x.k+'"><strong>'+esc(x.n)+newTag(x)+'</strong><em>'+esc(priceTxt('chat',x))+'</em></button>'}).join('');
    [].forEach.call(sw.querySelectorAll('.ac-sr'),function(b){b.onclick=function(){pick(b.dataset.k)}})}
  function openSw(o){sw.hidden=!o;swb.setAttribute('aria-expanded',String(o));if(o){drawSw();sw.scrollTop=0}}
  swb.onclick=function(){openSw(sw.hidden)};
  function pick(k){
    m=BYK.chat[k];ls('af.m.chat',k);try{history.replaceState(null,'',location.pathname+'?m='+encodeURIComponent(k)+(mem>=100?'&full=1':''))}catch(e){}
    paintCard('chat',m);paintSend();openSw(false);
    var s=document.createElement('div');s.className='ac-sep';s.textContent='Дальше отвечает '+m.n;th.appendChild(s);end()}
  $('newchat').onclick=function(){th.innerHTML='';mem=MEM_START;$('str').classList.remove('is-min');paintMeters();paintSend()};
  form.addEventListener('submit',function(e){
    e.preventDefault();var txt=(fld.value||'').trim();if(!txt)return;
    fld.value='';collapse();openSw(false);
    addUser(txt);
    var w=document.createElement('div');w.className='ac-m';
    w.innerHTML='<span class="ac-av" aria-hidden="true">'+esc(m.n.charAt(0).toUpperCase())+'</span><div class="ac-b ac-wait" aria-label="Модель отвечает">…</div>';
    th.appendChild(w);end();
    var cur_=m;
    setTimeout(function(){
      var key=/письм/i.test(txt)?'letter':(/пост|план/i.test(txt)?'plan':null);
      var a=key?ANS_W[key]:['Здесь появится ответ выбранной модели на этот вопрос.'];
      var b=w.querySelector('.ac-b');b.classList.remove('ac-wait');b.removeAttribute('aria-label');b.innerHTML=p1(a);
      var c=document.createElement('div');c.className='ac-cost';
      if(freeLeft>0){freeLeft--;c.textContent='бесплатно'}
      else if(cur_.p==null){c.textContent='цена уточняется'}
      else{bal=Math.max(0,bal-cur_.p);c.textContent='−'+cur_.p+' кр · осталось '+bal+' кр';setBal(bal)}
      th.appendChild(c);mem=Math.min(100,mem+MEM_STEP);paintMeters();paintSend();end()},520);
  });
  paintMeters();paintSend();
}
function workPhoto(m){
  $('fld').placeholder='Опиши картинку';$('fld').setAttribute('aria-label','Опиши картинку');
  $('ctaprice').textContent=priceTxt('photo',m);
  [].forEach.call(document.querySelectorAll('.opts .opt'),function(b){b.onclick=function(){[].forEach.call(b.parentNode.querySelectorAll('.opt'),function(x){x.setAttribute('aria-pressed',String(x===b))})}});
}
function workVideo(m){
  $('fld').placeholder='Опиши видео';$('fld').setAttribute('aria-label','Опиши видео');
  var st=videoDefault(m),od=$('optd'),oq=$('optq');
  function lab(v){return typeof v==='number'?v+' с':v}
  function drawOpts(){
    var dsl=m.ds||[],qsl=m.qs||[];
    if(m.kind==='fixed'){od.hidden=false;od.innerHTML='<span class="af-one">Цена одна</span>';oq.innerHTML='';oq.hidden=true;od.setAttribute('aria-label','Цена');return}
    function grp(box,list,key){
      box.hidden=list.length===0;if(!list.length){box.innerHTML='';return}
      box.innerHTML=list.map(function(v){
        var d=key==='d'?v:st.d,q=key==='q'?v:st.q,ok=!!gridCell(m,d,q);
        return'<button type="button" class="opt" data-v="'+esc(v)+'" aria-pressed="'+(v===st[key])+'"'+(ok?'':' aria-disabled="true" disabled')+'>'+esc(lab(v))+'</button>'}).join('');
      [].forEach.call(box.querySelectorAll('.opt'),function(b){b.onclick=function(){var v=b.dataset.v;st[key]=(typeof list[0]==='number')?+v:v;draw()}});
    }
    od.setAttribute('aria-label',typeof dsl[0]==='string'?'Режим':'Длина');
    grp(od,dsl,'d');grp(oq,qsl,'q');
  }
  function draw(){drawOpts();$('ctaprice').textContent=videoPrice(m,st)}
  draw();
}
function exVideos(){
  var row=$('exr');if(!row)return function(){};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)'),vs=[].slice.call(row.querySelectorAll('video'));
  function sync(){
    if(!row.offsetParent){vs.forEach(function(v){v.pause()});return}
    var r=row.getBoundingClientRect(),n=0;
    vs.forEach(function(v){if(!v.getAttribute('src')){v.src=v.dataset.src;v.load()}
      var b=v.parentNode.getBoundingClientRect();
      var vis=Math.min(b.bottom,innerHeight)-Math.max(b.top,0),full=!reduce.matches&&!document.hidden&&b.left>=r.left-1&&b.right<=r.right+1&&vis>=b.height*.6;
      if(full&&n<3){n++;v.play().catch(function(){})}else{v.pause()}})}
  var raf=0;function go(){cancelAnimationFrame(raf);raf=requestAnimationFrame(sync)}
  row.addEventListener('scroll',go,{passive:true});addEventListener('scroll',go,{passive:true});addEventListener('resize',go);document.addEventListener('visibilitychange',go);
  vs.forEach(function(v){v.pause()});return go;
}
function workSound(m){
  var v=m.mode==='voice',fld=$('fld'),cnt=$('cnt');
  function price(){if(!v)return m.pr;var n=fld.value.length;return n?voicePrice(n)+' кр':m.pr}
  function count(){if(!v){cnt.hidden=true;return}
    var n=fld.value.length;cnt.textContent=n?n+' зн. · '+voicePrice(n)+' кр':'1000 зн. · 95 кр'}
  fld.placeholder=v?'Что озвучить':'О чём песня';fld.setAttribute('aria-label',fld.placeholder);
  function upd(){$('ctaprice').textContent=price();count()}
  fld.addEventListener('input',upd);upd();
  var es=$('exs'),ev=$('exv');if(v){es.parentNode.removeChild(es);ev.hidden=false}else{ev.parentNode.removeChild(ev)}
  $('abexn').textContent='Примеры · '+document.querySelectorAll('#abexp .ex-sc').length;bindTg($('abexb'));
  /* примеры: звук только по нажатию, источник один, уход с экрана — тишина */
  var live=null;
  function exUI(c,on){var b=c.querySelector('.ex-cv');b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',(on?'Пауза: ':'Слушать: ')+c.dataset.t);c.classList.toggle('on',on)}
  function exBar(c,a){var i=c.querySelector('.ex-pg i');i.style.transform='scaleX('+(a&&a.duration>0&&isFinite(a.duration)?Math.min(1,a.currentTime/a.duration):0)+')'}
  function exStop(){if(!live)return;var a=live.a,c=live.c;live=null;try{a.pause();a.currentTime=0}catch(e){}exUI(c,false);exBar(c,null)}
  function exToggle(c){var a=c.querySelector('audio');if(!a.getAttribute('src'))return;
    if(live&&live.a===a&&!a.paused){a.pause();exUI(c,false);return}
    if(!live||live.a!==a)exStop();
    live={a:a,c:c};exUI(c,true);var p=a.play();if(p&&p.catch)p.catch(function(){if(live&&live.a===a){live=null;exUI(c,false)}})}
  [].forEach.call(document.querySelectorAll('.ex-sc'),function(c){var a=c.querySelector('audio');a.src=a.dataset.audio;
    a.addEventListener('timeupdate',function(){exBar(c,a)});
    a.addEventListener('ended',function(){if(live&&live.a===a)live=null;a.currentTime=0;exUI(c,false);exBar(c,null)});
    a.addEventListener('error',function(){if(live&&live.a===a)live=null;exUI(c,false)});
    c.querySelector('.ex-cv').onclick=function(){exToggle(c)}});
  document.addEventListener('visibilitychange',function(){if(document.hidden)exStop()});addEventListener('pagehide',exStop);
}
/* ---------- форма по смыслу модели, «Примеры» и «О модели» (ab-) ---------- */
var CHEV2='<i aria-hidden="true">'+CHEV+'</i>';
function tgHtml(id,pid,label){return'<button type="button" class="ab-tg" id="'+id+'" aria-expanded="false" aria-controls="'+pid+'"><strong><span>'+label+'</span></strong>'+CHEV2+'</button>'}
function bindTg(b,onOpen){var p=$(b.getAttribute('aria-controls'));b.onclick=function(){var o=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(o));p.hidden=!o;if(onOpen)onOpen(o)}}
function exSet(kind,m){var E=D.examples||{};return E[m.k]||E['*'+kind]||null}
/* фото: карточка «кадр комикса» — наклейка-подпись, картинка в рамке, облачко с запросом; нажатие: запрос в поле или картинка крупнее (ex-k) */
function buildExK(sec,list,hasField){
  var real=list.some(function(e){return/^img\/ex\//.test(e.img||'')});
  sec.innerHTML=tgHtml('abexb','abexp','Примеры · '+list.length)+'<div class="ab-pn" id="abexp" hidden>'+
    '<div class="ex-big" id="exbig" hidden><button type="button" class="ex-bigx" id="exbigx" aria-label="Свернуть картинку"><img alt=""></button></div>'+
    '<div class="ex-row ex-kr" id="exr" tabindex="0">'+list.map(function(e,i){
      var q=e.q!==undefined?e.q:(e.d||''),cap=e.cap||e.t||'',alt=esc(e.d||cap||q),use=!!(hasField&&q);
      return'<button type="button" class="ex-k" data-i="'+i+'" data-q="'+esc(q)+'" data-use="'+(use?1:0)+'" aria-label="'+(use?'Взять запрос: ':'Открыть крупнее: ')+esc(cap||q)+'">'+
        '<span class="ex-kt">'+esc(cap)+'</span>'+
        '<span class="ex-kf"><img src="'+e.img+'" alt="'+alt+'" loading="lazy" style="object-position:'+(e.pos||'50% 40%')+'"></span>'+
        (q?'<span class="ex-kb"><span>'+esc(q)+'</span></span>':'')+'</button>'}).join('')+'</div>'+
    (real?'<p class="ex-src">Примеры со страницы модели</p>':'')+'</div>';
  bindTg($('abexb'));
  var big=$('exbig'),bimg=big.querySelector('img'),cur=-1;
  $('exbigx').onclick=function(){big.hidden=true;cur=-1};
  [].forEach.call(sec.querySelectorAll('.ex-k'),function(b){b.onclick=function(){
    var i=+b.dataset.i;
    if(b.dataset.use==='1'){var f=$('fld');if(!f)return;f.value=b.dataset.q;f.dispatchEvent(new Event('input',{bubbles:true}));if(f.scrollIntoView)f.scrollIntoView({block:'nearest',behavior:'smooth'});return}
    if(cur===i){big.hidden=true;cur=-1;return}
    cur=i;bimg.src=list[i].img;bimg.alt=list[i].cap||list[i].t||'';big.hidden=false}})}
function buildEx(kind,m,hasField){
  var sec=$('abex');if(!sec)return;
  var list=exSet(kind,m);if(!list||!list.length){sec.parentNode.removeChild(sec);return}
  var vid=kind==='video';
  if(!vid){buildExK(sec,list,hasField);return}
  sec.innerHTML=tgHtml('abexb','abexp','Примеры · '+list.length)+'<div class="ab-pn" id="abexp" hidden><div class="ex-row" id="exr" tabindex="0">'+list.map(function(e){
    var cap='<span class="ex-cap">'+esc(e.t)+'</span>',alt=esc(e.d||e.t),
      inner=vid?'<video muted playsinline loop preload="none" poster="'+e.poster+'" data-src="'+e.clip+'" aria-label="'+alt+'" style="object-position:'+(e.pos||'50% 30%')+'"></video>'
        :'<img src="'+e.img+'" alt="'+alt+'" loading="lazy" style="object-position:'+(e.pos||'50% 35%')+'">',
      cls='ex-c'+(vid?' ex-v':'');
    return(hasField&&e.d)?'<button type="button" class="'+cls+' ab-pick" data-d="'+esc(e.d)+'" aria-label="Взять описание: '+esc(e.t)+'">'+inner+cap+'</button>':'<figure class="'+cls+'">'+inner+cap+'</figure>'}).join('')+'</div></div>';
  var go=vid?exVideos():null;
  bindTg($('abexb'),function(){if(go)go()});
  if(hasField)[].forEach.call(sec.querySelectorAll('.ab-pick'),function(b){b.onclick=function(){var f=$('fld');if(!f)return;f.value=b.dataset.d;f.dispatchEvent(new Event('input',{bubbles:true}));if(f.scrollIntoView)f.scrollIntoView({block:'nearest',behavior:'smooth'})}})}
function buildAbout(kind,m,inp){
  var sec=$('aboutsec');if(!sec)return;
  var a=AB(m.k),f=(D.facts||{})[m.k]||{},rows=[],more=(a&&!a.draft&&a.more&&a.more.length)?a.more:[];
  rows.push(['На входе',{'text':'Текст','photo':'Фото','text+photo':'Текст и фото'}[inp]||'Текст']);
  if(kind==='photo'){
    var fm=[].map.call(document.querySelectorAll('#abfmt .opt'),function(b){return b.textContent.trim()});
    if(fm.length)rows.push(['Формат',fm.join(', ')]);
    if(f.res)rows.push(['Размер','до '+f.res]);
    if(f.n)rows.push(['За раз','до '+f.n+' картинок'])}
  if(kind==='video'){
    var ds=m.ds||[],qs=m.qs||[],ms=ds.length&&typeof ds[0]==='string';
    if(ds.length)rows.push([ms?'Режим':'Длина',ms?ds.join(', '):ds.join(' / ')+' с']);
    if(qs.length)rows.push(['Качество',qs.join(', ')]);
    if(f.snd)rows.push(['Звук','есть'])}
  if(kind==='sound')rows.push(['Режим',m.mode==='song'?'Песня целиком':'Озвучка текста']);
  sec.innerHTML=tgHtml('aboutb','aboutp','О модели')+'<div class="ab-pn" id="aboutp" hidden>'+
    (more.length?'<ul class="ab-more">'+more.map(function(t){return'<li>'+esc(t)+'</li>'}).join('')+'</ul>':'')+
    '<dl class="ab-par">'+rows.map(function(r){return'<dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd>'}).join('')+'</dl></div>';
  bindTg($('aboutb'))}
function abForm(kind,m){
  if(kind==='chat')return;
  var inp=inputOf(kind,m),add=document.querySelector('.ab-add'),cta=$('cta'),need=inp==='photo';
  if(inp==='text'&&add){add.parentNode.removeChild(add);add=null}
  if(need){
    ['fld','cnt'].forEach(function(id){var e=$(id);if(e)e.parentNode.removeChild(e)});
    var fm=$('abfmt');if(fm)fm.parentNode.removeChild(fm);
    if(add&&cta){
      var PH='<i><i><svg class="stk" viewBox="0 0 38 34"><path class="cut" fill="#f7a4c9" d="m5 6 27-1.4 1.6 22.6L6.4 28.6Z"/><path class="fine" d="M19 10v13M12.5 16.5h13"/></svg></i></i>',
        EMPTY=PH+'<span class="ab-nm">Добавить своё фото</span><em class="ab-must">Обязательно</em>',
        DONE='<span class="ab-th"><img src="img/ava-face.jpg" alt=""></span><span class="ab-nm">Фото выбрано</span><em class="ab-must">Убрать</em>',
        on=false,t=0;
      add.classList.add('ab-req');add.innerHTML=EMPTY;cta.classList.add('ab-off');cta.setAttribute('aria-disabled','true');
      add.onclick=function(){on=!on;add.innerHTML=on?DONE:EMPTY;add.classList.toggle('has-ph',on);add.classList.remove('is-hl');
        cta.classList.toggle('ab-off',!on);cta.setAttribute('aria-disabled',String(!on))};
      cta.addEventListener('click',function(e){if(on)return;e.preventDefault();e.stopImmediatePropagation();
        add.classList.add('is-hl');clearTimeout(t);t=setTimeout(function(){add.classList.remove('is-hl')},1600)})}}
  buildEx(kind,m,!!$('fld'));
  buildAbout(kind,m,inp)}
function initWork(){
  var k=param('m'),kind=null;
  KINDS.forEach(function(x){if(!kind&&k&&BYK[x][k])kind=x});
  if(!kind){location.replace(tabHref(ls('af.tab')&&FILE[ls('af.tab')]?ls('af.tab'):'chat','t=1'));return}
  var m=BYK[kind][k];tabCommon(kind);ls('af.m.'+kind,k);
  [].forEach.call(document.querySelectorAll('[data-kind]'),function(el){if(el.dataset.kind.split(' ').indexOf(kind)<0)el.parentNode.removeChild(el)});
  $('back').href=tabHref(kind,'t=1');
  paintCard(kind,m);
  ({chat:workChat,photo:workPhoto,video:workVideo,sound:workSound})[kind](m);abForm(kind,m);
  var cta=$('cta');if(cta)cta.addEventListener('click',collapse);
  window.AF={cur:cur,gridCell:gridCell,videoPrice:videoPrice,BYK:BYK,kind:kind};
}

/* ---------- списки моделей ---------- */
function initList(kind){
  tabCommon(kind);
  var rows=[].slice.call(document.querySelectorAll('.am-row'));
  rows.forEach(function(r){r.classList.remove('on');r.href=workHref(r.dataset.k)});
  var back=document.querySelector('.am-back a');if(back)back.href=tabHref(kind,'t=1');
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
 plan:{q:'Составь план поста о запуске нового сервиса',a:['План поста.','1. Заголовок: что нового и зачем это нужно.','2. Три коротких пункта пользы для клиента.','3. Призыв: попробовать уже сегодня.']},
 letter:{q:'Напиши письмо клиенту о сроках заказа',a:['Здравствуйте!','Подтверждаем получение вашего заказа. Срок выполнения — три рабочих дня, о готовности сообщим отдельно.','С уважением, команда.']}
};
function initAnswer(){
  tabCommon('chat');var sel=cur('chat'),m=BYK.chat[sel],q=(param('q')||ANS.plan.q).trim();
  var key=/письм/i.test(q)?'letter':(/пост|план/i.test(q)?'plan':null);
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
({cat:function(){initCat(t[1])},work:initWork,
  list:function(){initList(t[1])},sheet:initSheet,card:initCard,answer:initAnswer})[t[0]]();
if(t[0]!=='work')window.AF={cur:cur,BYK:BYK};
})();

/* 19.11.2026: промпт из «Моё» — ?q=текст подставляется в поле ввода */
(function(){try{var q=new URLSearchParams(location.search).get('q');if(!q)return;var put=function(){var f=document.querySelector('input.field,textarea.field');if(f){f.value=q;f.dispatchEvent(new Event('input',{bubbles:true}))}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',put);else put()}catch(e){}})();
