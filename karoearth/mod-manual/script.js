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
        const response = await fetch(markdownFile);

        if (!response.ok) {
            throw new Error(
                `Failed to load Markdown: ${response.status}`
            );
        }

        const markdown = await response.text();

        // Markdown → HTML
        const html = marked.parse(markdown);

        // HTMLとして解析
        const parser = new DOMParser();
        const parsedDocument =
            parser.parseFromString(html, "text/html");

        // セクション構造を作成
        const result = createSections(
            Array.from(parsedDocument.body.children)
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
 * MarkdownのHTMLをセクション構造へ変換する。
 *
 * 見出しレベル:
 *
 * h1
 * └─ h2
 *    └─ h3
 *       └─ h4
 *
 * 同じレベルの見出しは兄弟になる。
 *
 * 下位レベルの見出しは、
 * 直前の上位レベルのセクションに入る。
 *
 * 見出しの文字列は一切判定に使用しないため、
 * 同じタイトルが何回あっても問題ない。
 */
function createSections(elements) {

    const result = [];

    /*
     * 現在のセクション。
     *
     * stackの末尾が常に
     * 「現在本文を書き込む場所」になる。
     */
    const stack = [];


    for (const element of elements) {

        /*
         * =====================================
         * 水平線
         * =====================================
         */

        if (element.tagName === "HR") {

            /*
             * ここで現在の階層をすべて終了。
             */
            stack.length = 0;

            result.push(element);

            continue;
        }


        /*
         * =====================================
         * 見出し
         * =====================================
         */

        const match =
            element.tagName.match(/^H([1-6])$/);


        if (match) {

            const level = Number(match[1]);


            /*
             * 現在の見出しと同じ、
             * またはそれより上の階層を閉じる。
             *
             * 例:
             *
             * h2
             * h3
             * h2
             *
             * ↓
             *
             * h2
             * h2
             */
            while (
                stack.length > 0 &&
                stack[stack.length - 1].level >= level
            ) {
                stack.pop();
            }


            /*
             * sectionを作成
             */
            const section =
                document.createElement("section");

            section.classList.add(
                "md-section",
                `md-section-h${level}`
            );


            /*
             * 見出し
             */
            section.appendChild(element);


            /*
             * 本文領域
             */
            const content =
                document.createElement("div");

            content.className =
                "md-section-content";

            section.appendChild(content);


            /*
             * 親が存在する場合
             */
            if (stack.length > 0) {

                const parent =
                    stack[stack.length - 1];

                parent.content.appendChild(section);

            } else {

                /*
                 * 親が存在しない場合は
                 * ページの最上位に追加。
                 */
                result.push(section);
            }


            /*
             * 新しい現在位置
             */
            stack.push({
                level: level,
                section: section,
                content: content
            });

            continue;
        }


        /*
         * =====================================
         * 通常のHTML
         * =====================================
         */

        if (stack.length > 0) {

            /*
             * 現在の一番深いセクションへ追加
             */
            const current =
                stack[stack.length - 1];

            current.content.appendChild(element);

        } else {

            /*
             * 見出しより前に存在する要素。
             */
            result.push(element);
        }
    }


    return result;
}
