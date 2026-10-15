(() => {
  const inAging = location.pathname.includes('/aging/');
  const params = new URLSearchParams(location.search);
  let isTopicGate = !inAging && !params.has('case');
  document.body.classList.add(inAging ? 'theme-aging' : 'theme-lowbirth');
  const assetBase = inAging ? '../assets/' : './assets/';
  const dialog = document.createElement('dialog');
  dialog.className = 'theme-selector-dialog';
  dialog.setAttribute('aria-labelledby', 'themeSelectorTitle');
  dialog.innerHTML = `
    <h2 id="themeSelectorTitle">탐구할 대주제를 선택하세요</h2>
    <p>사회 변화의 모습을 주제별 사건으로 탐구합니다.</p>
    <div class="theme-choice-grid">
      <a class="theme-choice lowbirth" href="${inAging ? '../?case=1' : './?case=1'}">
        <img src="${assetBase}theme-lowbirth.png" alt=""><span class="theme-choice-copy"><strong>저출산</strong><span>학생 수와 학교생활의 변화</span></span>
      </a>
      <a class="theme-choice aging" href="${inAging ? './?case=1' : './aging/?case=1'}">
        <img src="${assetBase}theme-aging.png" alt=""><span class="theme-choice-copy"><strong>고령화</strong><span>인구와 생활환경의 변화</span></span>
      </a>
      <a class="theme-choice petculture" href="${inAging ? '../pet-culture/' : './pet-culture/'}">
        <img src="${inAging ? '../pet-culture/' : './pet-culture/'}assets/dog-care.jpg" alt=""><span class="theme-choice-copy"><strong>반려동물 문화</strong><span>반려동물과 함께하는 생활</span></span>
      </a>
      <div class="theme-choice coming"><strong>1인 가구</strong><span>새로운 수업 준비 중</span></div>
      <div class="theme-choice coming"><strong>지능정보화</strong><span>준비 중</span></div>
      <div class="theme-choice coming"><strong>세계화</strong><span>준비 중</span></div>
    </div>
    <button type="button" class="ghost close-theme-selector" ${isTopicGate ? 'hidden' : ''}>현재 주제로 돌아가기</button>`;
  document.body.append(dialog);

  document.querySelectorAll('.topbar').forEach(bar => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-selector-button';
    button.innerHTML = `<img src="${assetBase}${inAging ? 'theme-aging.png' : 'theme-lowbirth.png'}" alt=""><span>대주제 · ${inAging ? '고령화' : '저출산'}</span>`;
    button.onclick = () => dialog.showModal();
    bar.append(button);
  });
  document.querySelectorAll('.brand').forEach(brand => {
    brand.classList.add('brand-home-button');
    brand.setAttribute('role', 'button');
    brand.setAttribute('tabindex', '0');
    brand.setAttribute('aria-label', '주제 선택 화면으로 돌아가기');
    const goHome = () => {
      if (inAging) location.href = '../';
      else {
        isTopicGate = true;
        history.replaceState(null, '', location.pathname);
        dialog.querySelector('.close-theme-selector').hidden = true;
        if (!dialog.open) dialog.showModal();
      }
    };
    brand.addEventListener('click', goHome);
    brand.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); goHome(); }
    });
  });
  dialog.querySelector('.close-theme-selector').onclick = () => dialog.close();
  dialog.addEventListener('cancel', event => { if (isTopicGate) event.preventDefault(); });
  if (isTopicGate) requestAnimationFrame(() => dialog.showModal());
})();

