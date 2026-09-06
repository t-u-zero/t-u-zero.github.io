// meta.js

document.addEventListener("DOMContentLoaded", async () => {
    const element = document.querySelector("#meta-json");

    if (!element) {
        console.error("Meta JSON element not found.");
        return;
    }

    const jsonFile = element.dataset.json;

    if (!jsonFile) {
        console.error("JSON file is not specified.");
        return;
    }

    try {
        const response = await fetch(jsonFile);

        if (!response.ok) {
            throw new Error(
                `Failed to load JSON: ${response.status}`
            );
        }

        const config = await response.json();

        applyMeta(config);

    } catch (error) {
        console.error("Failed to load page metadata:", error);
    }
});


/**
 * ページメタデータを適用する
 */
function applyMeta(config) {

    // title
    if (config.title) {
        document.title = config.title;
    }

    // description
    if (config.description) {
        setMeta(
            "name",
            "description",
            config.description
        );
    }

    // author
    if (config.author) {
        setMeta(
            "name",
            "author",
            config.author
        );
    }

    // keywords
    if (Array.isArray(config.keywords)) {
        setMeta(
            "name",
            "keywords",
            config.keywords.join(", ")
        );
    }

    // OGP
    if (config.og) {

        if (config.og.title) {
            setMeta(
                "property",
                "og:title",
                config.og.title
            );
        }

        if (config.og.description) {
            setMeta(
                "property",
                "og:description",
                config.og.description
            );
        }

        if (config.og.type) {
            setMeta(
                "property",
                "og:type",
                config.og.type
            );
        }

        if (config.og.image) {
            setMeta(
                "property",
                "og:image",
                config.og.image
            );
        }

        // 現在のページURL
        setMeta(
            "property",
            "og:url",
            window.location.href
        );
    }

    // Twitter Card
    if (config.twitter) {

        if (config.twitter.card) {
            setMeta(
                "name",
                "twitter:card",
                config.twitter.card
            );
        }

        if (config.twitter.title) {
            setMeta(
                "name",
                "twitter:title",
                config.twitter.title
            );
        }

        if (config.twitter.description) {
            setMeta(
                "name",
                "twitter:description",
                config.twitter.description
            );
        }

        if (config.twitter.image) {
            setMeta(
                "name",
                "twitter:image",
                config.twitter.image
            );
        }
    }
}


/**
 * metaタグを作成・更新する
 */
function setMeta(attribute, name, content) {

    let meta = document.head.querySelector(
        `meta[${attribute}="${name}"]`
    );

    if (!meta) {
        meta = document.createElement("meta");

        meta.setAttribute(attribute, name);

        document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
}
