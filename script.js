document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle ARIA expanded attribute
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // --- Theme Switcher ---
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const themeOptions = document.getElementById('theme-options');
    const themeOptionButtons = document.querySelectorAll('.theme-option');

    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('dark'); // Default to dark theme for new visitors
    }

    if (themeSwitcherBtn) {
        themeSwitcherBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from closing mobile menu
            themeOptions.classList.toggle('hidden');
        });
    }

    themeOptionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from closing mobile menu
            const theme = button.getAttribute('data-theme');
            setTheme(theme);
            themeOptions.classList.add('hidden');
        });
    });

    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Don't smooth scroll if it's just the mobile link
            if (!this.classList.contains('nav-link')) {
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Contact Form Submission ---
    const form = document.getElementById('contact-form');
    if (form) {
        const formStatus = document.getElementById('form-status');
        async function handleSubmit(event) {
            event.preventDefault();
            const data = new FormData(event.target);
            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    formStatus.textContent = "Thanks for your message! I'll get back to you soon.";
                    formStatus.style.color = 'green';
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        formStatus.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = "Oops! There was a problem submitting your form.";
                    }
                    formStatus.style.color = 'red';
                }
            } catch (error) {
                formStatus.textContent = "Oops! There was a problem submitting your form.";
                formStatus.style.color = 'red';
            }
        }
        form.addEventListener("submit", handleSubmit);
    }

    // --- Dynamic Scroll Animation for All Cards ---
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = document.querySelectorAll('.card, .skill-category, .strength-card, .project-card, .cert-card');
    elementsToAnimate.forEach((el) => scrollObserver.observe(el));

    // --- Scroll to Top Button ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollTopBtn.classList.add("show");
            } else {
                scrollTopBtn.classList.remove("show");
            }
        };
        scrollTopBtn.addEventListener("click", function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // --- Text-to-Speech for Hero Section ---
    const speakButton = document.getElementById('speakBtn');
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (speakButton && heroTitle && heroSubtitle && 'speechSynthesis' in window) {
        speakButton.addEventListener('click', (e) => {
            e.preventDefault();
            const textToSpeak = `${heroTitle.textContent}, ${heroSubtitle.textContent}`;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            window.speechSynthesis.speak(utterance);
        });
    }
});
