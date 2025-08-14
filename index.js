 let words = [];
    let currentIndex = 0;
    const card = document.getElementById("card");
    const front = document.getElementById("front");
    const back = document.getElementById("back");
    const flashcard = document.getElementById("flashcard");

    // Đọc file Excel
    document.getElementById('excelFile').addEventListener('change', function(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        words = jsonData.map(row => ({
          hanzi: row.Hanzi || "",
          pinyin: row.Pinyin || "",
          meaning: row.Meaning || "",
          example: row.Example || ""
        })).filter(w => w.hanzi); // bỏ dòng trống

        if (words.length > 0) {
          document.getElementById("flashcard").style.display = "block";
          document.getElementById("controls").style.display = "block";
          currentIndex = 0;
          loadCard(currentIndex);
        } else {
          alert("File không có dữ liệu hợp lệ.");
        }
      };
      reader.readAsArrayBuffer(file);
    });

    function loadCard(index) {
      card.classList.remove("flipped"); // luôn về mặt front
      const word = words[index];
      if (!word) return;
      front.textContent = word.hanzi;
      back.innerHTML = `<p><b>Pinyin:</b> ${word.pinyin}
         <button class="audio-btn" onclick="speak('${word.hanzi}')">🔊</button>
        </p>
                        <p><b>Nghĩa:</b> ${word.meaning}</p>
                        <p><b>Ví dụ:</b> ${word.example}</p>`;
    }
    const hanziLength = word.hanzi.length;
let fontSize = "clamp(48px, 20vh, 100px)";
if (hanziLength > 2) fontSize = "clamp(40px, 18vh, 80px)";
if (hanziLength > 4) fontSize = "clamp(32px, 16vh, 60px)";

front.innerHTML = `
  <div style="
    display:flex;
    justify-content:center;
    align-items:center;
    text-align:center;
    width:100%;
    height:100%;
    font-size:${fontSize};
    line-height:1;
    word-break:break-word;
  ">
    ${word.hanzi}
  </div>
`;
    function nextCard() {
      currentIndex = (currentIndex + 1) % words.length;
      loadCard(currentIndex);
    }

    function prevCard() {
      currentIndex = (currentIndex - 1 + words.length) % words.length;
      loadCard(currentIndex);
    }

    function randomCard() {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * words.length);
      } while (newIndex === currentIndex && words.length > 1);
      currentIndex = newIndex;
      loadCard(currentIndex);
    }

        function speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      speechSynthesis.speak(utterance);
    }

    flashcard.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() === "button" || event.target.closest("button")) {
    return;
  }
      card.classList.toggle("flipped");
    });
   
// const images = [
//   'images/danang1.jpg',
//   'images/ruongbacthang.jpg',
//   'images/hinh-nen-18.jpg',
//   'images/hinh-nen-20.jpg',
// ];
// let currentBg = 0;
// const body = document.getElementById('body');

// setInterval(() => {
//   currentBg = (currentBg + 1) % images.length;
//   body.style.backgroundImage = `url('${images[currentBg]}')`;
// }, 30000); // 5s đổi 1 lần

    // ảnh cuối

   const texts = [
    "祝你们学习顺利 !",
    
  ];
  let index = 0;
  const span = document.getElementById("marquee-text");

  setInterval(() => {
    index = (index + 1) % texts.length;
    span.textContent = texts[index];
  }, 6000);