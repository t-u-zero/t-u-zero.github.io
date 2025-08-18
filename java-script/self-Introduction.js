const text = "名前: てぃ<br>年齢: 17歳<br>好きなもの: 魔法";
const target = document.getElementById("intro-typewriter");
let i = 0;

function intro_typeWriter() {
  if (i < text.length) {
    target.textContent += text.charAt(i);
    i++;
    setTimeout(intro_typeWriter, 100); // 表示速度（ms）
  }
}

intro_typeWriter();
