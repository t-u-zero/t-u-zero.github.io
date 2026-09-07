import { initializeProfileInput } from "./profile-input.js";
import { createProgressIndicator } from "./profile-progress.js";
import { countProfileText } from "./profile-counter.js";
import { setTotalTextCharacters } from "./profile-progress.js";
import { typeText } from "./profile-text.js";
import { renderProfileSections } from "./profile-renderer.js";

initializeProfileInput();

document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
    const content = document.querySelector("#profile-content");
    const config = await fetchProfileConfig();

    createProgressIndicator();
    setTotalTextCharacters(countProfileText(config));

    const title = document.querySelector("#profile-title");
    const status = document.querySelector("#profile-status");

    title.classList.add("reveal-text");
    status.classList.add("reveal-text");
    await typeText(title, "プロフィール");
    await typeText(status, "STATUS: ACTIVE / LOCATION: AOMORI, JP");

    content.replaceChildren();
    await renderProfileSections(content, config.sections);
}

async function fetchProfileConfig() {
    const response = await fetch("profile-config.json");

    if (!response.ok) {
        throw new Error(`Profile config failed: ${response.status}`);
    }

    return response.json();
}
