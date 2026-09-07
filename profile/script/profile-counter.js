export function countProfileText(config) {
    let total = textLength("プロフィール") +
        textLength("STATUS: ACTIVE / LOCATION: AOMORI, JP");

    for (const section of config.sections) {
        total += textLength(`// ${String(section.title).toUpperCase()}`);
        total += textLength(section.title);

        for (let index = 0; index < section.content.length; index += 1) {
            const item = section.content[index];
            const nextItem = section.content[index + 1];

            if (item.type === "title" && nextItem?.type === "text") {
                total += textLength(item.text) + textLength(nextItem.text);
                index += 1;
                continue;
            }

            total += countItemText(item);
        }
    }

    return Math.max(1, total);
}

function countItemText(item) {
    if (["title", "text"].includes(item.type)) {
        return textLength(item.text);
    }

    if (item.type === "list") {
        return item.list.reduce((total, value) => total + textLength(value), 0);
    }

    if (item.type === "box") {
        return item.contents.reduce(
            (total, value) => total + countBoxItemText(value),
            0
        );
    }

    return 0;
}

function countBoxItemText(item) {
    return ["title2", "text", "button"].includes(item.type)
        ? textLength(item.text)
        : 0;
}

function textLength(value) {
    return Array.from(String(value)).length;
}
