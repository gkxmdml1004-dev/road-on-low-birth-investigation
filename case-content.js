/* Content adapter: preserve the original eight screens and their interactions. */
const requestedCase=Number(new URLSearchParams(location.search).get('case'));
const caseIndex=[1,2,3].includes(requestedCase)?requestedCase-1:0;
const lesson=CASES[caseIndex];
// The opening question is itself a clue for case 2: do not reveal 신입생 first.
if(caseIndex===1)lesson.clues=[{value:'○○○',hint:'학교에 무엇이 없었을까요? 여러 가지로 예상해 보세요.',options:['학생','선생님','교실']},...lesson.clues];
const comparisonLabels=lesson.compareLabels;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const screen=n=>document.querySelector(`.screen[data-page="${n}"]`);
const external=(title,url)=>`<a href="${esc(url)}" class="source-link" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a>`;
document.querySelectorAll('.case-chip').forEach(el=>{
  const nav=document.createElement('nav');
  nav.className='case-nav';
  nav.setAttribute('aria-label','저출산 사건 이동');
  CASES.forEach((_,i)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='case-nav-button'+(i===caseIndex?' current':'');
    button.textContent=`저출산 사건 0${i+1}`;
    if(i===caseIndex){button.setAttribute('aria-current','page');button.disabled=true;}
    else button.onclick=()=>openCaseUnlock(i);
    nav.append(button);
  });
  el.replaceWith(nav);
});
// Original opening screen and three rules stay intact. Change its copy only.
screen(1).querySelector('.lead').textContent=`${lesson.title}. ${lesson.question}`;
document.querySelector('.intro-cue').textContent='어떤 일이 있었을까요? 먼저 서로 질문하고, 사건 봉투를 열어보세요.';
const selector=document.createElement('dialog');selector.id='caseSelector';selector.setAttribute('aria-labelledby','caseSelectorTitle');selector.innerHTML=`<h2 id="caseSelectorTitle">수업 사건 선택</h2><p>오늘 탐구하는 대주제 코드를 입력하세요.</p><input id="caseCode" inputmode="text" maxlength="10" autocomplete="off" placeholder="대주제" aria-label="수업 진행 코드"><p id="caseCodeError" role="alert"></p><div id="caseChoices" hidden><p>선택한 사건만 공개됩니다. 사건을 바꾸면 현재 활동은 처음부터 시작합니다.</p>${CASES.map((d,i)=>`<p><a class="ghost" href="?case=${i+1}">사건 ${i+1} · ${esc(d.title)}</a></p>`).join('')}</div><div class="actions"><button class="ghost" id="closeCaseSelector">돌아가기</button><button class="primary" id="unlockCases">확인</button></div>`;document.body.append(selector);
let requestedCaseIndex=null;
function openCaseUnlock(index){requestedCaseIndex=index;document.getElementById('caseSelectorTitle').textContent=`저출산 사건 0${index+1} 열기`;document.getElementById('caseCode').value='';document.getElementById('caseCodeError').textContent='';document.getElementById('caseChoices').hidden=true;document.getElementById('unlockCases').hidden=false;selector.showModal();document.getElementById('caseCode').focus()}
document.getElementById('closeCaseSelector').onclick=()=>selector.close();
document.getElementById('unlockCases').onclick=()=>{if(document.getElementById('caseCode').value.trim()!=='저출산'){document.getElementById('caseCodeError').textContent='대주제 코드를 확인해 주세요.';document.getElementById('caseCode').select();return;}if(requestedCaseIndex===null)return;location.href=`?case=${requestedCaseIndex+1}`;};
document.getElementById('caseCode').onkeydown=e=>{if(e.key==='Enter')document.getElementById('unlockCases').click()};
// Newspaper layout, dotted evidence words and glossary interactions are unchanged.
const article=screen(3).querySelector('.article');article.querySelector('h3').textContent=lesson.articleTitle;article.querySelector('.article-meta').textContent=lesson.meta;
article.querySelector('.article-body').innerHTML=lesson.paragraphs.map(p=>'<p>'+esc(p).replace(/\[\[(.*?)\]\]/g,(_,w)=>`<button class="evidence-word" data-evidence="${w}">${w}</button>` )+'</p>').join('');
article.querySelector('.micro').innerHTML=`출처: ${(lesson.sources||[[lesson.sourceTitle,lesson.source]]).map(([title,url])=>external(title,url)).join('<br>')}<br>기사와 수업 주제를 연결해 어린이용으로 재구성함.`;
screen(3).querySelector('.glossary-list').innerHTML=lesson.glossary.map(([word,meaning],i)=>`<button class="glossary-button" aria-expanded="false" data-meaning="${esc(meaning)}"><span class="glossary-number">${i+1}</span>${esc(word)}</button>`).join('');
const caution=document.createElement('p');caution.className='micro';caution.textContent=lesson.caution;screen(3).querySelector('.word-help').append(caution);
// Use the existing two-panel data cards and original answer buttons.
const stats=lesson.stats;
screen(4).querySelector('.data-grid').innerHTML=stats.map(([value,title,text])=>`<div class="data-card"><div class="big-stat">${value}</div><h3>${title}</h3><p>${text}</p></div>`).join('');
screen(4).querySelector('.check-question h3').textContent=lesson.quiz;
screen(4).querySelectorAll('.data-answer').forEach((b,i)=>b.textContent=lesson.answers[i]);
document.getElementById('toData').textContent='통계 자료 확인';document.getElementById('toVideo').textContent='현장 확인';
// Keep the existing field/video left panel and checkbox panel; adapt resources only.
screen(5).querySelector('.lead').textContent=lesson.fieldQuestion;
const places=caseIndex===1?['강서구','기장군','영도구','금정구']:[lesson.place];
screen(5).querySelector('.video-frame').innerHTML=`<div><div style="font-size:56px">${caseIndex===0?'▶':'⌖'}</div><h3 style="color:white">${esc(lesson.place)}</h3><p>${esc(lesson.region)}</p><div class="field-links">${lesson.links.map(([label,url])=>external(label,url)).join('')}</div><p class="micro" style="color:#e4eee7">${esc(lesson.address)}</p><div class="field-links">${places.map(place=>external(place+' 지도','https://map.naver.com/p/search/'+encodeURIComponent(caseIndex===1?'부산 '+place:place))).join('')}</div></div>`;
const fieldChecks=lesson.checks;
screen(5).querySelector('.watch-list').innerHTML=`<h3>${caseIndex===0?'영상·학교현황에서 찾기':'현장 자료에서 찾기'}</h3>${fieldChecks.map(text=>`<label class="watch-item"><input type="checkbox" class="watch-check"> ${esc(text)}</label>`).join('')}<p class="micro">한 가지 이상 직접 확인했다면 표시하세요. 자료와 지도는 새 창에서 열립니다.</p>`;
// Keep the two comparison columns and three sentence-card groups, updating their focus.
screen(6).querySelector('.lead').textContent=lesson.comparePrompt;
screen(6).querySelectorAll('.compare-column').forEach((col,i)=>{col.querySelector('h3').textContent=comparisonLabels[i];col.querySelectorAll('.compare-card').forEach(b=>b.remove());lesson.compareOptions[i].forEach(text=>{const b=document.createElement('button');b.className='compare-card';b.dataset.side=i?'hard':'good';b.textContent=text;col.append(b);});});
const headings=['① 어떤 변화가 있었나요','② 어떤 어려움이 생겼나요','③ 어떻게 달라졌나요'];
screen(7).querySelectorAll('.card>h3').forEach((h,i)=>h.textContent=headings[i]);
screen(7).querySelector('.lead').textContent='학생 수의 변화가 학교생활에 미친 영향을 낱말 카드로 설명해 보세요.';
screen(7).querySelectorAll('.word-options').forEach((group,i)=>group.innerHTML=lesson.solveOptions[i].map(text=>`<button class="word-card">${text}</button>`).join(''));
const socialNote=document.createElement('p');socialNote.className='micro';socialNote.textContent='저출산은 태어나는 아기가 적은 현상이에요. 지역의 학생 수는 사람들이 다른 곳으로 이사하는 일에도 영향을 받아요.';screen(7).querySelector('.card').append(socialNote);
const report=screen(8).querySelector('.report');report.querySelector(':scope>p').innerHTML=`<strong>사건:</strong> ${esc(lesson.articleTitle)}`;report.querySelector(':scope>.micro').textContent='자료 출처: '+lesson.meta+' · 어린이용 재구성 기사';
const connect=document.createElement('button');connect.className='ghost';connect.textContent='세 사건 연결하기';connect.hidden=true;screen(8).querySelector('.actions').append(connect);
if(caseIndex<CASES.length-1){const nextCase=document.createElement('button');nextCase.className='primary next-case';nextCase.textContent=`저출산 사건 0${caseIndex+2} 탐구하기`;nextCase.onclick=()=>openCaseUnlock(caseIndex+1);screen(8).querySelector('.actions').append(nextCase);}
let completedCases=[];try{completedCases=JSON.parse(localStorage.getItem('roadon-completed-cases-restored')||'[]');if(!Array.isArray(completedCases))completedCases=[];}catch{}
function markCaseComplete(){if(!completedCases.includes(caseIndex))completedCases.push(caseIndex);try{localStorage.setItem('roadon-completed-cases-restored',JSON.stringify(completedCases));}catch{}connect.hidden=![0,1,2].every(i=>completedCases.includes(i));}
connect.onclick=()=>{const panel=document.createElement('dialog');panel.className='case-connection';panel.innerHTML=`<h2>세 사건 연결하기</h2><h3>학생 수가 줄어든 지역에서는 학교의 모습이 어떻게 달라졌을까요?</h3>${CASES.map(d=>`<p>${esc(d.summary)}</p>`).join('')}<p><strong>부안과 창녕은 어떤 다른 방법을 선택했나요?</strong></p><button class="primary">보고서로 돌아가기</button>`;document.body.append(panel);panel.querySelector('button').onclick=()=>{panel.close();panel.remove()};panel.showModal();};
document.getElementById('pageLabel').textContent=`1페이지 사건 도착(오늘의 사건) · 저출산 사건 ${caseIndex+1}`;

const locationBox=document.createElement('section');locationBox.className='article-location';
const mapFile=['map-buan.svg','map-busan.svg','map-changnyeong.svg'][caseIndex];
const mapQuery=caseIndex===0?'전북 부안군 하서면 하서초등학교':caseIndex===1?'부산광역시':'창녕공설운동장';
locationBox.innerHTML=`<h3>사건이 일어난 곳</h3><a href="https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}" target="_blank" rel="noopener noreferrer"><img src="./${mapFile}" alt="대한민국에서 ${esc(lesson.place)} 지역의 대략적인 위치" width="290" height="330"></a><p class="micro">${esc(lesson.region)}</p>${caseIndex===0?`<div class="school-links">${external('하서초등학교 홈페이지','https://school.jbedu.kr/haseocho/')}${external('학교현황 · 학생 수 확인','https://school.jbedu.kr/haseocho/M010204/')}</div><p class="micro"><strong>지금 전교생은 몇 명일까요?</strong><br>학교현황의 기준 날짜를 확인하고 우리 반 학생 수와 비교해 보세요.</p>`:external('원문에서 더 알아보기',lesson.source)}<small class="map-credit">지도 윤곽: Natural Earth · 지역 위치는 대략 표시</small>`;
screen(3).querySelector('.word-help').append(locationBox);
const wordHelp=document.createElement('p');wordHelp.id='clueWordHelp';wordHelp.className='clue-word-help';document.getElementById('clueHint').after(wordHelp);
const startDialog=document.createElement('dialog');startDialog.id='articleStartDialog';startDialog.className='lesson-dialog';startDialog.setAttribute('aria-labelledby','articleStartTitle');startDialog.innerHTML='<h2 id="articleStartTitle">기사문으로 사건 탐구를 시작하시겠습니까?</h2><p>우리의 예상이 맞는지 기사 속 증거를 찾아보세요.</p><div class="actions"><button class="primary" id="startArticleYes">네, 탐구하겠습니다.</button><button class="ghost" id="startArticleNo">아니오, 단서를 더 살펴보겠습니다.</button></div>';document.body.append(startDialog);
function askArticleStart(){startDialog.showModal();document.getElementById('startArticleYes').focus();}
document.getElementById('startArticleYes').onclick=()=>{startDialog.close();go(3)};
document.getElementById('startArticleNo').onclick=()=>{startDialog.close();document.getElementById('finishClues').focus()};
startDialog.addEventListener('cancel',()=>setTimeout(()=>document.getElementById('finishClues').focus(),0));
document.getElementById('finalThought').maxLength=200;
