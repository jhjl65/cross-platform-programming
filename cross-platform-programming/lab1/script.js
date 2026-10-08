// Перемикання мобільного меню
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
});

// Закривати меню після вибору пункту (зручно на мобільних)
mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("open");
    });
});

// Демонстрація кнопки дії — імітація відтворення треку
const playButton = document.getElementById("playButton");
const playerStatus = document.getElementById("playerStatus");
let isPlaying = false;

playButton.addEventListener("click", () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playButton.textContent = "⏸ Зупинити відтворення";
        playerStatus.textContent = "Відтворюється: Ambient Rain — Sleep Mix";
        playerStatus.classList.add("playing");
    } else {
        playButton.textContent = "▶ Слухати демо-трек";
        playerStatus.textContent = "Натисніть кнопку, щоб почати відтворення";
        playerStatus.classList.remove("playing");
    }
});

// Кнопка "Завантажити застосунок" — заглушка для демонстрації
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", () => {
    alert("Демо-версія: у реальному застосунку тут почалося б завантаження.");
});