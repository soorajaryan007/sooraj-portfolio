document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
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
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, {
        threshold: 0.1 // Animate when 10% of the element is visible
    });

    const elementsToAnimate = document.querySelectorAll('.card, .skill-category, .strength-card');
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
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
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
            
            // Stop any previous speech before starting a new one
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            window.speechSynthesis.speak(utterance);
        });
    }

});