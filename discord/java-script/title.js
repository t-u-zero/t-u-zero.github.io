function title_typeWriter() {
  const titletext = "てぃのDiscord";
  const target = document.getElementById("discord_title_typewriter");
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

document.addEventListener("DOMContentLoaded", title_typeWriter);
