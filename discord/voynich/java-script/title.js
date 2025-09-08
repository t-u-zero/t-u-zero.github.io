function Voynich_title_typeWriter() {
  const titletext = "voynich";
  const lasttext = "🌏Voynich💻";
  const target = document.getElementById("voynich_title_typewriter");
  let i = 0;

  function typing() {
    if (i < titletext.length) {
      target.textContent += titletext.charAt(i);
      i++;
      setTimeout(typing, 100);
    } else {
      // 打ち終わったら置き換える
      setTimeout(() => {
        target.textContent = lasttext;
      }, 250);
    }
  }
  typing();
}

document.addEventListener("DOMContentLoaded", Voynich_title_typeWriter);
