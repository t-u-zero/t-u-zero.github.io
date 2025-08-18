function intro_typeWriter() {
  const text = "名前: てぃ<br>年齢: 17歳<br>好きなもの: 魔法";
  const target = document.getElementById("intro-typewriter");
  let i = 0;
  let htmlText = "";

  function typing() {
    if (i < text.length) {
      htmlText += text.charAt(i);
      target.innerHTML = htmlText;
      i++;
      setTimeout(typing, 100);
    }
  }

  typing();
}

document.addEventListener("DOMContentLoaded", intro_typeWriter);
