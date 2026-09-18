/* Content adapter: preserve the original eight screens and their interactions. */
const requestedCase=Number(new URLSearchParams(location.search).get('case'));
const caseIndex=[1,2,3].includes(requestedCase)?requestedCase-1:0;
const lesson=CASES[caseIndex];
const comparisonLabels=lesson.compareLabels;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const screen=n=>document.querySelector(`.screen[data-page="${n}"]`);
const external=(title,url)=>`<a href="${esc(url)}" class="source-link" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a>`;
document.querySelectorAll('.case-chip').forEach(el=>{
  const nav=document.createElement('nav');
  nav.className='case-nav';
  nav.setAttribute('aria-label','고령화 사건 이동');
  CASES.forEach((_,i)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='case-nav-button'+(i===caseIndex?' current':'');
    button.textContent=`고령화 사건 0${i+1}`;
    if(i===caseIndex){button.setAttribute('aria-current','page');button.disabled=true;}
    else button.onclick=()=>openCaseUnlock(i);
    nav.append(button);
  });
  el.replaceWith(nav);
});
// Original opening screen and three rules stay intact. Change its copy only.
screen(1).querySelector('.lead').textContent='단서를 이어 무슨 일이 있었을지 생각해 봅시다.';
document.querySelector('.intro-cue').textContent='어떤 일이 있었을까요? 먼저 서로 질문하고, 사건 봉투를 열어보세요.';
const themeHero=document.createElement('aside');themeHero.className='theme-hero';themeHero.innerHTML=`<img src="../assets/theme-aging.png" alt=""><strong>고령화 사건 <em class="hero-case-number">${caseIndex+1}</em></strong><span>단서를 살펴보고 사회의 변화를 찾아보세요.</span>`;screen(1).querySelector('.intro-copy').after(themeHero);
const selector=document.createElement('dialog');selector.id='caseSelector';selector.setAttribute('aria-labelledby','caseSelectorTitle');selector.innerHTML=`<h2 id="caseSelectorTitle">수업 사건 선택</h2><p>오늘 탐구하는 대주제 코드를 입력하세요.</p><input id="caseCode" inputmode="text" maxlength="10" autocomplete="off" placeholder="대주제" aria-label="수업 진행 코드"><p id="caseCodeError" role="alert"></p><div id="caseChoices" hidden><p>선택한 사건만 공개됩니다. 사건을 바꾸면 현재 활동은 처음부터 시작합니다.</p>${CASES.map((d,i)=>`<p><a class="ghost" href="?case=${i+1}">사건 ${i+1} · ${esc(d.title)}</a></p>`).join('')}</div><div class="actions"><button class="ghost" id="closeCaseSelector">돌아가기</button><button class="primary" id="unlockCases">확인</button></div>`;document.body.append(selector);
let requestedCaseIndex=null;
function openCaseUnlock(index){requestedCaseIndex=index;document.getElementById('caseSelectorTitle').textContent=`고령화 사건 0${index+1} 열기`;document.getElementById('caseCode').value='';document.getElementById('caseCodeError').textContent='';document.getElementById('caseChoices').hidden=true;document.getElementById('unlockCases').hidden=false;selector.showModal();document.getElementById('caseCode').focus()}
document.getElementById('closeCaseSelector').onclick=()=>selector.close();
document.getElementById('unlockCases').onclick=()=>{if(document.getElementById('caseCode').value.trim()!=='고령화'){document.getElementById('caseCodeError').textContent='대주제 코드를 확인해 주세요.';document.getElementById('caseCode').select();return;}if(requestedCaseIndex===null)return;location.href=`?case=${requestedCaseIndex+1}`;};
document.getElementById('caseCode').onkeydown=e=>{if(e.key==='Enter')document.getElementById('unlockCases').click()};
const pageShortNames=['사건 도착','단서 추리','기사 수사','자료 수사','현장 확인','비교 탐구','사건 해결','탐정 보고서'];
document.querySelectorAll('.screen').forEach(section=>{
  const currentPage=Number(section.dataset.page);
  const nav=document.createElement('nav');
  nav.className='page-jump-nav';
  nav.setAttribute('aria-label','페이지 바로가기');
  nav.innerHTML='<span class="page-jump-label">바로가기</span>'+pageShortNames.map((name,i)=>`<button type="button" class="page-jump-button${i+1===currentPage?' current':''}" data-jump-page="${i+1}" aria-label="${i+1}페이지 ${name}"${i+1===currentPage?' disabled aria-current="page"':''}>${i+1}</button>`).join('');
  section.querySelector('.topbar').after(nav);
  const articleShortcut=document.createElement('div');
  articleShortcut.className='article-shortcut';
  articleShortcut.innerHTML=`<button type="button" class="article-shortcut-button"${currentPage===3?' disabled aria-current="page"':''}>${currentPage===3?'현재 기사문을 보고 있습니다':'기사문 바로가기'}</button>`;
  if(currentPage!==3)articleShortcut.querySelector('button').onclick=()=>openPageUnlock(3);
  section.querySelector('.shell').append(articleShortcut);
});
const pageUnlock=document.createElement('dialog');
pageUnlock.id='pageUnlockDialog';
pageUnlock.className='lesson-dialog page-unlock-dialog';
pageUnlock.setAttribute('aria-labelledby','pageUnlockTitle');
pageUnlock.innerHTML='<h2 id="pageUnlockTitle">페이지 바로가기</h2><p id="pageUnlockGuide"></p><input id="pageUnlockCode" type="text" maxlength="12" autocomplete="off" placeholder="페이지 코드" aria-label="페이지 바로가기 코드"><p id="pageUnlockError" class="code-error" role="alert"></p><div class="actions"><button type="button" class="ghost" id="cancelPageUnlock">돌아가기</button><button type="button" class="primary" id="confirmPageUnlock">페이지 열기</button></div>';
document.body.append(pageUnlock);
let requestedPage=1;
function openPageUnlock(page){requestedPage=page;document.getElementById('pageUnlockTitle').textContent=`${page}페이지 바로가기`;document.getElementById('pageUnlockGuide').textContent=`대주제 코드와 페이지 숫자를 붙여 입력하세요. (예: 고령화${page})`;document.getElementById('pageUnlockCode').value='';document.getElementById('pageUnlockError').textContent='';pageUnlock.showModal();document.getElementById('pageUnlockCode').focus()}
function updatePageNav(page){document.querySelectorAll('.page-jump-button').forEach(button=>{const active=Number(button.dataset.jumpPage)===page;button.classList.toggle('current',active);button.disabled=active;if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')})}
document.querySelectorAll('.page-jump-button').forEach(button=>button.onclick=()=>openPageUnlock(Number(button.dataset.jumpPage)));
document.getElementById('cancelPageUnlock').onclick=()=>pageUnlock.close();
function confirmPageUnlock(){const input=document.getElementById('pageUnlockCode');if(input.value.trim()!==`고령화${requestedPage}`){document.getElementById('pageUnlockError').textContent='페이지 코드를 다시 확인해 주세요.';input.select();return}pageUnlock.close();go(requestedPage)}
document.getElementById('confirmPageUnlock').onclick=confirmPageUnlock;
document.getElementById('pageUnlockCode').onkeydown=e=>{if(e.key==='Enter')confirmPageUnlock()};
// Newspaper layout, dotted evidence words and glossary interactions are unchanged.
const article=screen(3).querySelector('.article');article.querySelector('h3').textContent=lesson.articleTitle;article.querySelector('.article-meta').textContent=lesson.meta;
article.querySelector('.article-body').innerHTML=lesson.paragraphs.map(p=>'<p>'+esc(p).replace(/\[\[(.*?)\]\]/g,(_,w)=>`<button class="evidence-word" data-evidence="${w}">${w}</button>` )+'</p>').join('');
article.querySelector('.micro').innerHTML=`출처: ${(lesson.sources||[[lesson.sourceTitle,lesson.source]]).map(([title,url])=>external(title,url)).join('<br>')}<br>기사와 수업 주제를 연결해 어린이용으로 재구성함.`;
if(lesson.interview){
  const interview=document.createElement('blockquote');
  interview.className='article-interview';
  interview.innerHTML=`<span>참여자 인터뷰</span><p>“${esc(lesson.interview)}”</p><cite>— ${esc(lesson.interviewBy||'교육 참여자')}</cite>`;
  article.querySelector('.article-body').append(interview);
}
if(lesson.relatedLinks){
  const related=document.createElement('section');
  related.className='article-related';
  related.innerHTML=`<h3>더 읽어볼 관련 기사</h3><p>궁금한 키워드를 골라 다양한 인터뷰와 사례를 살펴보세요.</p><div>${lesson.relatedLinks.map(([keyword,desc,url])=>`<a href="${url}" target="_blank" rel="noopener" aria-label="${esc(keyword)} 관련 기사 열기" title="${esc(desc)}"><strong>${esc(keyword)}</strong><span class="article-related-arrow" aria-hidden="true">→</span></a>`).join('')}</div>`;
  screen(3).querySelector('.word-help').append(related);
}
screen(3).querySelector('.glossary-list').innerHTML=lesson.glossary.map(([word,meaning],i)=>`<button class="glossary-button" aria-expanded="false" data-meaning="${esc(meaning)}"><span class="glossary-number">${i+1}</span>${esc(word)}</button>`).join('');
const caution=document.createElement('p');caution.className='article-caution';caution.textContent=`자료 읽기 주의 · ${lesson.caution}`;screen(3).querySelector('.word-help').append(caution);
// Use the existing two-panel data cards and original answer buttons.
const stats=lesson.stats;
screen(4).querySelector('.data-grid').innerHTML=stats.map(([value,title,text])=>`<div class="data-card"><div class="big-stat">${value}</div><h3>${title}</h3><p>${text}</p></div>`).join('');
screen(4).querySelector('.check-question h3').textContent=lesson.quiz;
screen(4).querySelectorAll('.data-answer').forEach((b,i)=>b.textContent=lesson.answers[i]);
document.getElementById('toData').textContent='통계 자료 확인';document.getElementById('toVideo').textContent='현장 확인';
// Keep the existing field/video left panel and checkbox panel; adapt resources only.
screen(5).querySelector('.lead').textContent=lesson.fieldQuestion;
if(caseIndex===0){screen(5).querySelector('.video-frame').innerHTML=`<div class="trend-panel"><h3>65세 이상 인구의 변화</h3><p class="trend-question">우리나라 사람이 만약 100명이라면?</p><div class="trend-row"><span>1960년</span><b style="--w:14%">약 3명</b></div><div class="trend-row"><span>1980년</span><b style="--w:19%">약 4명</b></div><div class="trend-row"><span>2000년</span><b style="--w:36%">약 7명</b></div><div class="trend-row"><span>2025년</span><b style="--w:84%">약 20명</b></div><div class="trend-row busan"><span>부산 2024년</span><b style="--w:100%">약 24명</b></div><p class="trend-note">※ 100명 가운데 65세 이상인 사람이 몇 명인지 쉽게 나타낸 값입니다.</p><div class="field-links">${lesson.links.map(([label,url])=>external(label,url)).join('')}</div></div>`;}
else if(caseIndex===1){screen(5).querySelector('.video-frame').innerHTML=`<div><h3 style="color:white">서울의 보행신호 변화</h3><p><strong>서울광장 횡단보도</strong><br>35초 → 40초</p><p><strong>노원역 주변 횡단보도</strong><br>25초 → 29초</p><p class="trend-note">두 장소 모두 천천히 걷는 사람이 더 안전하게 건널 수 있도록 시간이 늘어났습니다.</p><div class="field-links">${lesson.links.map(([label,url])=>external(label,url)).join('')}</div></div>`;}
else{screen(5).querySelector('.video-frame').innerHTML=`<div class="kiosk-field-panel"><div class="kiosk-field-copy"><p class="kiosk-eyebrow">부산 기장읍 “나도 주문” 체험교육</p><h3>미리 연습하고<br>대형마트에서 직접 사용했어요</h3><p>키오스크에 대한 두려움을 줄이고 스스로 사용할 수 있다는 <strong>자신감</strong>을 키우는 활동입니다.</p><ol class="kiosk-steps"><li><b>1</b> 사용법 알아보기</li><li><b>2</b> 모의체험 하기</li><li><b>3</b> 무인기기 사용하기</li></ol><div class="field-links">${lesson.links.map(([label,url])=>external(label,url)).join('')}</div></div></div>`;}
const fieldChecks=lesson.checks;
screen(5).querySelector('.watch-list').innerHTML=`<h3>${caseIndex===0?'통계 자료에서 찾기':'현장 자료에서 찾기'}</h3>${fieldChecks.map(text=>`<label class="watch-item"><input type="checkbox" class="watch-check"> ${esc(text)}</label>`).join('')}<p class="micro">한 가지 이상 직접 확인했다면 표시하세요. 연결 자료는 새 창에서 열립니다.</p>`;
// Keep the two comparison columns and three sentence-card groups, updating their focus.
screen(6).querySelector('.lead').textContent=lesson.comparePrompt;
screen(6).querySelectorAll('.compare-column').forEach((col,i)=>{col.querySelector('h3').textContent=`${i+1}. ${comparisonLabels[i]}`;col.querySelectorAll('.compare-card').forEach(b=>b.remove());lesson.compareOptions[i].forEach(text=>{const b=document.createElement('button');b.className='compare-card';b.dataset.side=i?'hard':'good';b.dataset.correct=String(text===lesson.compareCorrect[i]);b.textContent=text;col.append(b);});});
const headings=['① 사회의 변화','② 변화로 생긴 어려움','③ 해결을 위한 노력'];
screen(7).querySelectorAll('.card>h3').forEach((h,i)=>h.textContent=headings[i]);
screen(7).querySelector('.lead').textContent='사회의 변화로 생긴 어려움과 이를 해결하려는 노력을 낱말 카드로 설명해 보세요.';
screen(7).querySelectorAll('.word-options').forEach((group,i)=>{const correct=lesson.solveCorrect?.[i]||lesson.solveOptions[i][0];group.innerHTML=lesson.solveOptions[i].map(text=>`<button class="word-card" data-correct="${text===correct}">${text}</button>`).join('')});
const socialNote=document.createElement('p');socialNote.className='micro';socialNote.textContent='65세 이상 인구가 늘어나는 현상을 고령화라고 해요. 사람들의 생활에 맞추어 시설과 서비스도 달라집니다.';screen(7).querySelector('.card').append(socialNote);
const report=screen(8).querySelector('.report');report.querySelector(':scope>p').innerHTML=`<strong>사건:</strong> ${esc(lesson.articleTitle)}`;report.querySelector(':scope>.micro').textContent='자료 출처: '+lesson.meta+' · 어린이용 재구성 기사';

const connect=document.createElement('button');connect.className='ghost';connect.textContent='세 사건 연결하기';connect.hidden=true;screen(8).querySelector('.actions').append(connect);
if(caseIndex===2){
  const more=document.createElement('section');
  more.className='more-aging-cases';
  more.hidden=true;
  const articles=[
    ['대학생 봉사','https://www.metroseoul.co.kr/article/20260813500618'],
    ['금융사기','https://www.etnews.com/20260918000025'],
    ['역할극','https://www.e-science.co.kr/news/articleView.html?idxno=135677'],
    ['장보기','https://www.newsis.com/view/NISX20260910_0003784805'],
    ['디지털 안내사','https://www.viva100.com/article/20260918500036'],
    ['AI 강사','https://www.edaily.co.kr/News/Read?newsId=02627286645581432&mediaCodeNo=257']
  ];
  more.innerHTML=`<span class="more-aging-kicker">확장 탐구</span><h2>또 다른 고령화 사건을 찾아볼까요?</h2><p>궁금한 단어를 눌러 사건을 확인해 보세요.</p><div class="more-aging-grid">${articles.map(([keyword,url])=>`<a href="${url}" target="_blank" rel="noopener" aria-label="${keyword} 관련 기사 열기"><strong>${keyword}</strong></a>`).join('')}</div>`;
  screen(8).querySelector('.actions').before(more);
  const thought=document.getElementById('finalThought');
  let thoughtFinished=false;
  const finishThought=()=>{
    if(thoughtFinished||!thought.value.trim())return;
    thoughtFinished=true;
    const shouldSave=confirm('나의 한 줄 생각을 탐정 보고서 이미지로 저장하시겠습니까?');
    if(shouldSave)document.getElementById('savePng').click();
    more.hidden=false;
    requestAnimationFrame(()=>more.scrollIntoView({behavior:'smooth',block:'start'}));
  };
  thought.addEventListener('change',finishThought);
  thought.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();thought.blur();finishThought();}});
}
if(caseIndex<CASES.length-1){const nextCase=document.createElement('button');nextCase.className='primary next-case';nextCase.textContent=`고령화 사건 0${caseIndex+2} 탐구하기`;nextCase.onclick=()=>openCaseUnlock(caseIndex+1);screen(8).querySelector('.actions').append(nextCase);}
let completedCases=[];try{completedCases=JSON.parse(localStorage.getItem('roadon-completed-cases-restored')||'[]');if(!Array.isArray(completedCases))completedCases=[];}catch{}
function markCaseComplete(){if(!completedCases.includes(caseIndex))completedCases.push(caseIndex);try{localStorage.setItem('roadon-completed-cases-restored',JSON.stringify(completedCases));}catch{}connect.hidden=![0,1,2].every(i=>completedCases.includes(i));}
connect.onclick=()=>{const panel=document.createElement('dialog');panel.className='case-connection';panel.innerHTML=`<h2>세 사건 연결하기</h2><h3>고령 인구가 늘어나면서 우리 생활은 어떻게 달라졌을까요?</h3>${CASES.map(d=>`<p>${esc(d.summary)}</p>`).join('')}<p><strong>세 사건에서 사회가 바꾼 시설과 도움은 무엇인가요?</strong></p><button class="primary">보고서로 돌아가기</button>`;document.body.append(panel);panel.querySelector('button').onclick=()=>{panel.close();panel.remove()};panel.showModal();};
document.getElementById('pageLabel').textContent=`1페이지 사건 도착(오늘의 사건) · 고령화 사건 ${caseIndex+1}`;

const locationBox=document.createElement('section');locationBox.className='article-location precise-location';
if(caseIndex===0){locationBox.innerHTML=`<h3>자료가 보여주는 범위</h3><div class="scope-badge">대한민국 전체<br><strong>1960년 2.9% → 2025년 20.3%</strong></div><div class="scope-badge busan">부산광역시<br><strong>2024년 23.9%</strong></div>${lesson.links.map(([label,url])=>external(label,url)).join('')}`;}
else if(caseIndex===1){locationBox.innerHTML=`<h3>보행신호가 달라진 곳</h3><p><strong>서울광장과 노원역 주변 횡단보도</strong></p><p class="micro">교통약자가 더 안전하게 길을 건널 수 있도록 보행신호 시간이 늘어났습니다.</p>${external('서울시 원문 확인',lesson.source)}`;}
else{locationBox.innerHTML=`<h3>현장교육 사례</h3><p><strong>${esc(lesson.region)} · ${esc(lesson.place)}</strong></p><p class="micro">${esc(lesson.address)}</p>${lesson.links.map(([label,url])=>external(label,url)).join('')}`;}
screen(3).querySelector('.word-help').append(locationBox);
const wordHelp=document.createElement('p');wordHelp.id='clueWordHelp';wordHelp.className='clue-word-help';document.getElementById('clueHint').after(wordHelp);
const startDialog=document.createElement('dialog');startDialog.id='articleStartDialog';startDialog.className='lesson-dialog';startDialog.setAttribute('aria-labelledby','articleStartTitle');startDialog.innerHTML='<h2 id="articleStartTitle">기사문으로 사건 탐구를 시작하시겠습니까?</h2><p>우리의 예상이 맞는지 기사 속 증거를 찾아보세요.</p><div class="actions"><button class="primary" id="startArticleYes">네, 탐구하겠습니다.</button><button class="ghost" id="startArticleNo">아니오, 단서를 더 살펴보겠습니다.</button></div>';document.body.append(startDialog);
function askArticleStart(){startDialog.showModal();document.getElementById('startArticleYes').focus();}
document.getElementById('startArticleYes').onclick=()=>{startDialog.close();go(3)};
document.getElementById('startArticleNo').onclick=()=>{startDialog.close();document.getElementById('finishClues').focus()};
startDialog.addEventListener('cancel',()=>setTimeout(()=>document.getElementById('finishClues').focus(),0));
document.getElementById('finalThought').maxLength=200;




