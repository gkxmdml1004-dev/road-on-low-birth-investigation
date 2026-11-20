const $=id=>document.getElementById(id);
const state={topic:0,case:0,evidence:new Set(),notes:true};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

function parseHash(){
  const p=new URLSearchParams(location.hash.slice(1));
  const ti=TRAINING_DATA.findIndex(t=>t.slug===p.get('topic'));
  if(ti>=0)state.topic=ti;
  const ci=Number(p.get('case'))-1;
  if(ci>=0&&ci<TRAINING_DATA[state.topic].cases.length)state.case=ci;
}
function syncHash(){const t=TRAINING_DATA[state.topic];history.replaceState(null,'',`#topic=${t.slug}&case=${state.case+1}`)}
function markup(text){
  const re=/\[\[([^\]]+)\]\]|\{\{([^}|]+)(?:\|([^}]+))?\}\}/g;
  let html='',last=0,m;
  while((m=re.exec(text))){
    html+=esc(text.slice(last,m.index));
    const word=(m[1]||m[2]).trim(),cue=(m[3]||'기사 증거').trim();
    html+=`<button class="evidence-word ${state.evidence.has(word)?'collected':''}" data-evidence="${esc(word)}" title="${esc(cue)}">${esc(word)}</button>`;
    last=re.lastIndex;
  }
  return html+esc(text.slice(last));
}
function hanjaHTML(hanja,plain){
  if(!hanja)return '';
  const [head,...tail]=hanja.split(' · ');
  const readings=tail.join(' · ').split(',').map(item=>{
    const m=item.trim().match(/^(.+)\(([^)]+)\)$/);
    return m?`${m[2]} ${m[1].trim()}`:item.trim();
  }).join(' · ');
  return `<small>한자로 살펴보기</small><span class="hanja-card"><b>${esc(head)}</b><i>${esc(readings)}</i><em>${esc(plain)}</em></span>`;
}
function titleHanja(hanja){
  if(!hanja)return '';
  const head=hanja.split(' · ')[0];
  const inParens=head.match(/\(([^)]+)\)/);
  if(inParens)return `(${inParens[1]})`;
  const chars=(head.match(/[\u3400-\u9fff]+/g)||[]).join('');
  return chars?`(${chars})`:'';
}
function renderNav(){
  $('topic-nav').innerHTML=TRAINING_DATA.map((t,i)=>`<button class="${i===state.topic?'active':''}" data-topic="${i}" style="--topic:${t.color}">${esc(t.title)} <small>${t.cases.length}</small></button>`).join('');
  const topic=TRAINING_DATA[state.topic];
  $('case-nav').innerHTML=topic.cases.map((c,i)=>`<button class="${i===state.case?'active':''}" data-case="${i}" style="--topic:${topic.color}">사건 ${i+1}</button>`).join('');
}
function renderArticle(){
  const topic=TRAINING_DATA[state.topic],c=topic.cases[state.case];
  document.documentElement.style.setProperty('--topic',topic.color);
  $('case-kicker').textContent=`${topic.title} · 사건 ${state.case+1}`;
  $('open-student-app').href=c.id?`${topic.appUrl}${topic.slug==='low-birth'||topic.slug==='aging'?`?case=${state.case+1}`:''}`:topic.appUrl;
  const images=c.images.length?`<div class="article-images">${c.images.map(x=>`<figure><img src="${esc(x.src)}" alt="${esc(x.alt)}"><figcaption>${esc(x.caption)}</figcaption></figure>`).join('')}</div>`:'';
  $('article-card').innerHTML=`<div class="paper-meta"><span>ROAD ON 어린이 사회 신문</span><b>${esc(topic.title)}</b></div><h1>${esc(c.title)}</h1><div class="source-name"><span><b>기사 출처</b>${esc(c.meta)}</span><span><b>기사 날짜</b>${esc(c.articleDate)}</span></div>${images}<div class="article-body">${c.paragraphs.map(p=>`<p>${markup(p)}</p>`).join('')}</div>${c.note?`<div class="article-note"><strong>자료 읽기 주의</strong><br>${esc(c.note)}</div>`:''}${c.sourceUrl?`<a class="article-source" href="${esc(c.sourceUrl)}" target="_blank" rel="noopener">원문: ${esc(c.sourceLabel)} ↗</a>`:''}`;
  $('glossary').innerHTML=(c.glossary.map(([w,dictionary,easy,hanja,plain])=>`<button data-glossary><strong><b>${esc(w)}${esc(titleHanja(hanja))}</b><i>＋</i></strong><span class="glossary-detail"><small>낱말의 기본 뜻</small><em>${esc(dictionary)}</em><small>기사 속에서는</small><em>${esc(easy)}</em>${hanjaHTML(hanja,plain)}</span></button>`).join('')||'<p>별도 낱말 풀이가 없는 기사입니다.</p>')+`<p class="dictionary-source">낱말의 기본 뜻은 <a href="https://stdict.korean.go.kr/" target="_blank" rel="noopener">표준국어대사전</a>과 <a href="https://opendict.korean.go.kr/" target="_blank" rel="noopener">우리말샘</a>의 뜻풀이 방식을 참고하여 어린이용으로 풀어썼습니다.</p>`;
  $('training-question').textContent=`“${c.question}”을 학생에게 묻기 전에, 어떤 증거 낱말을 먼저 찾게 하면 좋을까요?`;
  renderTray();
}
function renderTray(){
  $('evidence-count').textContent=state.evidence.size;
  $('evidence-tray').innerHTML=state.evidence.size?[...state.evidence].map(w=>`<span>${esc(w)}</span>`).join(''):'<p>기사에서 색칠된 낱말을 눌러 보세요.</p>';
}
function render(){renderNav();renderArticle();$('teacher-notes').hidden=!state.notes;$('toggle-notes').textContent=state.notes?'교사 해설 숨기기':'교사 해설 보기';$('toggle-notes').setAttribute('aria-expanded',String(state.notes));syncHash()}

document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.topic!==undefined){state.topic=Number(b.dataset.topic);state.case=0;state.evidence.clear();render();return}
  if(b.dataset.case!==undefined){state.case=Number(b.dataset.case);state.evidence.clear();render();return}
  if(b.dataset.evidence!==undefined){const w=b.dataset.evidence;state.evidence.has(w)?state.evidence.delete(w):state.evidence.add(w);renderArticle();return}
  if(b.dataset.glossary!==undefined){b.classList.toggle('open');return}
});
$('reset-evidence').onclick=()=>{state.evidence.clear();renderArticle()};
$('toggle-notes').onclick=()=>{state.notes=!state.notes;render()};
parseHash();
$('article-count').textContent=TRAINING_DATA.reduce((n,t)=>n+t.cases.length,0);
render();
