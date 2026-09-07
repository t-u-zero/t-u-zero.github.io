import { profileState } from "./profile-state.js";
import { updateProgressIndicator } from "./profile-progress.js";

export async function typeText(element, text) {
    const fullText = String(text);
    const characters = Array.from(fullText);
    let typedCharacters = 0;

    element.textContent = "";
    element.classList.add("is-visible");

    if (profileState.skipTextAnimation) {
        element.textContent = fullText;
        profileState.renderedTextCharacters += characters.length;
        updateProgressIndicator();
        return;
    }

    for (const character of characters) {
        element.append(character);
        typedCharacters += 1;
        profileState.renderedTextCharacters += 1;
        updateProgressIndicator();

        if (profileState.skipTextAnimation) {
            element.textContent = fullText;
            profileState.renderedTextCharacters += characters.length - typedCharacters;
            updateProgressIndicator();
            return;
        }

        await wait(profileState.textDelay);
    }
}

export async function revealStaticText(element) {
    const text = element.textContent;
    element.textContent = "";
    element.classList.add("is-visible");
    return typeText(element, text);
}

function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}
