/* hf-data: общая таблица «что выбрали» для шагов создания (главная → фото → проверь → готовим).
   Ключ идёт в адресе: ?t=<ключ>. Без ключа экраны остаются как в макете («Кинопортрет»).
   n — название, p — цена как на карточке (null — на экранах цены нет), i — картинка, o — позиция кадра,
   m — «твоё фото» того же пола, что и пример, mo — его позиция, s — песня (ведёт в song.html), t — инструмент. */
(function(){
var BAL=56,
T={
  kino:{n:"Кинопортрет",p:"13 кр",i:"kino.jpg",o:"58% 30%",m:"tr-sport.jpg",mo:"50% 12%"},
  motion:{n:"Оживить фото",p:"от 23 кр",i:"clip-spin-poster.jpg",o:"47% 50%",m:"ava-face.jpg",mo:""},
  neon:{n:"Неоновый дождь",p:"5 кр",i:"neon.jpg",o:"50% 35%",m:"ava-face.jpg",mo:""},
  future:{n:"Город будущего",p:"159 кр",i:"clip-future-poster.jpg",o:"50% 40%",m:"ava-face.jpg",mo:""},
  fashion:{n:"Алое платье",p:"13 кр",i:"fashion.jpg",o:"50% 40%",m:"ava-face.jpg",mo:""},
  spacecat:{n:"Кот в космосе",p:"от 23 кр",i:"clip-spacecat-poster.jpg",o:"50% 30%",m:"ava-face.jpg",mo:""},
  avatar:{n:"Деловой портрет",p:"13 кр",i:"tr-avatar.jpg",o:"50% 22%",m:"ava-face.jpg",mo:""},
  retro:{n:"Жаркое лето",p:"5 кр",i:"tr-retro.jpg",o:"50% 25%",m:"ava-face.jpg",mo:""},
  anime:{n:"Закатный ветер",p:"5 кр",i:"tr-anime.jpg",o:"50% 22%",m:"ava-face.jpg",mo:""},
  sport:{n:"На старте",p:"от 23 кр",i:"clip-sport-poster.jpg",o:"50% 25%",m:"kino.jpg",mo:"58% 25%"},
  dance:{n:"Ночной танец",p:"от 23 кр",i:"clip-dance-poster.jpg",o:"50% 25%",m:"ava-face.jpg",mo:""},
  gothic:{n:"Тёмная готика",p:"13 кр",i:"tr-gothic.jpg",o:"45% 22%",m:"ava-face.jpg",mo:""},
  star:{n:"Красная дорожка",p:"13 кр",i:"tr-star.jpg",o:"55% 22%",m:"ava-face.jpg",mo:""},
  song:{n:"Песня-поздравление",p:"23 кр",i:"clip-sing-poster.jpg",o:"50% 30%",m:"ava-face.jpg",mo:"",s:1},
  love:{n:"Моё место рядом с тобой",p:"23 кр",i:"ava-hero.jpg",o:"50% 22%",m:"ava-face.jpg",mo:"",s:1},
  summer:{n:"Этим летом мы вдвоём",p:"23 кр",i:"mira-4.jpg",o:"50% 22%",m:"ava-face.jpg",mo:"",s:1},
  /* составные форматы (19.11, довод «Вкладки»). c — составной формат: экран trend.html?t=<ключ> без ленты, шаги идут с параметром s (compose | own).
     card: цена — сумма существующих (Песня-поздравление 23 кр + Оживить фото от 23 кр = от 46 кр), цена — сумма, уточнить у владельца;
     parts — строки «Проверь».
     clip: цена 108 кр взята со старых экранов «Создать» (create-b/create.html, «Мини-клип · 108 кр»), в таблице hf-data её раньше не было — уточнить у владельца. */
  card:{n:"Живая открытка",p:"от 46 кр",i:"mira-5.jpg",o:"50% 22%",m:"ava-face.jpg",mo:"",c:1,parts:[["Песня","23 кр"],["Оживление","от 23 кр"]]},
  clip:{n:"Мини-клип",p:"108 кр",i:"tr-dance.jpg",o:"50% 25%",m:"ava-face.jpg",mo:"",c:1},
  'tool-swap':{n:"Замена лица",p:null,m:'ava-face.jpg',mo:'',t:1,svg:"<svg viewBox=\"0 0 44 40\"><path d=\"M3 10c4-6 12-6 16-1 3 4 2 12-4 14C6 25 0 19 3 10Z\" class=\"bg\"/><circle cx=\"14\" cy=\"15\" r=\"6.5\"/><path d=\"M11.5 16.5q2.5 2 5 0\"/><circle cx=\"30\" cy=\"27\" r=\"6.5\"/><path d=\"M27.5 28.5q2.5 2 5 0\"/><path d=\"M24 9h10m-3.5-3.5L34 9l-3.5 3.5M20 33H10m3.5-3.5L10 33l3.5 3.5\"/></svg>"},
  'tool-tryon':{n:"Примерка",p:null,m:'ava-face.jpg',mo:'',t:1,svg:"<svg viewBox=\"0 0 44 40\"><path d=\"M4 31 21 11l17 20c1 1.5 0 3-1.5 3h-31C4 34 3 32.5 4 31Z\" class=\"bg\"/><path d=\"M21 12v-2.2c0-1.600 3.200-2 3.200-4.800 0-2.200-1.800-3.300-3.700-3.300-2 0-3.300 1.300-3.300 3\"/><path d=\"M4.5 31 21 14l16.5 17q1 3-1.5 3H6.5q-2.5 0-2-3Z\"/></svg>"},
  'tool-nobg':{n:"Убрать фон",p:null,m:'ava-face.jpg',mo:'',t:1,svg:"<svg viewBox=\"0 0 44 40\"><path d=\"M5 6h32v28H5Z\" class=\"bg\"/><rect x=\"5\" y=\"5\" width=\"34\" height=\"30\" rx=\"2\" stroke-dasharray=\"3.5 3.5\"/><circle cx=\"22\" cy=\"16\" r=\"5\"/><path d=\"M12 31c0-7 5-10.5 10-10.5S32 24 32 31\"/></svg>"},
  'tool-hq':{n:"Улучшить качество",p:null,m:'ava-face.jpg',mo:'',t:1,svg:"<svg viewBox=\"0 0 44 40\"><path d=\"M4 8h36v26H4Z\" class=\"bg\"/><path d=\"M10 4H5.5Q4 4 4 5.5V10M34 4h4.5Q40 4 40 5.5V10M10 36H5.5Q4 36 4 34.5V30M34 36h4.5q1.5 0 1.5-1.5V30\"/><path d=\"M22 10l3.2 7.2L32.5 20.5l-7.3 3.3L22 31l-3.2-7.2L11.5 20.5l7.3-3.3Z\"/></svg>"},
  'tool-alive':{n:"Оживить фото",p:"от 23 кр",m:'ava-face.jpg',mo:'',t:1,svg:"<svg viewBox=\"0 0 44 40\"><path d=\"M5 8h34v26H5Z\" class=\"bg\"/><rect x=\"4\" y=\"6\" width=\"36\" height=\"28\" rx=\"2\"/><path d=\"M18 13l11 7-11 7Z\"/><path d=\"M9 37h26\" stroke-dasharray=\"2 4\"/></svg>"},
  'tool-prompt':{n:"Промпт по фото",p:null,m:'ava-face.jpg',mo:'',t:1,svg:"<svg viewBox=\"0 0 44 40\"><path d=\"M9 7h18l8 8v21H9Z\" class=\"bg\"/><path d=\"M8 4h19l8 8v24H8Z\"/><path d=\"M27 4v8h8\"/><path d=\"M13 29h10M13 24h4\"/><path d=\"M26 18l1.7 4.3 4.3 1.7-4.3 1.7L26 30l-1.7-4.3L20 24l4.3-1.7Z\"/></svg>"}
};
var q=new URLSearchParams(location.search),k=q.get('t');
if(!k||!T[k]){k=decodeURIComponent(location.hash.slice(1));}
var has=!!(k&&T[k]);if(!has)k='kino';
var it=T[k];
function num(p){var m=p&&/(\d+)/.exec(p);return m?+m[1]:0}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
window.HF={T:T,k:k,it:it,has:has,bal:BAL,price:num(it.p),
 /* ссылка на шаг с тем же ключом */
 go:function(h,extra){if(!has)return h+(extra?'?'+extra:'');var s=q.get('s');return h+'?t='+encodeURIComponent(k)+(s?'&s='+encodeURIComponent(s):'')+(extra?'&'+extra:'')},
 fill:function(root){root=root||document;
  root.querySelectorAll('[data-hf-go]').forEach(function(a){if(has)a.setAttribute('href',HF.go(a.getAttribute('data-hf-go')))});
  root.querySelectorAll('[data-hf=name]').forEach(function(e){e.textContent=it.n});
  root.querySelectorAll('[data-hf=price]').forEach(function(e){if(it.p)e.textContent=it.p;else{var b=e.closest('[data-hf-box]')||e;if(b.tagName==='LI')b.remove();else b.hidden=true}});
  root.querySelectorAll('[data-hf=img]').forEach(function(e){
    if(it.t){var s=document.createElement('span');s.className='hf-ico';s.innerHTML=it.svg;e.replaceWith(s);return}
    e.setAttribute('src','img/'+it.i);e.style.objectPosition=it.o});
  root.querySelectorAll('[data-hf=me]').forEach(function(e){e.setAttribute('src','img/'+it.m);e.style.objectPosition=it.mo||''});
  root.querySelectorAll('[data-hf=svgimg]').forEach(function(e){e.setAttribute('href','img/'+(it.t?it.m:it.i))});
  root.querySelectorAll('[data-hf=text]').forEach(function(e){var f=e.getAttribute('data-hf-t');e.textContent=f.replace('{n}',it.n).replace('{p}',it.p||'').replace('{m}',it.p?'−'+num(it.p)+' кр':'')});
 }};
})();
