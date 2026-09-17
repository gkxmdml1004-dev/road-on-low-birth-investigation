(() => {
  const inAging = location.pathname.includes('/aging/');
  document.body.classList.add(inAging ? 'theme-aging' : 'theme-lowbirth');
  const dialog = document.createElement('dialog');
  dialog.className = 'theme-selector-dialog';
  dialog.setAttribute('aria-labelledby', 'themeSelectorTitle');
  dialog.innerHTML = `
    <h2 id="themeSelectorTitle">탐구할 대주제를 선택하세요</h2>
    <p>사회 변화의 모습을 주제별 사건으로 탐구합니다.</p>
    <div class="theme-choice-grid">
      <a class="theme-choice lowbirth" href="${inAging ? '../?case=1' : './?case=1'}">
        <strong>저출산</strong><span>학생 수와 학교생활의 변화</span>
      </a>
      <a class="theme-choice aging" href="${inAging ? './?case=1' : './aging/?case=1'}">
        <strong>고령화</strong><span>인구와 생활환경의 변화</span>
      </a>
      <div class="theme-choice coming"><strong>지능정보화</strong><span>준비 중</span></div>
      <div class="theme-choice coming"><strong>세계화</strong><span>준비 중</span></div>
    </div>
    <button type="button" class="ghost close-theme-selector">현재 주제로 돌아가기</button>`;
  document.body.append(dialog);

  document.querySelectorAll('.topbar').forEach(bar => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-selector-button';
    button.textContent = `대주제 · ${inAging ? '고령화' : '저출산'}`;
    button.onclick = () => dialog.showModal();
    bar.append(button);
  });
  dialog.querySelector('.close-theme-selector').onclick = () => dialog.close();
})();

