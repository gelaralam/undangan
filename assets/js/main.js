import { initCountdown } from './modules/countdown.js';
import { initMusic } from './modules/music.js';
import { initAnimations } from './modules/animations.js';

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('btn-open-invitation');
    const overlay = document.getElementById('overlay-door');
    const mainContent = document.getElementById('main-content');

    // Music Manager
    const music = initMusic();

    // Open Invitation Logic
    openBtn.addEventListener('click', () => {
        overlay.classList.add('open');
        mainContent.classList.remove('hidden');
        music.toggleMusic(); // Start music on open

        // Init Countdown after opening
        const weddingDate = new Date("March 15, 2026 09:00:00").getTime();
        initCountdown(weddingDate);

        // Init Animations
        initAnimations();
    });

    // Extract guest name from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        document.getElementById('guest-name').innerText = decodeURIComponent(guestName);
    }
});
