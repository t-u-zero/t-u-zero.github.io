function discord_servers_typeWriter() {
  const texts = [
    "<a href=' https://discord.com/invite/AnCywZBabz 'target='_blank'>𝑪𝑶𝑺𝑴𝑶𝑺 𝑺𝑬𝑹𝑽𝑬𝑹</a>",
    "<a href=' https://discord.com/invite/4jgmAhUmYX 'target='_blank'>💫 𝔽𝕒𝕟𝕒𝕣𝕚𝕒</a>",
    "<a href=' https://discord.com/invite/SNc8tfc9KC 'target='_blank'>🌏Voynich💻</a>"
  ];
  const target = document.getElementById("discord_servers_typewriter");
  let textIndex = 0;
  let charIndex = 0;
  let htmlText = "";

  function typing() {
    if (textIndex < texts.length) {
      const currentText = texts[textIndex];
      if (charIndex < currentText.length) {
        htmlText += currentText.charAt(charIndex);
        target.textContent = htmlText;
        charIndex++;
        setTimeout(typing, 100);
      } else {
        htmlText += "\n";
        textIndex++;
        charIndex = 0;
        setTimeout(typing, 500);
      }
    }
  }

  typing();
}

document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("discord_servers_typewriter");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        discord_servers_typeWriter();
        obs.unobserve(entry.target); // 一度だけ発動
      }
    });
  }, {
    threshold: 0.6 // 要素が60%以上見えたら発動
  });

  observer.observe(target);
});
