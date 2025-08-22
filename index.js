 const pinyin = window.pinyinPro ? window.pinyinPro.pinyin : null;
  const fileInput = document.getElementById('file');
  const card = document.getElementById('card');
  const front = document.getElementById('front');
  const pinyinDiv = document.getElementById('pinyin');
  const meaningDiv = document.getElementById('meaning');
  const stats = document.getElementById('stats');
  const nextBtn = document.getElementById('next');

  let cards = [];
  let current = null;

  function genPinyin(text) {
    if (!text || !text.trim() || !pinyin) return "Không có pinyin";
    return pinyin(text, { toneType: "symbol" }).replace(/\s+/g, "");
  }

  function showFront(item) {
    front.textContent = item ? item.hanzi : '?';
    pinyinDiv.textContent = '';
    meaningDiv.textContent = '';
  }

  function showBack(item) {
    pinyinDiv.textContent = item ? (item.pinyin || 'Không có pinyin') : '';
    meaningDiv.textContent = item ? (item.meaning || '') : '';
  }

  function nextRandom() {
  if (cards.length === 0) return;

  // lọc ra thẻ chưa học
  const remaining = cards.filter(c => !c.flipped);

  if (remaining.length === 0) {
    stats.textContent = "Bạn đã học hết các thẻ!";
    return;
  }

  const i = Math.floor(Math.random() * remaining.length);
  current = remaining[i];

  card.classList.remove('flipped');
  showFront(current);
  stats.textContent = `Còn lại ${remaining.length} từ`;
}

card.addEventListener('click', () => {
  if (!current) return;

  card.classList.toggle('flipped');

  if (card.classList.contains('flipped')) {
    showBack(current);
    if (!current.flipped) current.flipped = true; // <-- quan trọng: đánh dấu đã học
    // (tuỳ chọn) cập nhật thống kê tức thì
    // const left = cards.filter(c => !c.flipped).length;
    // stats.textContent = `Còn lại ${left} từ`;
  } else {
    showFront(current);
  }
});

  fileInput.addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const data = await f.arrayBuffer();
    const wb = XLSX.read(data);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    const startRow = rows[0] && rows[0][0].toLowerCase() === "hanzi" ? 1 : 0;

    cards = rows.slice(startRow).map(r => {
      const hanzi = (r[0] || '').toString().trim();
      const meaning = (r[1] || '').toString().trim();
      return {
        hanzi,
        meaning,
        pinyin: genPinyin(hanzi),
        flipped: false // thêm cờ flipped mặc định
      };
    }).filter(r => r.hanzi);

    if (cards.length === 0) {
      stats.textContent = 'Không tìm thấy dữ liệu hợp lệ trong file.';
      return;
    }

    nextRandom();
  });

  nextBtn.addEventListener('click', nextRandom);