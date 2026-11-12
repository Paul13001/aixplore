/* ==========================================================================
   Aixplore – main script (loaded on every page with "defer")
   1. Style switch (swaps the stylesheet, choice remembered)
   2. Mobile menu
   3. Floating "back to top" link
   4. Feedback form -> e-mail opened in the visitor's mail client
   5. Deals filter (extra feature)
   ========================================================================== */
(function () {
    "use strict";

    // Address that receives the feedback e-mails (to replace with the team's address).
    var FEEDBACK_EMAIL = "aixplore.contact@gmail.com";

    // Both stylesheets, as different as possible from each other.
    var STYLES = {
        // "label" = text of the link, i.e. the style you switch TO.
        default: { href: "assets/css/style.min.css", label: "Passer au style « Nuit électrique »" },
        alternate: { href: "assets/css/alternate.min.css", label: "Passer au style « Provence »" }
    };
    var STORAGE_KEY = "aix-style";

    // Lets the CSS know that JavaScript is running (used by the mobile menu).
    document.documentElement.classList.add("js");

    /* ---------- Safe localStorage helpers (may be blocked in private mode) ---------- */
    function readStorage(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function writeStorage(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            // Nothing to do: the choice simply won't be remembered.
        }
    }

    /* ---------- 1. Style switch ---------- */
    var stylesheet = document.getElementById("theme-stylesheet");
    var switchLinks = document.querySelectorAll("[data-style-switch]");

    function applyStyle(name) {
        var style = STYLES[name] || STYLES.default;
        if (stylesheet) {
            stylesheet.setAttribute("href", style.href);
        }
        switchLinks.forEach(function (link) {
            link.textContent = style.label;
            link.setAttribute("aria-pressed", name === "alternate" ? "true" : "false");
        });
        document.documentElement.setAttribute("data-style", name);
    }

    var currentStyle = readStorage(STORAGE_KEY) === "alternate" ? "alternate" : "default";
    applyStyle(currentStyle);

    switchLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            currentStyle = currentStyle === "default" ? "alternate" : "default";
            applyStyle(currentStyle);
            writeStorage(STORAGE_KEY, currentStyle);
        });
        // role="button": the space bar must work too.
        link.addEventListener("keydown", function (event) {
            if (event.key === " ") {
                event.preventDefault();
                link.click();
            }
        });
    });

    /* ---------- 2. Mobile menu ---------- */
    var menuButton = document.querySelector(".menu-toggle");
    var nav = document.getElementById("main-nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", function () {
            var isOpen = nav.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
        // Escape closes the menu.
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && nav.classList.contains("is-open")) {
                nav.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.focus();
            }
        });
    }

    /* ---------- 3. Floating "back to top" link (long pages) ---------- */
    var backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        var ticking = false;
        window.addEventListener("scroll", function () {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(function () {
                backToTop.classList.toggle("is-floating", window.scrollY > 600);
                ticking = false;
            });
        }, { passive: true });
    }

    /* ---------- 4. Feedback form ---------- */
    var form = document.getElementById("feedback-form");
    if (form) {
        var message = document.getElementById("message");
        var counter = document.getElementById("message-counter");
        var status = document.getElementById("form-status");
        var maxLength = Number(message.getAttribute("maxlength"));

        // Live character counter.
        message.addEventListener("input", function () {
            var left = maxLength - message.value.length;
            counter.textContent = left + " caractère" + (left > 1 ? "s" : "") + " restant" + (left > 1 ? "s" : "") + ".";
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            // Native HTML5 validation (required, type="email", minlength…).
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            var data = new FormData(form);
            var name = String(data.get("name")).trim();
            var subject = "[Aixplore] Avis de " + name;
            var body = [
                "Nom : " + name,
                "E-mail : " + data.get("email"),
                "Profil : " + data.get("status"),
                "Rubrique préférée : " + (data.get("favorite-page") || "non précisée"),
                "Note : " + data.get("rating"),
                "",
                "Message :",
                String(data.get("message")).trim()
            ].join("\n");

            // Opens the visitor's mail client with the e-mail already written.
            window.location.href = "mailto:" + FEEDBACK_EMAIL +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);

            status.textContent = "Votre messagerie va s'ouvrir avec l'e-mail prêt à envoyer. Merci pour votre avis !";
        });

        form.addEventListener("reset", function () {
            status.textContent = "";
            counter.textContent = maxLength + " caractères maximum.";
        });
    }

    /* ---------- 5. Deals filter ---------- */
    var filterBar = document.getElementById("deal-filter");
    if (filterBar) {
        var chips = filterBar.querySelectorAll("[data-filter]");
        var deals = document.querySelectorAll(".deal-list [data-category]");
        filterBar.hidden = false; // Only shown when JavaScript works.

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                var filter = chip.getAttribute("data-filter");
                chips.forEach(function (other) {
                    other.setAttribute("aria-pressed", other === chip ? "true" : "false");
                });
                deals.forEach(function (deal) {
                    deal.hidden = filter !== "all" && deal.getAttribute("data-category") !== filter;
                });
            });
        });
    }
}());
