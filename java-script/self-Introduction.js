const text = "名前: てぃ\n年齢: 17歳\n好きなもの: 魔法";
const target = document.getElementById("intro-typewriter");
let i = 0;

function typeWriter() {
  if (i < text.length) {
    target.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 100); // 表示速度（ms）
  }
}

typeWriter();
