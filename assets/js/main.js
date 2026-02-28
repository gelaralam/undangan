// --- Helpers ---
const copyText = (elementId) => {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Teks berhasil disalin!');
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
    });
};

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
    const audio = document.getElementById('bg-music');
    const navAudio = document.getElementById('nav-audio');
    let isPlaying = false;

    if (!audio || !navAudio) return { toggleMusic: () => { } };

    const toggleMusic = () => {
        if (isPlaying) {
            audio.pause();
            navAudio.classList.remove('playing');
            navAudio.querySelector('span').innerText = 'Audio: Off';
        } else {
            audio.play().catch(err => {
                console.warn("Autoplay prevented:", err);
            });
            navAudio.classList.add('playing');
            navAudio.querySelector('span').innerText = 'Audio: On';
        }
        isPlaying = !isPlaying;
    };

    return { toggleMusic, getIsPlaying: () => isPlaying };
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
        const img = item.querySelector('img');
        if (img) {
            // If image is already cached/loaded
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        }
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
    // Baca nama tamu dari URL parameter segera saat halaman dimuat
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameEncoded = urlParams.get('to');
    if (guestNameEncoded) {
        const guestEl = document.getElementById('guest-name');
        if (guestEl) {
            try {
                // Decode Base64 -> nama tamu asli
                guestEl.innerText = decodeURIComponent(atob(guestNameEncoded));
            } catch (e) {
                // Fallback: jika bukan Base64 valid, tampilkan apa adanya
                guestEl.innerText = decodeURIComponent(guestNameEncoded);
            }
        }
    }
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
                // Dynamic API Base: Use localhost if running locally, otherwise use production
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
                const API_BASE = isLocal
                    ? 'http://127.0.0.1:3000/api/public'
                    : 'https://data.gelaralam.id/api/public';

                console.log(`Using API Base: ${API_BASE}`);

                // Avatar warna berdasarkan huruf pertama nama
                const avatarColors = [
                    '#a85863', '#5e6ea8', '#5ea887', '#a8875e',
                    '#7a5ea8', '#a85e8e', '#5e8ea8', '#8ea85e'
                ];
                const getAvatarColor = (name) => {
                    const idx = name.charCodeAt(0) % avatarColors.length;
                    return avatarColors[idx];
                };
                const getInitials = (name) => {
                    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                };

                // Waktu relatif
                const timeAgo = (dateStr) => {
                    if (!dateStr) return '';
                    const date = new Date(dateStr);
                    const seconds = Math.floor((Date.now() - date) / 1000);
                    if (seconds < 60) return 'baru saja';
                    const minutes = Math.floor(seconds / 60);
                    if (minutes < 60) return `${minutes} menit lalu`;
                    const hours = Math.floor(minutes / 60);
                    if (hours < 24) return `${hours} jam lalu`;
                    const days = Math.floor(hours / 24);
                    return `${days} hari lalu`;
                };

                // Load existing RSVPs
                const loadRSVPs = async () => {
                    // Tampilkan loading spinner
                    rsvpList.innerHTML = `
                        <div class="rsvp-loading">
                            <div class="rsvp-spinner"></div>
                            <span>Memuat ucapan & doa...</span>
                        </div>`;
                    try {
                        const res = await fetch(`${API_BASE}/rsvp`);
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        const data = await res.json();

                        // Update counter
                        const items = Array.isArray(data) ? data : [];
                        const countHadir = items.filter(i => i.presence === 'Hadir').length;
                        const countTidak = items.filter(i => i.presence === 'Tidak Hadir').length;
                        if (document.getElementById('count-hadir')) document.getElementById('count-hadir').textContent = countHadir;
                        if (document.getElementById('count-tidak')) document.getElementById('count-tidak').textContent = countTidak;

                        rsvpList.innerHTML = '';

                        if (data && data.length > 0) {
                            // Urutkan: terbaru di atas
                            const sorted = [...data].sort((a, b) =>
                                new Date(b.created_at) - new Date(a.created_at)
                            );
                            sorted.forEach((item, i) => {
                                const entry = document.createElement('div');
                                entry.className = 'rsvp-entry';
                                entry.style.animationDelay = `${i * 60}ms`;

                                const isHadir = (item.presence || '').toLowerCase().includes('tidak') ? false : true;
                                const statusClass = isHadir ? 'hadir' : 'tidak-hadir';
                                const statusIcon = isHadir ? '✅' : '❌';
                                const color = getAvatarColor(item.name || 'A');
                                const initials = getInitials(item.name || '?');
                                const ago = timeAgo(item.created_at);
                                const msg = (item.message || '').trim();

                                // Constructing the entry safely
                                const avatar = document.createElement('div');
                                avatar.className = 'entry-avatar';
                                avatar.style.background = color;
                                avatar.textContent = initials;
                                entry.appendChild(avatar);

                                const body = document.createElement('div');
                                body.className = 'entry-body';

                                const header = document.createElement('div');
                                header.className = 'entry-header';

                                const nameSpan = document.createElement('span');
                                nameSpan.className = 'entry-name';
                                nameSpan.textContent = item.name;
                                header.appendChild(nameSpan);

                                const statusSpan = document.createElement('span');
                                statusSpan.className = `entry-status ${statusClass}`;
                                statusSpan.textContent = `${statusIcon} ${item.presence}`;
                                header.appendChild(statusSpan);

                                body.appendChild(header);

                                if (msg) {
                                    const messageDiv = document.createElement('div');
                                    messageDiv.className = 'entry-message';
                                    messageDiv.textContent = '💬 ';

                                    // Handle line breaks safely
                                    const lines = msg.split('\n');
                                    lines.forEach((line, index) => {
                                        messageDiv.appendChild(document.createTextNode(line));
                                        if (index < lines.length - 1) {
                                            messageDiv.appendChild(document.createElement('br'));
                                        }
                                    });
                                    body.appendChild(messageDiv);
                                }

                                if (ago) {
                                    const timeDiv = document.createElement('div');
                                    timeDiv.className = 'entry-time';
                                    timeDiv.textContent = ago;
                                    body.appendChild(timeDiv);
                                }

                                entry.appendChild(body);
                                rsvpList.appendChild(entry);
                            });
                        } else {
                            rsvpList.innerHTML = `
                                <div class="rsvp-empty">
                                    <div style="font-size:2.5rem">🤲</div>
                                    <p>Belum ada konfirmasi. Jadilah yang pertama!</p>
                                </div>`;
                        }
                    } catch (err) {
                        console.error('Failed to load RSVPs:', err);
                        rsvpList.innerHTML = `
                            <div class="rsvp-empty">
                                <div style="font-size:2rem">⚠️</div>
                                <p style="color:#c0392b">Gagal memuat data. Periksa koneksi internet.</p>
                            </div>`;
                    }
                };

                loadRSVPs();

                rsvpForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const name = document.getElementById('rsvp-name').value.trim();
                    const message = document.getElementById('rsvp-message').value.trim() || '';
                    const presence = document.getElementById('rsvp-presence').value;
                    const submitBtn = rsvpForm.querySelector('button[type="submit"]');

                    if (!name) { alert('Nama tidak boleh kosong.'); return; }
                    if (!presence) { alert('Pilih konfirmasi kehadiran terlebih dahulu.'); return; }

                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Mengirim...';

                    try {
                        const res = await fetch(`${API_BASE}/rsvp`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, message, presence })
                        });

                        if (res.ok) {
                            rsvpForm.reset();
                            // Reset select ke default
                            document.getElementById('rsvp-presence').selectedIndex = 0;
                            // Tampilkan pesan sukses inline
                            const successMsg = document.createElement('div');
                            successMsg.className = 'rsvp-success-msg';
                            successMsg.textContent = '🎉 Terima kasih! Konfirmasi kehadiran Anda telah diterima.';
                            rsvpForm.parentNode.insertBefore(successMsg, rsvpForm.nextSibling);
                            setTimeout(() => successMsg.remove(), 4000);
                            loadRSVPs(); // Refresh the list
                        } else {
                            const body = await res.json().catch(() => ({}));
                            alert(body.message || 'Maaf, ada masalah. Silakan coba lagi.');
                        }
                    } catch (err) {
                        alert('Gagal mengirim. Periksa koneksi internet Anda.');
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Kirim';
                    }
                });
            }

            // Share Modal Logic
            const navShare = document.getElementById('nav-share');
            const shareModal = document.getElementById('share-modal');
            const modalClose = document.querySelector('.modal-close');
            const btnShareWA = document.getElementById('btn-share-whatsapp');

            if (navShare && shareModal && modalClose) {
                navShare.addEventListener('click', () => {
                    shareModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                });

                modalClose.addEventListener('click', () => {
                    shareModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                });

                window.addEventListener('click', (e) => {
                    if (e.target === shareModal) {
                        shareModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                });
            }

            if (btnShareWA) {
                btnShareWA.addEventListener('click', () => {
                    const guestName = document.getElementById('share-guest-name').value || 'Nama Tamu';
                    // Encode nama tamu ke Base64 agar tidak mudah diedit di URL
                    const encodedName = btoa(encodeURIComponent(guestName));
                    const currentUrl = window.location.origin + window.location.pathname;
                    const inviteLink = `${currentUrl}?to=${encodedName}`;

                    const message = `Yth. Bapak/Ibu/Saudara/i
*${guestName}*
Di Tempat
---------------------------
_Assalamualaikum Wr. Wb._
Dengan segala kerendahan hati,
kami mengundang Bapak/Ibu/Saudara/i dan teman-teman untuk menghadiri acara Syukuran Khitanan,
=============
*Line Pasifik Antarbakti*
=============
*♥️Save The Date♥️*
----------------
_Pada_
📅 Tanggal : *11-12 April 2026*
🕘 Pukul : *10:00 s/d Selesai*
_Tempat_ 
🏠 *Kasepuhan Gelaralam*
-----------------
Untuk detail acaranya, bisa kunjungi link berikut.👇

${inviteLink}

Kami sangat berharap Bapak/Ibu/Saudara/i dan teman-teman dapat menghadiri acara tersebut,
--------------------------------
Wassalamualaikum Wr. Wb,
🙏 Hormat Kami,
*Keluarga Abah Ugi Sugriana Rakasiwi*`;

                    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
                    window.open(waUrl, '_blank');
                });
            }

            // SHARE BUTTON SECURITY
            const isAdmin = urlParams.get('admin') === 'kasepuhan';

            // Set initial state: Hide share unless secret admin key is present
            if (navShare) {
                if (isAdmin) {
                    navShare.style.display = 'flex'; // Show for admin
                } else {
                    navShare.style.display = 'none'; // Hide for everyone else
                }
            }
        });
    }
});
