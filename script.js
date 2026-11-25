
document.addEventListener("DOMContentLoaded", function () {

    // انتخاب لینک‌های منو
    const navLinks = document.querySelectorAll(".nav-menu a");

    // انتخاب تمام بخش‌های سایت، شامل اکوسیستم ویرا
    const sections = document.querySelectorAll(
        "#home, #services, #about, #portfolio, #ecosystem, #pricing, #contact"
    );

    // مشخص کردن لینک فعال منو
    function setActiveLink(sectionId) {
        navLinks.forEach(function (link) {
            const isActive = link.getAttribute("href") === "#" + sectionId;

            link.style.color = isActive ? "var(--blue)" : "var(--muted)";
            link.style.fontWeight = isActive ? "700" : "400";

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // بررسی بخش قابل مشاهده هنگام اسکرول
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

    // فعال کردن لینک هنگام کلیک
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            const href = link.getAttribute("href");

            if (href && href.startsWith("#")) {
                setActiveLink(href.substring(1));
            }
        });
    });

    // به‌روزرسانی سال فوتر
    const footerText = document.querySelector(".footer-bottom p");

    if (footerText) {
        footerText.textContent = footerText.textContent.replace(
            /©\s*\d{4}/,
            "© " + new Date().getFullYear()
        );
    }

    // اتصال قیمت‌های پنل مدیریت به سایت اصلی
    async function loadPricing() {
        try {
            const response = await fetch("site-content.json?v=" + Date.now());

            if (!response.ok) {
                throw new Error("فایل اطلاعات سایت پیدا نشد");
            }

            const data = await response.json();
            const pricing = data.pricing;

            if (!pricing || !Array.isArray(pricing.plans)) {
                return;
            }

            const cards = document.querySelectorAll("#pricing .pricing-card");

            pricing.plans.forEach(function (plan, index) {
                const card = cards[index];

                if (!card) return;

                const name = card.querySelector(".plan-name");
                const price = card.querySelector("h3");
                const description = card.querySelector("p");
                const features = card.querySelector("ul");

                if (name && plan.name) {
                    name.textContent = plan.name;
                }

                if (price && plan.price !== undefined && plan.price !== null) {
                    const amount = Number(plan.price);

                    if (Number.isFinite(amount)) {
                        const formattedPrice = amount.toLocaleString("fa-IR");
                        const unit = price.querySelector("small");

                        price.textContent = formattedPrice + " ";

                        if (unit) {
                            price.appendChild(unit);
                        } else {
                            const small = document.createElement("small");
                            small.textContent = "تومان";
                            price.appendChild(small);
                        }
                    }
                }

                if (description && plan.description) {
                    description.textContent = plan.description;
                }

                if (features && Array.isArray(plan.features)) {
                    features.replaceChildren();

                    plan.features.forEach(function (feature) {
                        const li = document.createElement("li");
                        li.textContent = feature;
                        features.appendChild(li);
                    });
                }
            });

            // تعرفه فروشگاه اینترنتی
            const storeNote = document.querySelector(".pricing-note p");

            if (storeNote && pricing.storePrice !== undefined && pricing.storePrice !== null) {
                const amount = Number(pricing.storePrice);

                if (Number.isFinite(amount)) {
                    const formattedPrice = amount.toLocaleString("fa-IR");

                    storeNote.textContent =
                        "فروشگاه اینترنتی از " +
                        formattedPrice +
                        " تومان آغاز می‌شود. " +
                        (pricing.storeDescription || "");
                }
            }

        } catch (error) {
            console.log(
                "تعرفه‌ها با اطلاعات پیش‌فرض نمایش داده می‌شوند:",
                error
            );
        }
    }

    // اجرای دریافت تعرفه‌ها
    loadPricing();

});
