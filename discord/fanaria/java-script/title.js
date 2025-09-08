function Fanaria_title_typeWriter() {
  const titletext = "fanaria";
  const lasttext = "💫 𝔽𝕒𝕟𝕒𝕣𝕚𝕒";
  const target = document.getElementById("fanaria_title_typewriter");
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

document.addEventListener("DOMContentLoaded", Fanaria_title_typeWriter);
