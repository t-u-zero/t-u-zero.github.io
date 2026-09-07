import { profileState } from "./profile-state.js";

export function createProgressIndicator() {
    const indicator = document.createElement("div");
    const ring = document.createElement("span");
    const percent = document.createElement("span");

    indicator.className = "text-progress-indicator";
    indicator.setAttribute("aria-label", "テキスト表示の進捗");
    ring.className = "text-progress-ring";
    percent.className = "text-progress-percent";
    percent.textContent = "0%";
    ring.appendChild(percent);
    indicator.appendChild(ring);
    document.body.appendChild(indicator);
    profileState.progressRing = ring;
    profileState.progressPercent = percent;
}

export function updateProgressIndicator() {
    const { progressPercent, progressRing } = profileState;

    if (!progressPercent || !progressRing) {
        return;
    }

    const percentage = Math.min(
        100,
        Math.round(
            profileState.renderedTextCharacters /
            profileState.totalTextCharacters * 100
        )
    );

    progressPercent.textContent = `${percentage}%`;
    progressRing.style.setProperty(
        "--progress-angle",
        `${percentage * 3.6}deg`
    );
    progressRing.parentElement.classList.toggle(
        "is-complete",
        percentage >= 100
    );
}

export function setTotalTextCharacters(total) {
    profileState.totalTextCharacters = Math.max(1, total);

    if (profileState.skipTextAnimation) {
        profileState.renderedTextCharacters = profileState.totalTextCharacters;
    }

    updateProgressIndicator();
}
