function COSMOS_typeWriter() {
  const texts = [
    "サーバー名: COSMOS SERVER",
    "設立: 2023/08/17",
    "設立者: cosmos_2525",
    "現オーナー: cosmos_2525",
    "概要:",
    "独自に制作している役職PvPをはじめとする、MinecraftPvPや、その他Minecraftに関連するもの、",
    "Minecraft以外の様々なゲームなどを遊ぶプレイヤー達のためのゲームコミュニティサーバー"
  ];
  const target = document.getElementById("cosmos_typewriter");
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
  const target = document.getElementById("cosmos_typewriter");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        COSMOS_typeWriter();
        obs.unobserve(entry.target); // 一度だけ発動
      }
    });
  }, {
    threshold: 0.6 // 要素が60%以上見えたら発動
  });

  observer.observe(target);
});
