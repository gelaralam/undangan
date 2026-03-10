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

            // Dynamic API Base: Use localhost if running locally, otherwise use production
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
            const API_BASE = isLocal
                ? 'http://127.0.0.1:3000/api/public'
                : 'https://data.gelaralam.id/api/public';

            console.log(`Using API Base: ${API_BASE}`);

            // Init Components
            const targetDate = new Date("April 9, 2026 10:00:00 GMT+0700").getTime();
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

                                // Add Delete Button for Admin
                                if (isAdmin) {
                                    const deleteBtn = document.createElement('button');
                                    deleteBtn.className = 'entry-delete-btn';
                                    deleteBtn.innerHTML = '🗑️';
                                    deleteBtn.title = 'Hapus Komentar';
                                    deleteBtn.onclick = async () => {
                                        if (confirm(`Hapus komentar dari "${item.name}"?`)) {
                                            try {
                                                const res = await fetch(`${API_BASE}/rsvp/${item.id}`, {
                                                    method: 'DELETE',
                                                    headers: { 'X-Secret-Key': 'kasepuhan' }
                                                });
                                                if (res.ok) {
                                                    entry.style.opacity = '0';
                                                    entry.style.transform = 'translateX(20px)';
                                                    setTimeout(() => {
                                                        entry.remove();
                                                        loadRSVPs(); // Refresh to update counts
                                                    }, 3000);
                                                } else {
                                                    alert('Gagal menghapus komentar.');
                                                }
                                            } catch (err) {
                                                console.error('Delete error:', err);
                                                alert('Gagal menghapus. Periksa koneksi.');
                                            }
                                        }
                                    };
                                    header.appendChild(deleteBtn);
                                }

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

                    // Load remembered admin name
                    const savedAdmin = localStorage.getItem('invitation_admin_name');
                    const adminInput = document.getElementById('share-admin-name');
                    if (savedAdmin && adminInput && !adminInput.value) {
                        adminInput.value = savedAdmin;
                    }
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

                // Tab Switching Logic
                const tabBtns = document.querySelectorAll('.tab-btn');
                const tabPanes = document.querySelectorAll('.tab-pane');

                tabBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const target = btn.getAttribute('data-tab');

                        tabBtns.forEach(b => b.classList.remove('active'));
                        tabPanes.forEach(p => p.classList.remove('active'));

                        btn.classList.add('active');
                        document.getElementById(target).classList.add('active');

                        if (target === 'tab-history') {
                            renderHistory();
                        }
                    });
                });
            }

            // --- History Logic ---
            const saveToHistory = async (guestName, phone) => {
                const adminNameInput = document.getElementById('share-admin-name');
                const adminName = adminNameInput.value.trim() || 'Admin';

                // Remember admin name for next time
                localStorage.setItem('invitation_admin_name', adminName);

                try {
                    await fetch(`${API_BASE}/invitation-log`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            guest_name: guestName,
                            guest_phone: phone || '',
                            admin_name: adminName
                        })
                    });
                } catch (err) {
                    console.error('Failed to save history to backend:', err);
                }
            };

            const renderHistory = async () => {
                const historyList = document.getElementById('delivery-history-list');
                if (!historyList) return;

                historyList.innerHTML = '<div class="rsvp-loading"><div class="rsvp-spinner"></div><span>Memuat riwayat...</span></div>';

                // Check for legacy local data to migrate
                const localData = JSON.parse(localStorage.getItem('delivery_history') || '[]');

                try {
                    const res = await fetch(`${API_BASE}/invitation-log`, {
                        headers: { 'X-Secret-Key': 'kasepuhan' }
                    });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const history = await res.json();

                    historyList.innerHTML = '';

                    // If local data exists, show migration prompt
                    if (localData.length > 0) {
                        const migrationBanner = document.createElement('div');
                        migrationBanner.className = 'rsvp-empty';
                        migrationBanner.style.background = 'rgba(243, 156, 18, 0.1)';
                        migrationBanner.style.border = '1px dashed #f39c12';
                        migrationBanner.style.marginBottom = '15px';
                        migrationBanner.style.padding = '15px';
                        migrationBanner.innerHTML = `
                            <p style="color: #d35400; margin-bottom: 10px;">
                                <strong>⚠️ Ditemukan ${localData.length} data lama</strong> di perangkat ini yang belum tersimpan di database pusat.
                            </p>
                            <button id="btn-migrate-history" class="tab-btn active" style="padding: 8px 15px; background: #f39c12;">
                                📥 Migrasi Data Sekarang
                            </button>
                        `;
                        historyList.appendChild(migrationBanner);

                        const btnMigrate = migrationBanner.querySelector('#btn-migrate-history');
                        btnMigrate.addEventListener('click', async () => {
                            btnMigrate.disabled = true;
                            btnMigrate.innerText = 'Memindahkan...';

                            let successCount = 0;
                            const adminName = localStorage.getItem('invitation_admin_name') || 'Admin';

                            for (const item of localData) {
                                try {
                                    const mRes = await fetch(`${API_BASE}/invitation-log`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            guest_name: item.name,
                                            guest_phone: item.phone === 'Tanpa No' ? '' : item.phone,
                                            admin_name: adminName
                                        })
                                    });
                                    if (mRes.ok) successCount++;
                                } catch (e) {
                                    console.error('Migration failed for item:', item, e);
                                }
                            }

                            if (successCount > 0) {
                                localStorage.removeItem('delivery_history');
                                alert(`🎉 Berhasil memindahkan ${successCount} data ke database pusat!`);
                                renderHistory(); // Refresh
                            } else {
                                alert('Maaf, migrasi gagal. Silakan coba lagi nanti.');
                                btnMigrate.disabled = false;
                                btnMigrate.innerText = '📥 Migrasi Data Sekarang';
                            }
                        });
                    }

                    if (!history || history.length === 0) {
                        if (localData.length === 0) {
                            historyList.innerHTML = '<div class="rsvp-empty"><p>Belum ada riwayat pengiriman.</p></div>';
                        }
                        return;
                    }

                    const totalItems = history.length;
                    history.forEach((item, index) => {
                        const date = new Date(item.created_at);
                        const timeStr = date.toLocaleString('id-ID', {
                            day: '2-digit', month: 'short',
                            hour: '2-digit', minute: '2-digit'
                        });

                        const sequenceNumber = totalItems - index;

                        const div = document.createElement('div');
                        div.className = 'bulk-guest-item';
                        div.innerHTML = `
                            <div class="guest-number" style="min-width: 30px; font-weight: bold; color: #f39c12; border-right: 1px solid #eee; margin-right: 12px; display: flex; align-items: center;">
                                #${sequenceNumber}
                            </div>
                            <div class="guest-info">
                                <span class="guest-name">${item.guest_name}</span>
                                <span class="guest-phone">${item.guest_phone || 'Tanpa No'}</span>
                                <div style="display: flex; gap: 8px; font-size: 0.8rem; color: #7f8c8d; margin-top: 4px;">
                                    <span>Oleh: <strong>${item.admin_name}</strong></span>
                                    <span>• ${timeStr}</span>
                                </div>
                            </div>
                            <div class="guest-actions">
                                <span class="sent-badge">Terkirim ✅</span>
                            </div>
                        `;
                        historyList.appendChild(div);
                    });
                } catch (err) {
                    console.error('Failed to fetch history:', err);
                    historyList.innerHTML = '<div class="rsvp-empty"><p style="color:#c0392b">Gagal memuat riwayat.</p></div>';
                }
            };


            if (btnShareWA) {
                // Fancy Text Converter: A-Z, a-z to Mathematical Script (Unicode)
                const convertToFancyText = (text) => {
                    if (!text) return '';
                    const scripts = {
                        'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
                        'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
                    };
                    return text.split('').map(char => scripts[char] || char).join('');
                };

                const generateWAMessage = (guestNameInput) => {
                    // Encode nama tamu ke Base64 agar tidak mudah diedit di URL
                    const encodedName = btoa(encodeURIComponent(guestNameInput));
                    const currentUrl = window.location.origin + window.location.pathname;
                    const inviteLink = `${currentUrl}?to=${encodedName}`;

                    return `Yth. Bapak/Ibu/Saudara/i
*${guestNameInput}*
Di Tempat
---------------------------
${convertToFancyText("Assalamu'alaikum Wr. Wb.")}
${convertToFancyText('Sampurasun!')}
${convertToFancyText('Dengan segala kerendahan hati,')}
${convertToFancyText('kami mengundang Bapak/Ibu/Saudara/i')}
${convertToFancyText('dan teman-teman untuk menghadiri acara')}
${convertToFancyText('Syukuran Khitanan,')}
=============
*Line Pasifik Antar Bakti*
=============
*❤️${convertToFancyText('Save The Date')}❤️*
----------------
${convertToFancyText('Pada')}
📅 Tanggal : *11 ${convertToFancyText('April')} 2026*
🕘 Pukul : *10:00 s/d Selesai*
${convertToFancyText('Tempat')}
🏠 *${convertToFancyText('Kasepuhan Gelaralam')}*
-----------------
${convertToFancyText('Untuk detail acaranya, bisa kunjungi link')}
${convertToFancyText('berikut. 👇')}

${inviteLink}

${convertToFancyText('Kami sangat berharap Bapak/Ibu/Saudara/i')}
${convertToFancyText('dan teman-teman dapat menghadiri acara')}
${convertToFancyText('tersebut,')}
--------------------------------
${convertToFancyText('Wassalamualaikum Wr. Wb,')}
${convertToFancyText('Rampés!')}
🙏 ${convertToFancyText('Hormat Kami,')}
*${convertToFancyText('Keluarga Abah Ugi Sugriana R')}*`;
                };

                btnShareWA.addEventListener('click', () => {
                    const guestNameInput = document.getElementById('share-guest-name').value || 'Nama Tamu';
                    const message = generateWAMessage(guestNameInput);
                    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
                    window.open(waUrl, '_blank');
                    saveToHistory(guestNameInput, '');
                });

                // --- Bulk Import Logic ---
                const btnImport = document.getElementById('btn-import-csv');
                const csvInput = document.getElementById('csv-file-input');
                const bulkList = document.getElementById('bulk-guest-list');

                if (btnImport && csvInput && bulkList) {
                    btnImport.addEventListener('click', () => csvInput.click());

                    csvInput.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const csvData = event.target.result;
                            const rows = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
                            bulkList.innerHTML = ''; // Clear previous

                            if (rows.length === 0) return;

                            // Detect separator: check first line for ; or ,
                            const firstLine = rows[0];
                            const separator = firstLine.includes(';') ? ';' : ',';

                            // Determine if first row is a header
                            let startIdx = 0;
                            const headerLower = firstLine.toLowerCase();
                            if (headerLower.includes('nama') || headerLower.includes('whatsapp') || headerLower.includes('phone') || headerLower.includes('no')) {
                                startIdx = 1;
                            }

                            rows.slice(startIdx).forEach((line, index) => {
                                const parts = line.split(separator).map(p => p.trim());
                                const name = parts[0];
                                const phone = parts[1] || '';

                                if (name) {
                                    const item = document.createElement('div');
                                    item.className = 'bulk-guest-item';
                                    item.id = `guest-item-${index}`;
                                    item.innerHTML = `
                                        <div class="guest-info">
                                            <span class="guest-name">${name}</span>
                                            <span class="guest-phone">${phone || 'Tanpa No'}</span>
                                        </div>
                                        <div class="guest-actions">
                                            <span class="sent-badge hidden">Terkirim ✅</span>
                                            <button class="btn-share-mini">Bagikan</button>
                                        </div>
                                    `;

                                    const btnMini = item.querySelector('.btn-share-mini');
                                    const badge = item.querySelector('.sent-badge');

                                    btnMini.addEventListener('click', () => {
                                        const msg = generateWAMessage(name);
                                        const cleanPhone = phone.replace(/[^0-9]/g, '');
                                        const waUrl = cleanPhone
                                            ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`
                                            : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

                                        window.open(waUrl, '_blank');

                                        // Mark as sent
                                        item.classList.add('sent');
                                        badge.classList.remove('hidden');
                                        btnMini.innerText = 'Kirim Ulang';

                                        // Save to history
                                        saveToHistory(name, phone);

                                        // Strategic "Next Guest" logic
                                        const nextItem = document.getElementById(`guest-item-${index + 1}`);
                                        if (nextItem) {
                                            // Scroll next item into view and highlight it
                                            nextItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            nextItem.classList.add('highlight-next');
                                            setTimeout(() => nextItem.classList.remove('highlight-next'), 2000);
                                        }
                                    });

                                    bulkList.appendChild(item);
                                }
                            });
                        };
                        reader.readAsText(file);
                    });
                }
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
