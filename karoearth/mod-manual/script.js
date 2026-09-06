document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("[data-markdown]");

    if (!container) {
        console.error("Markdown container not found.");
        return;
    }

    const markdownFile = container.dataset.markdown;

    if (!markdownFile) {
        console.error("Markdown file is not specified.");
        return;
    }

    try {
        // Markdownファイルを取得
        const response = await fetch(markdownFile);

        if (!response.ok) {
            throw new Error(
                `Failed to load Markdown: ${response.status}`
            );
        }

        const markdown = await response.text();

        // HTMLへ変換
        const html = marked.parse(markdown);

        // 一旦HTMLとして読み込む
        const parser = new DOMParser();
        const documentFragment =
            parser.parseFromString(html, "text/html");

        // ボックス構造に変換
        const result = createSections(
            documentFragment.body.children
        );

        container.replaceChildren(...result);

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <div class="markdown-error">
                Markdownの読み込みに失敗しました。
            </div>
        `;
    }
});


/**
 * セクションに変換
 */
function createSections(elements) {

    const result = [];

    let currentSection = null;
    let currentLevel = null;

    for (const element of elements) {

        // h1～h6か判定
        const match = element.tagName.match(/^H([1-6])$/);

        if (match) {

            const level = Number(match[1]);

            /*
             * h1はページタイトルとして扱う
             */
            if (level === 1) {

                // 現在のセクションを確定
                if (currentSection) {
                    result.push(currentSection);
                    currentSection = null;
                }

                result.push(element);

                currentLevel = null;

                continue;
            }

            /*
             * 同じレベル、または上位レベルの
             * 見出しが来たら現在のセクションを終了
             */
            if (
                currentSection &&
                level <= currentLevel
            ) {
                result.push(currentSection);
                currentSection = null;
            }

            /*
             * 新しいセクションを作成
             */
            currentSection = document.createElement("section");

            currentSection.className =
                `md-section md-section-h${level}`;

            // 見出し
            currentSection.appendChild(element);

            // 本文用コンテナ
            const content =
                document.createElement("div");

            content.className =
                "md-section-content";

            currentSection.appendChild(content);

            currentLevel = level;

            continue;
        }

        /*
         * 見出しではない要素
         */
        if (currentSection) {

            const content =
                currentSection.querySelector(
                    ".md-section-content"
                );

            content.appendChild(element);

        } else {

            /*
             * 見出しより前にある要素
             */
            result.push(element);
        }
    }

    /*
     * 最後のセクション
     */
    if (currentSection) {
        result.push(currentSection);
    }

    return result;
}
