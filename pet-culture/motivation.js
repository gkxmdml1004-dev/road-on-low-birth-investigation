let villageStep=0,villageTimer=null,historyStep=0,historyTimer=null,historyVisible=false;

function housePicture(){return `<svg viewBox="0 0 70 76" aria-hidden="true"><path class="home-roof" d="M5 31L35 7l30 24"/><path class="home-body" d="M13 29v40h44V29"/><path class="home-door" d="M29 69V50h12v19"/><path class="home-window" d="M20 35h10v10H20zM40 35h10v10H40z"/></svg>`;}
function petStamp(){return `<span class="pet-stamp" aria-hidden="true"><svg viewBox="0 0 54 54"><ellipse cx="27" cy="33" rx="10" ry="8"/><circle cx="14" cy="23" r="5"/><circle cx="23" cy="16" r="5"/><circle cx="33" cy="16" r="5"/><circle cx="42" cy="23" r="5"/></svg></span>`;}
function currentHomes(){return Array.from({length:10},(_,i)=>`<div class="village-home" data-house="${i}" aria-hidden="true"><div class="village-home-visual">${housePicture()}${petStamp()}</div><span>${i+1}</span></div>`).join('');}
function comparisonHomes(year,petCount){const old=year===2006;return `<div class="year-house-grid" role="img" aria-label="${year}년 10가구 그림">${Array.from({length:10},(_,i)=>`<div class="village-home${old?'':' revealed'}${!old&&i<petCount?' with-pet':''}" ${old?`data-history-house="${i}"`:''} aria-hidden="true"><div class="village-home-visual">${housePicture()}${petStamp()}</div><span>${i+1}</span></div>`).join('')}</div>`;}
function currentVillageView(){return `<div class="current-village-layout"><div class="current-graph-column"><div class="village-grid" id="village-grid" role="img" aria-label="아직 결과를 확인하지 않은 10가구 그림그래프">${currentHomes()}</div></div><div class="current-side-column"><div class="village-controls"><button class="primary village-play" data-action="village-play" id="village-play"><span aria-hidden="true">▶</span> 재생</button><button class="secondary" data-action="village-pause" id="village-pause" disabled>Ⅱ 멈춤</button><button class="quiet" data-action="village-reset">처음으로</button></div><div class="village-result" id="village-result" aria-live="polite"><p>몇 가구일지 예상하고<br>재생 버튼을 눌러 확인해 보세요.</p></div></div></div>`;}
function inlineComparisonView(){return `<section class="inline-comparison" aria-labelledby="compare-question"><article class="inline-year-card history-card"><span class="year-badge">2006년</span><h3 id="compare-question">그렇다면 약 20년 전에는 어땠을까요?</h3><p class="year-prompt">먼저 예상한 뒤 결과를 확인해 보세요.</p>${comparisonHomes(2006,2)}<div class="inline-year-result history-action-result" id="history-result" aria-live="polite"><button class="primary" data-action="history-play" id="history-play"><span aria-hidden="true">▶</span> 2006년 결과 보기</button><span class="history-result-copy" id="history-result-copy">몇 가구에 표시가 찍힐까요?</span></div></article><article class="inline-year-card current-card"><span class="year-badge current">2025년</span><h3>오늘날의 모습</h3><p class="year-prompt">방금 확인한 통계 그림이에요.</p>${comparisonHomes(2025,3)}<div class="inline-year-result complete"><strong>10가구 중 약 3가구</strong><span>반려동물과 함께 살아요.</span></div></article></section><div class="comparison-summary" id="comparison-summary" hidden><strong>2006년 약 2가구 → 2025년 약 3가구</strong><span>두 해의 대략적인 모습을 나란히 살펴볼 수 있어요.</span></div><p class="comparison-note compact-note">두 조사는 조사 방법과 대상이 달라 숫자를 딱 맞게 빼서 비교할 수는 없어요.</p><div class="comparison-footer"><button class="quiet" data-action="compare-back">← 2025년 그림 다시 보기</button><div class="comparison-sources"><a class="source" href="https://krei.re.kr/attach/pdf/R824.pdf" target="_blank" rel="noopener">2006년 자료 · 외부 자료 ↗</a><a class="source" href="${LESSON.statistics.source}" target="_blank" rel="noopener">2025년 자료 · 외부 자료 ↗</a></div></div>`;}
function introNewsHook(){const m=LESSON.motivation,opened=Boolean(state.introKeyword);return `<section class="intro-news-hook"><div class="news-keyword-prompt"><span class="eyebrow">기사 키워드</span><strong>이 말들은 반려동물과 어떻게 이어질까요?</strong><div class="news-keyword-buttons">${m.keywords.map(word=>`<button class="chip ${state.introKeyword===word?'selected':''}" data-intro-keyword="${word}" aria-pressed="${state.introKeyword===word}">${word}</button>`).join('')}</div></div><div class="news-keyword-reveal" id="news-keyword-reveal" ${opened?'':'hidden'}><div><b>${m.title}</b><p>${m.summary}</p><small>${m.note}</small></div><a class="source" href="${m.source.url}" target="_blank" rel="noopener noreferrer">기사 원문 ↗</a></div></section>`;}
function updateIntroKeyword(){document.querySelectorAll('[data-intro-keyword]').forEach(button=>{const selected=button.dataset.introKeyword===state.introKeyword;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',selected);});const reveal=$('news-keyword-reveal');if(reveal)reveal.hidden=!state.introKeyword;}
function intro(){return `<div class="section-head intro-head"><div><span class="eyebrow">오늘의 탐구 · 먼저 예상해 보세요</span><div class="intro-heading-row"><h2>우리나라가 10가구가 사는 마을이라면?</h2><p>반려동물과 함께 사는 가구는 얼마나 될까요?</p></div></div></div>${introNewsHook()}<section class="panel village-panel"><div class="village-top"><span>우리나라의 모습을 작은 마을로 나타내요</span><span class="village-unit">집 그림 1개 = 1가구</span></div><div id="village-interactive">${historyVisible?inlineComparisonView():currentVillageView()}</div></section><div class="intro-bottom"><div class="intro-meta"><span>‘가구’는 함께 생활하는 한 집을 세는 말이에요.</span><span>29.2%를 10가구 중 약 3가구로 나타냈어요. 실제 이웃집 10곳을 조사한 결과는 아니에요.</span><span>농림축산식품부 · 2025년 반려동물 양육현황조사 ${source({label:'통계 원문',url:LESSON.statistics.source})}</span></div>${button('함께하는 생활 알아보기 →','start','primary',villageStep<10,'id="village-next"')}</div>`;}
function stopVillage(){clearInterval(villageTimer);clearInterval(historyTimer);villageTimer=null;historyTimer=null;}
function updateVillage(){
 const grid=$('village-grid');if(!grid)return;
 grid.querySelectorAll('[data-house]').forEach((el,i)=>{el.classList.toggle('revealed',i<villageStep);el.classList.toggle('with-pet',i<3&&i<villageStep);});
 const complete=villageStep===10,playing=villageTimer!==null;
 $('village-play').disabled=playing;$('village-play').innerHTML=`<span aria-hidden="true">▶</span> ${complete?'다시 재생':villageStep?'이어서 재생':'재생'}`;$('village-pause').disabled=!playing;
 const next=$('village-next');if(next)next.disabled=!complete;
 grid.setAttribute('aria-label',complete?'10가구 중 약 3가구가 반려동물과 함께 사는 모습':`10가구 가운데 ${villageStep}개 그림 확인 중`);
 $('village-result').classList.toggle('finished',complete);
 $('village-result').innerHTML=complete?`<p><strong>10가구 중 약 <em>3가구</em></strong>가 반려동물과 함께 살아요!</p><div class="village-legend"><span><i class="legend-pet"></i>함께 사는 가구 · 약 3가구</span><span><i></i>기르지 않는 가구 · 약 7가구</span></div><p class="village-question">이전 조사와 비교하면 어떤 모습일까요?</p><div class="year-choices"><span>연도를 눌러 비교해 보세요.</span><button class="year-choice" data-action="compare-year">2006년</button><button class="year-choice selected" aria-pressed="true" disabled>2025년</button></div>`:`<p>${playing?'그림이 하나씩 채워지고 있어요.':villageStep?'잠시 멈췄어요. 이어서 확인해 볼까요?':'몇 가구일지 예상하고 재생 버튼을 눌러 확인해 보세요.'}</p>`;
}
function updateHistory(){
 const houses=document.querySelectorAll('[data-history-house]');if(!houses.length)return;
 houses.forEach((el,i)=>{el.classList.toggle('revealed',i<historyStep);el.classList.toggle('with-pet',i<2&&i<historyStep);});
 const complete=historyStep===10,playing=historyTimer!==null,play=$('history-play');
 play.disabled=playing;play.innerHTML=`<span aria-hidden="true">▶</span> ${complete?'다시 보기':historyStep?'이어서 보기':'2006년 결과 보기'}`;
 $('history-result').classList.toggle('complete',complete);$('history-result-copy').innerHTML=complete?`<strong>10가구 중 약 2가구</strong><span>반려동물과 함께 살았어요.</span>`:`${playing?'그림을 하나씩 확인하고 있어요.':historyStep?'잠시 멈췄어요.':'몇 가구에 표시가 찍힐까요?'}`;
 const summary=$('comparison-summary');if(summary)summary.hidden=!complete;
}
function playVillage(){if(villageTimer)return;if(villageStep===10)villageStep=0;villageTimer=setInterval(()=>{villageStep++;if(villageStep>=10){villageStep=10;clearInterval(villageTimer);villageTimer=null;}updateVillage();},260);updateVillage();}
function playHistory(){if(historyTimer)return;if(historyStep===10)historyStep=0;historyTimer=setInterval(()=>{historyStep++;if(historyStep>=10){historyStep=10;clearInterval(historyTimer);historyTimer=null;}updateHistory();},220);updateHistory();}
function showComparison(){stopVillage();historyVisible=true;historyStep=0;$('village-interactive').innerHTML=inlineComparisonView();updateHistory();}
function showCurrentVillage(){stopVillage();historyVisible=false;$('village-interactive').innerHTML=currentVillageView();updateVillage();}
function resetMotivation(){stopVillage();villageStep=0;historyStep=0;historyVisible=false;}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.action==='village-play')playVillage();
 if(b.dataset.action==='village-pause'){clearInterval(villageTimer);villageTimer=null;updateVillage();}
 if(b.dataset.action==='village-reset'){stopVillage();villageStep=0;updateVillage();}
 if(b.dataset.action==='compare-year')showComparison();
 if(b.dataset.action==='history-play')playHistory();
 if(b.dataset.action==='compare-back')showCurrentVillage();
 if(b.dataset.introKeyword){state.introKeyword=b.dataset.introKeyword;persist();updateIntroKeyword();}
});

