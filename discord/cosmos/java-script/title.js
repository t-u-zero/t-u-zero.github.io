function COSMOS_title_typeWriter() {
  const titletext = "cosmos server";
  const lasttext = "𝑪𝑶𝑺𝑴𝑶𝑺 𝑺𝑬𝑹𝑽𝑬𝑹";
  const target = document.getElementById("cosmos_title_typewriter");
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

document.addEventListener("DOMContentLoaded", COSMOS_title_typeWriter);
