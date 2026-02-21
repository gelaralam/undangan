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
            audio.play();
            icon.innerText = '🎵';
        }
        isPlaying = !isPlaying;
    };

    musicBtn.addEventListener('click', toggleMusic);

    return { toggleMusic };
};
