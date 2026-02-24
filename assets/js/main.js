// --- Modules ---

// Countdown Module
const initCountdown = (targetDate) => {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownEl.innerHTML = `
            <div class="timer">
                <div class="timer-item"><span>${days}</span><div class="timer-item-label">Hari</div></div>
                <div class="timer-item"><span>${hours}</span><div class="timer-item-label">Jam</div></div>
                <div class="timer-item"><span>${minutes}</span><div class="timer-item-label">Menit</div></div>
                <div class="timer-item"><span>${seconds}</span><div class="timer-item-label">Detik</div></div>
            </div>
        `;

        if (distance < 0) {
            clearInterval(timer);
            countdownEl.innerHTML = "Acara Telah Berlangsung";
        }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
};

// Music Module
const initMusic = () => {
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    let isPlaying = false;

    if (!musicBtn || !audio || !icon) return { toggleMusic: () => { } };

    const toggleMusic = () => {
        if (isPlaying) {
            audio.pause();
            icon.innerText = '🔇';
        } else {
            audio.play().catch(err => {
                console.warn("Autoplay was prevented or audio failed:", err);
                isPlaying = false;
                icon.innerText = '🔇';
            });
            icon.innerText = '🎵';
        }
        isPlaying = !isPlaying;
    };

    musicBtn.addEventListener('click', toggleMusic);

    return { toggleMusic };
};

// Animations Module
const initAnimations = () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.hero-content *, .glass-card, .event-card, .fade-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
};

// --- Main Execution ---

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('btn-open-invitation');
    const overlay = document.getElementById('overlay-door');
    const mainContent = document.getElementById('main-content');

    // Music Manager
    const music = initMusic();

    // Handle button even if mainContent or overlay are slightly different
    if (openBtn && overlay && mainContent) {
        openBtn.addEventListener('click', () => {
            console.log("Button clicked!"); // Debug log
            overlay.classList.add('open');
            mainContent.classList.remove('hidden');

            // Interaction might be needed for music
            if (music && music.toggleMusic) {
                music.toggleMusic();
            }

            // Init Countdown
            const targetDate = new Date("April 11, 2026 09:00:00").getTime();
            initCountdown(targetDate);

            // Init Animations
            initAnimations();

            // Bottom Nav Interaction
            document.querySelectorAll('.nav-item').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });

            // Nav Audio Toggle
            const navAudio = document.getElementById('nav-audio');
            if (navAudio) {
                navAudio.addEventListener('click', () => {
                    if (music && music.toggleMusic) {
                        music.toggleMusic();
                    }
                });
            }

            // nav QR (placeholder)
            const navQR = document.getElementById('nav-qr');
            if (navQR) {
                navQR.addEventListener('click', () => {
                    alert('Fitur Buku Tamu (QR Code) bakal segera hadir!');
                });
            }
        });
    } else {
        console.error("Missing critical elements:", { openBtn, overlay, mainContent });
    }

    // Extract guest name from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        const guestEl = document.getElementById('guest-name');
        if (guestEl) {
            guestEl.innerText = decodeURIComponent(guestName);
        }
    }
});
