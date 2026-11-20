
document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(".nav-menu a");
    const sections = document.querySelectorAll(
        "#home, #services, #about, #portfolio, #pricing, #contact"
    );

    function setActiveLink(sectionId) {
        navLinks.forEach(function (link) {
            const active =
                link.getAttribute("href") === "#" + sectionId;

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

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    navLinks.forEach(function (link) {
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

    function safeUrl(value) {
        try {
            const url = new URL(value, location.href);
            if (url.protocol === "https:" || url.protocol === "http:") {
                return url.href;
            }
        } catch (error) {}
        return "";
    }

    fetch("./site-content.json", { cache: "no-store" })
        .then(function (response) {
            if (!response.ok) throw new Error("فایل JSON پیدا نشد");
            return response.json();
        })
        .then(function (data) {

            if (!data || data.app !== "VIRA TECH") return;

            const content = data.content || {};

            // عنوان سایت
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

            // توضیحات صفحه اصلی
            setText(".hero-content > p", content.siteDescription);

            // دکمه اصلی
            setText(".nav-cta", content.buttonText);

            // درباره ما: عنوان و تمام پاراگراف‌ها
            setText(".about-content h2", content.aboutTitle);

            const aboutParagraphs =
                document.querySelectorAll(".about-content > p");

            if (typeof content.aboutDescription === "string") {
                const descriptions = content.aboutDescription
                    .split(/\n+/)
                    .map(text => text.trim())
                    .filter(Boolean);

                aboutParagraphs.forEach(function (paragraph, index) {
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
                        setCardText(card, service);
                    });

                    originalCards.forEach(function (card, index) {
                        if (index >= activeServices.length) {
                            card.hidden = true;
                        }
                    });
                }
            }

            // اطلاعات تماس
            if (content.sitePhone) {
                const phone = String(content.sitePhone).replace(/\D/g, "");
                const whatsapp = "https://wa.me/" + phone;

                document.querySelectorAll('a[href*="wa.me"]').forEach(
                    link => link.href = whatsapp
                );

                const phoneText =
                    document.querySelector('.contact-card[href*="wa.me"] p');

                if (phoneText) phoneText.textContent = content.sitePhone;
            }

            if (content.siteEmail) {
                const emailLink =
                    document.querySelector('.contact-card[href^="mailto:"]');

                if (emailLink) {
                    emailLink.href = "mailto:" + content.siteEmail;
                    const p = emailLink.querySelector("p");
                    if (p) p.textContent = content.siteEmail;
                }
            }

            // نمونه‌کارها
            const portfolioGrid =
                document.querySelector(".portfolio-grid");

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
                    card.append(image, info);

                    const link = safeUrl(item.link || "");

                    if (link) {
                        const anchor = document.createElement("a");
                        anchor.href = link;
                        anchor.target = "_blank";
                        anchor.rel = "noopener noreferrer";
                        anchor.textContent = "مشاهده پروژه";
                        info.appendChild(anchor);
                    }

                    portfolioGrid.appendChild(card);
                });
            }

        })
        .catch(function (error) {
            console.warn("خطا در دریافت اطلاعات سایت:", error);
        });

    function setCardText(card, service) {
        const title = card.querySelector("h3");
        const description = card.querySelector("p");
        const link = card.querySelector("a");

        if (title) title.textContent = service.name || "";
        if (description) description.textContent = service.description || "";
        if (link) link.href = "#contact";
    }

    // سال فوتر
    const footerText = document.querySelector(".footer-bottom p");

    if (footerText) {
        footerText.textContent = footerText.textContent.replace(
            /©\s*\d{4}/,
            "© " + new Date().getFullYear()
        );
    }

});
