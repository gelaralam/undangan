export const initCountdown = (targetDate) => {
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
                <div class="timer-item"><span>${days}</span>Hari</div>
                <div class="timer-item"><span>${hours}</span>Jam</div>
                <div class="timer-item"><span>${minutes}</span>Menit</div>
                <div class="timer-item"><span>${seconds}</span>Detik</div>
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
