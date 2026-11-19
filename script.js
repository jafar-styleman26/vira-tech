
document.addEventListener("DOMContentLoaded", function () {

    // انتخاب لینک‌های منو
    const navLinks = document.querySelectorAll(".nav-menu a");

    // انتخاب بخش‌های سایت
    const sections = document.querySelectorAll(
        "#home, #services, #about, #portfolio, #pricing, #contact"
    );

    // مشخص کردن لینک فعال منو
    function setActiveLink(sectionId) {
        navLinks.forEach(function (link) {

            const isActive = link.getAttribute("href") === "#" + sectionId;

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

    // بررسی بخش قابل مشاهده در صفحه
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

            const sectionId = link.getAttribute("href").substring(1);
            setActiveLink(sectionId);

        });
    });

    // به‌روزرسانی خودکار سال فوتر
    const footerText = document.querySelector(".footer-bottom p");

    if (footerText) {
        footerText.textContent = footerText.textContent.replace(
            /©\s*\d{4}/,
            "© " + new Date().getFullYear()
        );
    }

});