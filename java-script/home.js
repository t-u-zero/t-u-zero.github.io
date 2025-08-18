const titletext = "てぃ GitHubサイト";
const target = document.getElementById("typewriter");
let i = 0;

function typeWriter() {
  if (i < titletext.length) {
    target.textContent += titletext.charAt(i);
    i++;
    setTimeout(typeWriter, 100); // 表示速度（ms）
  }
}

typeWriter();
