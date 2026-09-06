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
 * 見出しを基準にセクションを作成
 *
 * #       → h1
 * ##      → h2
 * ###     → h3
 *
 * 下位レベルの見出しは、直前の上位レベルの
 * セクションの中に入る。
 */
function createSections(elements) {

    const result = [];

    /*
     * 現在開いているセクション
     *
     * 例:
     *
     * # A
     * ## B
     * ### C
     *
     * の場合
     *
     * [
     *   { level: 1, section: A },
     *   { level: 2, section: B },
     *   { level: 3, section: C }
     * ]
     */
    const stack = [];

    for (const element of elements) {

        // h1～h6か判定
        const match = element.tagName.match(/^H([1-6])$/);

        if (match) {

            const level = Number(match[1]);

            /*
             * 今の見出し以上のレベルを閉じる
             *
             * h2が来た場合:
             *
             * h1
             *   └ h2
             *
             * から、新しいh2を作るので、
             * 現在のh2は閉じる。
             *
             * h1は残る。
             */
            while (
                stack.length > 0 &&
                stack[stack.length - 1].level >= level
            ) {
                stack.pop();
            }

            /*
             * 新しいセクションを作成
             */
            const section =
                document.createElement("section");

            section.className =
                `md-section md-section-h${level}`;

            /*
             * 見出し
             */
            section.appendChild(element);

            /*
             * 本文用コンテナ
             */
            const content =
                document.createElement("div");

            content.className =
                "md-section-content";

            section.appendChild(content);

            /*
             * 親セクションが存在する場合、
             * 親のcontentの中に入れる。
             */
            if (stack.length > 0) {

                const parent =
                    stack[stack.length - 1].section;

                const parentContent =
                    parent.querySelector(
                        ":scope > .md-section-content"
                    );

                parentContent.appendChild(section);

            } else {

                /*
                 * 親がない場合は最上位
                 */
                result.push(section);
            }

            /*
             * 現在のセクションとして登録
             */
            stack.push({
                level: level,
                section: section
            });

            continue;
        }

        /*
         * 見出しではない要素
         */

        if (stack.length > 0) {

            /*
             * 現在の一番深いセクションに入れる
             */
            const current =
                stack[stack.length - 1].section;

            const content =
                current.querySelector(
                    ":scope > .md-section-content"
                );

            content.appendChild(element);

        } else {

            /*
             * 見出しより前にある要素
             */
            result.push(element);
        }
    }

    return result;
}
