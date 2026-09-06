async function initMarkdownPage() {
    const container =
        document.querySelector("[data-markdown]");

    if (!container) {
        return;
    }

    const markdownFile =
        container.dataset.markdown;

    if (!markdownFile || !window.marked) {
        showMarkdownError(container);
        return;
    }

    try {
        const response =
            await fetch(markdownFile);

        if (!response.ok) {
            throw new Error(`Failed to load Markdown: ${response.status}`);
        }

        const markdown =
            await response.text();
        const html =
            window.marked.parse(markdown);
        const parsedDocument =
            new DOMParser().parseFromString(html, "text/html");
        const sections =
            createMarkdownSections(
                Array.from(parsedDocument.body.children)
            );

        container.replaceChildren(...sections);
    } catch (error) {
        console.error(error);
        showMarkdownError(container);
    }
}

function showMarkdownError(container) {
    container.innerHTML = `
        <div class="markdown-error">
            Markdownの読み込みに失敗しました。
        </div>
    `;
}

function createMarkdownSections(elements) {
    const result = [];
    const stack = [];

    for (const element of elements) {
        if (element.tagName === "HR") {
            stack.length = 0;
            result.push(element);
            continue;
        }

        const match =
            element.tagName.match(/^H([1-6])$/);

        if (match) {
            const level =
                Number(match[1]);
            const section =
                document.createElement("section");
            const content =
                document.createElement("div");

            while (
                stack.length > 0 &&
                stack[stack.length - 1].level >= level
            ) {
                stack.pop();
            }

            section.classList.add(
                "md-section",
                `md-section-h${level}`
            );
            content.className = "md-section-content";

            section.append(element, content);

            if (stack.length > 0) {
                stack[stack.length - 1].content.appendChild(section);
            } else {
                result.push(section);
            }

            stack.push({
                level,
                content
            });

            continue;
        }

        if (stack.length > 0) {
            stack[stack.length - 1].content.appendChild(element);
        } else {
            result.push(element);
        }
    }

    return result;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMarkdownPage);
} else {
    initMarkdownPage();
}
