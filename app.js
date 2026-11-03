/* ENDGAME loading screen: one video, no duplicate progress-bar overlay.
   The loading bar and 0X art are animated inside background.mp4. */
(() => {
  'use strict';
  const video = document.getElementById('background');
  if (!video) return;

  video.muted = true;
  video.playsInline = true;
  video.loop = false;

  function playVideo() {
    if (video.ended) return;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        // Playback restrictions or loading errors leave the page visible.
        // The browser's muted-autoplay permission determines whether it can start.
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', playVideo, { once: true });
  } else {
    playVideo();
  }
  video.addEventListener('canplay', playVideo, { once: true });
})();
