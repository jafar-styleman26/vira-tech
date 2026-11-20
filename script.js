
document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // تنظیم لینک فعال منو
    // ==============================

    const navLinks = document.querySelectorAll(".nav-menu a");

    const sections = document.querySelectorAll(
        "#home, #services, #about, #portfolio, #pricing, #contact"
    );

    function setActiveLink(sectionId) {
        navLinks.forEach(function (link) {
            const isActive =
                link.getAttribute("href") === "#" + sectionId;

            link.style.color = isActive
                ? "var(--blue)"
                : "var(--muted)";

            link.style.fontWeight = isActive ? "700" : "400";

            if (isActive) {
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
            const sectionId = link.getAttribute("href").substring(1);
            setActiveLink(sectionId);
        });
    });

    // ==============================
    // ابزارهای کمکی
    // ==============================

    function createText(element, value) {
        if (!element || !value) return;
        element.textContent = value;
    }

    function safeUrl(value) {
        try {
            const url = new URL(value, window.location.href);

            if (
                url.protocol === "http:" ||
                url.protocol === "https:"
            ) {
                return url.href;
            }
        } catch (error) {}

        return "";
    }

    // ==============================
    // دریافت اطلاعات پنل مدیریت
    // ==============================

    fetch("./site-content.json", { cache: "no-store" })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("فایل اطلاعات سایت پیدا نشد");
            }

            return response.json();
        })
        .then(function (data) {

            if (!data || data.app !== "VIRA TECH") {
                throw new Error("ساختار فایل اطلاعات معتبر نیست");
            }

            const content = data.content || {};

            // ==============================
            // عنوان و توضیحات سایت
            // ==============================

            if (content.siteTitle) {

                document.title =
                    content.siteTitle + " | VIRA TECH";

                const heroTitle = document.querySelector(".hero-content h1");

                if (heroTitle) {
                    const parts = content.siteTitle.split("،");

                    heroTitle.replaceChildren();

                    if (parts.length > 1) {
                        heroTitle.append(
                            document.createTextNode(parts[0] + "، ")
                        );

                        const highlighted = document.createElement("span");
                        highlighted.textContent = parts.slice(1).join("،").trim();

                        heroTitle.append(highlighted);
                    } else {
                        heroTitle.textContent = content.siteTitle;
                    }
                }
            }

            if (content.siteDescription) {
                createText(
                    document.querySelector(".hero-content > p"),
                    content.siteDescription
                );
            }

            // ==============================
            // دکمه شروع همکاری
            // ==============================

            if (content.buttonText) {
                createText(
                    document.querySelector(".nav-cta"),
                    content.buttonText
                );
            }

            // ==============================
            // بخش درباره ما
            // ==============================

            if (content.aboutTitle) {
                const aboutTitle =
                    document.querySelector(".about-content h2");

                if (aboutTitle) {
                    aboutTitle.textContent = content.aboutTitle;
                }
            }

            if (content.aboutDescription) {
                const aboutParagraph =
                    document.querySelector(".about-content p");

                createText(aboutParagraph, content.aboutDescription);
            }

            // ==============================
            // خدمات
            // ==============================

            if (Array.isArray(data.services)) {

                const servicesGrid =
                    document.querySelector(".services-grid");

                if (servicesGrid) {

                    const cards = Array.from(
                        servicesGrid.querySelectorAll(".service-card")
                    );

                    const activeServices = data.services.filter(function (service) {
                        return service.active === true;
                    });

                    activeServices.forEach(function (service, index) {

                        let card = cards[index];

                        if (!card && cards.length > 0) {
                            card = cards[0].cloneNode(true);
                            servicesGrid.appendChild(card);
                        }

                        if (!card) return;

                        card.hidden = false;

                        createText(
                            card.querySelector("h3"),
                            service.name
                        );

                        createText(
                            card.querySelector("p"),
                            service.description
                        );

                        const link = card.querySelector("a");

                        if (link) {
                            link.setAttribute("href", "#contact");
                        }
                    });

                    cards.forEach(function (card, index) {
                        if (index >= activeServices.length) {
                            card.hidden = true;
                        }
                    });
                }
            }

            // ==============================
            // اطلاعات تماس
            // ==============================

            if (content.sitePhone) {

                const phone = String(content.sitePhone).replace(/\D/g, "");
                const whatsappUrl = "https://wa.me/" + phone;

                const whatsappCards = document.querySelectorAll(
                    '.contact-card[href*="wa.me"]'
                );

                whatsappCards.forEach(function (card) {
                    card.href = whatsappUrl;
                });

                const whatsappText =
                    document.querySelector('.contact-card[href*="wa.me"] p');

                createText(whatsappText, content.sitePhone);
                
                const whatsappButton =
                    document.querySelector(".contact-cta a");

                if (whatsappButton) {
                    whatsappButton.href = whatsappUrl;
                }
            }

            if (content.siteEmail) {

                const emailLink =
                    document.querySelector('.contact-card[href^="mailto:"]');

                if (emailLink) {
                    emailLink.href = "mailto:" + content.siteEmail;

                    createText(
                        emailLink.querySelector("p"),
                        content.siteEmail
                    );
                }
            }

            // ==============================
            // نمونه‌کارهای پنل مدیریت
            // ==============================

            if (
                Array.isArray(data.portfolio) &&
                data.portfolio.length > 0
            ) {

                const portfolioGrid =
                    document.querySelector(".portfolio-grid");

                if (portfolioGrid) {

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
                        description.textContent =
                            item.description || "";

                        info.append(label, title, description);
                        card.append(image, info);

                        const link = safeUrl(item.link || "");

                        if (link) {
                            card.style.cursor = "pointer";

                            card.addEventListener("click", function () {
                                window.open(
                                    link,
                                    "_blank",
                                    "noopener,noreferrer"
                                );
                            });
                        }

                        portfolioGrid.appendChild(card);
                    });
                }
            }

        })
        .catch(function (error) {
            console.warn(
                "اطلاعات پنل مدیریت بارگذاری نشد:",
                error.message
            );
        });

    // ==============================
    // سال خودکار فوتر
    // ==============================

    const footerText =
        document.querySelector(".footer-bottom p");

    if (footerText) {
        footerText.textContent = footerText.textContent.replace(
            /©\s*\d{4}/,
            "© " + new Date().getFullYear()
        );
    }

});
