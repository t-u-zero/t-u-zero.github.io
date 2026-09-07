import { profileState } from "./profile-state.js";
import { updateProgressIndicator } from "./profile-progress.js";

export function initializeProfileInput() {
    document.addEventListener("click", skipAllTextAnimation);
    document.addEventListener("touchstart", handleTouchStart, {
        passive: true
    });
    document.addEventListener("touchmove", handleTouchMove, {
        passive: true
    });
    document.addEventListener("touchend", handleTouchEnd, {
        passive: true
    });
    document.addEventListener("touchcancel", resetTouchState, {
        passive: true
    });
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        skipAllTextAnimation();
    });
}

function skipAllTextAnimation() {
    profileState.skipTextAnimation = true;
    profileState.renderedTextCharacters = profileState.totalTextCharacters;
    updateProgressIndicator();
}

function handleTouchStart(event) {
    const touch = event.touches[0];

    profileState.touchStartX = touch.clientX;
    profileState.touchStartY = touch.clientY;
    profileState.touchMoved = false;
}

function handleTouchMove(event) {
    const touch = event.touches[0];
    const movedX = Math.abs(touch.clientX - profileState.touchStartX);
    const movedY = Math.abs(touch.clientY - profileState.touchStartY);

    if (
        movedX > profileState.touchMoveThreshold ||
        movedY > profileState.touchMoveThreshold
    ) {
        profileState.touchMoved = true;
    }
}

function handleTouchEnd() {
    if (!profileState.touchMoved) {
        skipAllTextAnimation();
    }

    resetTouchState();
}

function resetTouchState() {
    profileState.touchMoved = false;
}
