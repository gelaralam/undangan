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

// Lightbox Module
const initLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.lightbox-nav .prev');
    const nextBtn = document.querySelector('.lightbox-nav .next');

    let currentIndex = 0;

    if (!lightbox || !lightboxImg || !lightboxClose) return;

    const openLightbox = (index) => {
        currentIndex = index;
        const imgSrc = galleryItems[currentIndex].querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        lightboxImg.src = galleryItems[currentIndex].querySelector('img').src;
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        lightboxImg.src = galleryItems[currentIndex].querySelector('img').src;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on click outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    if (prevBtn) prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    if (nextBtn) nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }
    });
};

// Enhanced Animations Module
const initAnimations = () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('gallery-grid')) {
                    // Sequenced animation for gallery items
                    const items = entry.target.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animated');
                        }, index * 30); // Further reduced delay to 30ms for even faster appearance
                    });
                    observer.unobserve(entry.target);
                } else {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.hero-content *, .glass-card, .event-card, .fade-up, .gallery-grid');
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
            overlay.classList.add('open');
            mainContent.classList.remove('hidden');

            if (music && music.toggleMusic) {
                music.toggleMusic();
            }

            // Init Components
            const targetDate = new Date("April 11, 2026 10:00:00 GMT+0700").getTime();
            initCountdown(targetDate);
            initAnimations();
            initLightbox();

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

            // RSVP logic
            const rsvpForm = document.getElementById('rsvp-form');
            const rsvpList = document.getElementById('rsvp-list');

            if (rsvpForm && rsvpList) {
                rsvpForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const name = document.getElementById('rsvp-name').value;
                    const message = document.getElementById('rsvp-message').value;
                    const presence = document.getElementById('rsvp-presence').value;

                    // Create entry element
                    const entry = document.createElement('div');
                    entry.className = 'rsvp-entry';

                    const statusClass = presence.toLowerCase().includes('tidak') ? 'tidak-hadir' : 'hadir';

                    entry.innerHTML = `
                        <div class="entry-header">
                            <span class="entry-name">${name}</span>
                            <span class="entry-status ${statusClass}">${presence}</span>
                        </div>
                        <div class="entry-message">${(message || 'Tidak ada ucapan.').replace(/\n/g, '<br>')}</div>
                    `;

                    // Add to list (at the top)
                    rsvpList.insertBefore(entry, rsvpList.firstChild);

                    // Reset form
                    rsvpForm.reset();

                    alert('Terima kasih! Konfirmasi Anda telah terkirim.');
                });
            }

            // nav QR
            const navQR = document.getElementById('nav-qr');
            if (navQR) {
                navQR.addEventListener('click', () => {
                    alert('Fitur Buku Tamu (QR Code) bakal segera hadir!');
                });
            }
        });
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
