const textDelay = 24;

document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
    const content = document.querySelector("#profile-content");
    const config = await fetch("profile-config.json").then((response) => {
        if (!response.ok) {
            throw new Error(`Profile config failed: ${response.status}`);
        }

        return response.json();
    });

    document.querySelector("#profile-title").classList.add("reveal-text");
    document.querySelector("#profile-status").classList.add("reveal-text");
    await typeText(document.querySelector("#profile-title"), "プロフィール");
    await typeText(
        document.querySelector("#profile-status"),
        "STATUS: ACTIVE / LOCATION: AOMORI, JP"
    );

    content.replaceChildren();

    for (const sectionData of config.sections) {
        await renderSection(content, sectionData);
    }
}

async function renderSection(parent, sectionData) {
    const section = document.createElement("section");
    const heading = document.createElement("h2");
    const index = document.createElement("p");

    section.className = "profile-section";
    heading.className = "reveal-text";
    index.className = "section-index reveal-text";
    index.textContent = `// ${String(sectionData.title).toUpperCase()}`;
    section.append(index, heading);
    parent.appendChild(section);

    if (sectionData.image?.url) {
        renderSectionBackground(section, sectionData.image);
    }

    await revealStaticText(index);
    await typeText(heading, sectionData.title);

    for (let index = 0; index < sectionData.content.length; index += 1) {
        const item = sectionData.content[index];
        const nextItem = sectionData.content[index + 1];

        if (item.type === "title" && nextItem?.type === "text") {
            await renderField(section, item.text, nextItem.text);
            index += 1;
            continue;
        }

        await renderItem(section, item);
    }
}

function renderSectionBackground(section, item) {
    const background = document.createElement("div");
    const image = document.createElement("img");

    background.className = "profile-section-background";
    background.setAttribute("aria-hidden", "true");
    image.src = item.url;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
        background.remove();
    }, { once: true });
    background.appendChild(image);
    section.prepend(background);
    section.classList.add("has-section-image");
}

async function renderField(parent, labelText, valueText) {
    const entry = document.createElement("div");
    const label = document.createElement("dt");
    const value = document.createElement("dd");

    entry.className = "profile-entry";
    label.className = "reveal-text";
    value.className = "reveal-text";
    entry.append(label, value);
    parent.appendChild(entry);
    await typeText(label, labelText);
    await typeText(value, valueText);
}

async function renderItem(parent, item) {
    if (item.type === "title") {
        const heading = document.createElement("h3");
        heading.className = "reveal-text";
        parent.appendChild(heading);
        return typeText(heading, item.text);
    }

    if (item.type === "text") {
        const paragraph = document.createElement("p");
        paragraph.className = "reveal-text";
        parent.appendChild(paragraph);
        return typeText(paragraph, item.text);
    }

    if (item.type === "image") {
        return renderImage(parent, item);
    }

    if (item.type === "list") {
        const list = document.createElement("ul");
        list.className = "profile-list";
        parent.appendChild(list);

        for (const value of item.list) {
            const listItem = document.createElement("li");
            listItem.className = "reveal-text";
            list.appendChild(listItem);
            await typeText(listItem, value);
        }

        return;
    }

    if (item.type === "box") {
        const box = document.createElement("article");
        const boxContent = document.createElement("div");

        box.className = "profile-box";
        boxContent.className = "profile-box-content";
        parent.appendChild(box);

        if (item.image?.url) {
            renderBoxImage(box, item.image);
            box.classList.add("has-box-image");
        }

        box.appendChild(boxContent);

        for (const boxItem of item.contents) {
            await renderBoxItem(boxContent, boxItem);
        }

        return;
    }

    if (item.type === "image-button") {
        let grid = parent.querySelector(".social-grid");

        if (!grid) {
            grid = document.createElement("ul");
            grid.className = "social-grid";
            parent.appendChild(grid);
        }

        const listItem = document.createElement("li");
        const link = document.createElement("a");
        const image = document.createElement("img");
        link.className = "social-link";
        link.href = item.link;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.title = item.alt;
        link.setAttribute("aria-label", item.alt);
        image.loading = "lazy";
        image.decoding = "async";
        image.alt = item.alt;
        image.addEventListener("error", () => {
            const fallback = document.createElement("span");

            fallback.className = "social-fallback";
            fallback.textContent = getImageInitials(item.alt);
            link.replaceChildren(fallback);
            link.classList.add("is-image-missing");
        }, { once: true });
        image.src = item.image;
        link.appendChild(image);
        listItem.appendChild(link);
        grid.appendChild(listItem);
    }
}

function renderBoxImage(box, item) {
    const imageArea = document.createElement("div");
    const image = document.createElement("img");

    imageArea.className = "profile-box-image";
    image.src = item.url;
    image.alt = item.alt || "";
    image.loading = "lazy";
    image.decoding = "async";
    applyImageSize(image, item);
    image.addEventListener("error", () => {
        imageArea.replaceChildren(createImageFallback(item.alt || "IMG"));
        imageArea.classList.add("is-image-missing");
    }, { once: true });
    imageArea.appendChild(image);
    box.appendChild(imageArea);
}

function renderImage(parent, item) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    figure.className = "profile-image reveal-text";
    image.src = item.url;
    image.alt = item.alt || "";
    image.loading = "lazy";
    image.decoding = "async";
    applyImageSize(image, item);
    image.addEventListener("error", () => {
        image.replaceWith(createImageFallback(item.alt));
        figure.classList.add("is-image-missing");
    }, { once: true });
    figure.appendChild(image);
    parent.appendChild(figure);
    figure.classList.add("is-visible");
}

function applyImageSize(image, item) {
    const size = item.size;
    const width = item.width ?? (size && typeof size === "object" ? size.width : size);
    const height = item.height ?? (size && typeof size === "object" ? size.height : size);

    if (width !== undefined) {
        image.style.width = toCssSize(width);
    }

    if (height !== undefined) {
        image.style.height = toCssSize(height);
    }
}

function toCssSize(value) {
    return typeof value === "number" ? `${value}px` : String(value);
}

function createImageFallback(label) {
    const fallback = document.createElement("span");

    fallback.className = "profile-image-fallback";
    fallback.textContent = getImageInitials(label || "IMG");
    return fallback;
}

function getImageInitials(label) {
    const initials = Array.from(String(label))
        .filter((character) => /[\p{L}\p{N}]/u.test(character))
        .slice(0, 3)
        .join("");

    return initials.toUpperCase() || "IMG";
}

async function renderBoxItem(parent, item) {
    if (item.type === "title2") {
        const heading = document.createElement("h3");
        heading.className = "reveal-text";
        parent.appendChild(heading);
        return typeText(heading, item.text);
    }

    if (item.type === "text") {
        const paragraph = document.createElement("p");
        paragraph.className = "reveal-text";
        parent.appendChild(paragraph);
        return typeText(paragraph, item.text);
    }

    if (item.type === "button") {
        const button = document.createElement("a");
        button.className = "profile-button reveal-text";
        button.href = item.link;
        button.target = "_blank";
        button.rel = "noreferrer";
        button.title = item.alt;

        if (item.color) {
            button.style.setProperty("--button-color", item.color);
        }

        parent.appendChild(button);
        return typeText(button, item.text);
    }
}

async function typeText(element, text) {
    element.textContent = "";
    element.classList.add("is-visible");

    for (const character of Array.from(String(text))) {
        element.append(character);
        await wait(textDelay);
    }
}

async function revealStaticText(element) {
    const text = element.textContent;
    element.textContent = "";
    element.classList.add("is-visible");
    return typeText(element, text);
}

function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}
