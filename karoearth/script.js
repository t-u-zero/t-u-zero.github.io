const sitePages = [
    {
        id: "home",
        label: "ホーム",
        path: ""
    },
    {
        id: "rule",
        label: "利用規約",
        path: "rule/"
    },
    {
        id: "manual",
        label: "Mod Manual",
        path: "mod-manual/"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    hidePageLoader();
    createSiteMenu();
    animateSignalGrid();
});

function hidePageLoader() {
    const loader = document.querySelector(".page-loader");
    const label = loader?.querySelector(".page-loader-label");

    if (!loader || !label) {
        return;
    }

    const messages = [
        "Loading...",
        "Get HTML",
        "Get CSS",
        "ALL Complete",
        "Connecting...",
        "GO"
    ];
    const minimumDelay = 200;
    const maximumDelay = 1900;
    const delay =
        minimumDelay +
        Math.floor(Math.random() * (maximumDelay - minimumDelay + 1));
    const finalMessageAt = Math.max(0, delay - 120);
    const weights = messages
        .slice(1)
        .map(() => Math.random() + 0.25);
    const weightTotal = weights.reduce(
        (sum, weight) => sum + weight,
        0
    );
    let elapsed = 0;

    loader.style.setProperty("--loader-duration", `${delay}ms`);
    loader.classList.add("is-loading");
    label.textContent = messages[0];

    weights.forEach((weight, index) => {
        elapsed += finalMessageAt * weight / weightTotal;

        window.setTimeout(() => {
            label.textContent = messages[index + 1];
        }, Math.round(elapsed));
    });

    window.setTimeout(() => {
        loader.classList.add("is-hidden");
        loader.setAttribute("aria-hidden", "true");
    }, delay);
}

function createSiteMenu() {
    if (document.getElementById("site-menu")) {
        return;
    }

    const rootPath = normalizeRootPath(
        document.body.dataset.siteRoot || "./"
    );
    const currentPage =
        document.body.dataset.page || "home";

    document.body.classList.add("has-site-menu");

    const menu =
        document.createElement("aside");

    menu.className = "site-menu";
    menu.id = "site-menu";
    menu.setAttribute("aria-label", "サイトメニュー");

    const navItems = sitePages
        .map((page) => {
            const isCurrent = page.id === currentPage;

            return `
                <a
                    href="${rootPath}${page.path}"
                    class="${isCurrent ? "is-current" : ""}"
                    ${isCurrent ? 'aria-current="page"' : ""}
                >
                    <span>${page.label}</span>
                </a>
            `;
        })
        .join("");

    menu.innerHTML = `
        <a class="site-menu-brand" href="${rootPath}" aria-label="かろEarth ホーム">
            <span class="brand-mark">KE</span>
            <span>
                <strong>かろEarth</strong>
                <small>Server Hub</small>
            </span>
        </a>

        <nav class="site-menu-nav">
            ${navItems}
        </nav>

        <div class="site-menu-footer">
            <span>NETWORK</span>
            <strong>ONLINE</strong>
        </div>
    `;

    const toggle =
        document.createElement("button");

    toggle.className = "site-menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-controls", "site-menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "メニュー");
    toggle.title = "メニュー";
    toggle.innerHTML = "<span></span><span></span><span></span>";

    const closeMenu = () => {
        document.body.classList.remove("is-menu-open");
        toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
        const isOpen =
            document.body.classList.toggle("is-menu-open");

        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.body.prepend(toggle, menu);
}

function normalizeRootPath(path) {
    return path.endsWith("/") ? path : `${path}/`;
}

function animateSignalGrid() {
    const cells = Array.from(
        document.querySelectorAll(".signal-grid span")
    );

    if (cells.length === 0) {
        return;
    }

    let activeIndex = 0;

    const tick = () => {
        cells.forEach((cell, index) => {
            const distance = Math.abs(index - activeIndex);

            cell.classList.toggle(
                "is-lit",
                distance === 0 || distance === 2
            );
        });

        activeIndex = (activeIndex + 1) % cells.length;
    };

    tick();
    window.setInterval(tick, 900);
}
