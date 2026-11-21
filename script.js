document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(".nav-menu a");
    const sections = document.querySelectorAll(
        "#home, #services, #about, #portfolio, #pricing, #contact"
    );

    function setActiveLink(sectionId) {
        navLinks.forEach(function (link) {
            const active = link.getAttribute("href") === "#" + sectionId;
            link.style.color = active ? "var(--blue)" : "var(--muted)";
            link.style.fontWeight = active ? "700" : "400";

            if (active) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        }, {
            rootMargin: "-25% 0px -60% 0px",
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            setActiveLink(link.getAttribute("href").substring(1));
        });
    });

    function setText(selector, value) {
        const element = document.querySelector(selector);

        if (element && typeof value === "string") {
            element.textContent = value;
        }
    }

    function setTextInside(parent, selector, value) {
        const element = parent.querySelector(selector);

        if (element) {
            element.textContent = value;
        }
    }

    function safeUrl(value) {
        try {
            const url = new URL(value, location.href);

            if (url.protocol === "https:" || url.protocol === "http:") {
                return url.href;
            }
        } catch (error) {}

        return "";
    }

    function toman(value) {
        const number = Number(
            String(value || "").replace(/[^\d]/g, "")
        );

        return Number.isFinite(number)
            ? number.toLocaleString("fa-IR")
            : "";
    }

    fetch("./site-content.json", {
        cache: "no-store"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("فایل JSON پیدا نشد");
            }

            return response.json();
        })

        .then(data => {
            if (!data || data.app !== "VIRA TECH") {
                return;
            }

            const content = data.content || {};

            // عنوان و توضیحات صفحه اصلی
            if (content.siteTitle) {
                document.title = content.siteTitle + " | VIRA TECH";

                const heading = document.querySelector(".hero-content h1");

                if (heading) {
                    const parts = content.siteTitle.split("،");

                    heading.replaceChildren();

                    if (parts.length > 1) {
                        heading.append(
                            document.createTextNode(parts[0] + "، ")
                        );

                        const span = document.createElement("span");

                        span.textContent = parts.slice(1).join("،").trim();

                        heading.append(span);

                    } else {
                        heading.textContent = content.siteTitle;
                    }
                }
            }

            setText(".hero-content > p", content.siteDescription);
            setText(".nav-cta", content.buttonText);

            // بخش درباره ما
            setText(".about-content h2", content.aboutTitle);

            const aboutParagraphs = document.querySelectorAll(
                ".about-content > p"
            );

            if (typeof content.aboutDescription === "string") {

                const descriptions = content.aboutDescription
                    .split(/\n+/)
                    .map(text => text.trim())
                    .filter(Boolean);

                aboutParagraphs.forEach((paragraph, index) => {
                    paragraph.textContent = descriptions[index] || "";
                    paragraph.hidden = !descriptions[index];
                });
            }

            // خدمات
            if (Array.isArray(data.services)) {

                const grid = document.querySelector(".services-grid");

                if (grid) {

                    const originalCards = Array.from(
                        grid.querySelectorAll(".service-card")
                    );

                    const activeServices = data.services.filter(
                        service => service.active === true
                    );

                    activeServices.forEach(function (service, index) {

                        let card = originalCards[index];

                        if (!card && originalCards.length) {
                            card = originalCards[0].cloneNode(true);
                            grid.appendChild(card);
                        }

                        if (!card) return;

                        card.hidden = false;

                        setTextInside(
                            card,
                            "h3",
                            service.name || ""
                        );

                        setTextInside(
                            card,
                            "p",
                            service.description || ""
                        );

                        const link = card.querySelector("a");

                        if (link) {
                            link.href = "#contact";
                        }
                    });

                    originalCards.forEach((card, index) => {
                        if (index >= activeServices.length) {
                            card.hidden = true;
                        }
                    });
                }
            }

            // شماره واتساپ
            if (content.sitePhone) {

                const phone = String(content.sitePhone).replace(/\D/g, "");

                const whatsapp = "https://wa.me/" + phone;

                document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
                    link.href = whatsapp;
                });

                const phoneText = document.querySelector(
                    '.contact-card[href*="wa.me"] p'
                );

                if (phoneText) {
                    phoneText.textContent = content.sitePhone;
                }
            }

            // ایمیل
            if (content.siteEmail) {

                const emailLink = document.querySelector(
                    '.contact-card[href^="mailto:"]'
                );

                if (emailLink) {

                    emailLink.href = "mailto:" + content.siteEmail;

                    setTextInside(
                        emailLink,
                        "p",
                        content.siteEmail
                    );
                }
            }

            // نمونه‌کارها
            const portfolioGrid = document.querySelector(".portfolio-grid");

            if (portfolioGrid && Array.isArray(data.portfolio)) {

                portfolioGrid.replaceChildren();

                data.portfolio.forEach(function (item) {

                    const card = document.createElement("article");

                    card.className = "portfolio-card";

                    const image = document.createElement("div");

                    image.className = "portfolio-image portfolio-web";

                    const logo = document.createElement("span");

                    logo.textContent = item.name || "VIRA TECH";

                    image.appendChild(logo);

                    const info = document.createElement("div");

                    info.className = "portfolio-info";

                    const label = document.createElement("span");

                    label.className = "demo-label";

                    label.textContent = "نمونه‌کار VIRA TECH";

                    const title = document.createElement("h3");

                    title.textContent = item.name || "نمونه‌کار";

                    const description = document.createElement("p");

                    description.textContent = item.description || "";

                    info.append(label, title, description);

                    const link = safeUrl(item.link || "");

                    if (link) {

                        const anchor = document.createElement("a");

                        anchor.href = link;

                        anchor.target = "_blank";

                        anchor.rel = "noopener noreferrer";

                        anchor.textContent = "مشاهده پروژه";

                        info.appendChild(anchor);
                    }

                    card.append(image, info);

                    portfolioGrid.appendChild(card);
                });
            }

            // تعرفه‌ها
            if (data.pricing && Array.isArray(data.pricing.plans)) {

                const cards = document.querySelectorAll(
                    ".pricing-grid .pricing-card"
                );

                data.pricing.plans.forEach(function (plan, index) {

                    const card = cards[index];

                    if (!card) return;

                    setTextInside(
                        card,
                        ".plan-name",
                        plan.name || ""
                    );

                    const priceHeading = card.querySelector("h3");

                    if (priceHeading) {

                        priceHeading.replaceChildren();

                        priceHeading.append(
                            document.createTextNode(toman(plan.price) + " ")
                        );

                        const unit = document.createElement("small");

                        unit.textContent = "تومان";

                        priceHeading.appendChild(unit);
                    }

                    setTextInside(
                        card,
                        "p",
                        plan.description || ""
                    );

                    const list = card.querySelector("ul");

                    if (list) {

                        list.replaceChildren();

                        (
                            Array.isArray(plan.features)
                                ? plan.features
                                : []
                        ).forEach(feature => {

                            const li = document.createElement("li");

                            li.textContent = feature;

                            list.appendChild(li);
                        });
                    }
                });

                // قیمت فروشگاه اینترنتی
                const storePrice = toman(data.pricing.storePrice);

                const storeNote = document.querySelector(".pricing-note");

                if (storeNote) {

                    const paragraph = storeNote.querySelector("p");

                    if (paragraph) {

                        const extra = data.pricing.storeDescription || "";

                        paragraph.textContent =
                            "فروشگاه اینترنتی از " +
                            storePrice +
                            " تومان آغاز می‌شود. " +
                            extra;
                    }
                }
            }
        })

        .catch(error => {
            console.warn(
                "خطا در دریافت اطلاعات سایت:",
                error
            );
        });

    // سال خودکار فوتر
    const footerText = document.querySelector(".footer-bottom p");

    if (footerText) {

        footerText.textContent = footerText.textContent.replace(
            /©\s*\d{4}/,
            "© " + new Date().getFullYear()
        );
    }

});
