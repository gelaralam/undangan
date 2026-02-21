export const initMusic = () => {
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    let isPlaying = false;

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
