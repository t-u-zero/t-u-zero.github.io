const text = "てぃ GitHubサイト";
const target = document.getElementById("typewriter");
let i = 0;

function typeWriter() {
  if (i < text.length) {
    target.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 100); // 表示速度（ms）
  }
}

typeWriter();
