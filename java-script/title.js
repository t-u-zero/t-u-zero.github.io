const titletext = "てぃ GitHubサイト";
const target = document.getElementById("title-typewriter");
let i = 0;

function title_typeWriter() {
  if (i < titletext.length) {
    target.textContent += titletext.charAt(i);
    i++;
    setTimeout(title_typeWriter, 100); // 表示速度（ms）
  }
}

title_typeWriter();
