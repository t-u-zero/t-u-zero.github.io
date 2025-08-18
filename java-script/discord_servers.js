function discord_servers_typeWriter() {
  const texts = [
    "𝑪𝑶𝑺𝑴𝑶𝑺 𝑺𝑬𝑹𝑽𝑬𝑹",
    "💫 𝔽𝕒𝕟𝕒𝕣𝕚𝕒",
    "🌏Voynich💻"
  ];
  const links = [
    "https://discord.com/invite/AnCywZBabz",
    "https://discord.com/invite/4jgmAhUmYX",
    "https://discord.com/invite/SNc8tfc9KC"
  ];

  const target = document.getElementById("discord_servers_typewriter");
  let textIndex = 0;
  let charIndex = 0;
  let currentText = "";
  let htmlText = "";

  function typing() {
    if (textIndex < texts.length) {
      currentText = texts[textIndex];
      if (charIndex < currentText.length) {
        htmlText += currentText.charAt(charIndex);
        target.textContent = htmlText;
        charIndex++;
        setTimeout(typing, 100);
      } else {
        // タイピング完了 → リンクに変換
        const link = document.createElement("a");
        link.href = links[textIndex];
        link.target = "_blank";
        link.innerHTML = currentText;
        target.innerHTML = ""; // 一旦消す
        target.appendChild(link);

        // 改行追加
        target.appendChild(document.createElement("br"));

        // 次のテキストへ
        textIndex++;
        charIndex = 0;
        htmlText = "";
        setTimeout(typing, 500);
      }
    }
  }

  typing();

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
