// 화면이 그려지기 전에 저장된 테마를 적용한다 (새로고침 때 색이 깜빡이지 않도록)
try {
  var saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
  }
} catch (e) {}
