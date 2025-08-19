function Fanaria_title_typeWriter() {
  const titletext = "Fanaria";
  const target = document.getElementById("fanaria_title_typewriter");
  let i = 0;

  function typing() {
    if (i < titletext.length) {
      target.textContent += titletext.charAt(i);
      i++;
      setTimeout(typing, 100);
    }
  }

  typing();
}

document.addEventListener("DOMContentLoaded", Fanaria_title_typeWriter);
