// Self-contained video player; no additional loading bar overlay.
// The loading bar and fade are baked into background.mp4.
(() => {
  'use strict';
  const video = document.getElementById('background');
  if (!video) return;
  video.muted = true;
  video.playsInline = true;
  video.loop = false;
  const start = () => {
    const result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => { /* poster remains visible if autoplay is blocked */ });
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
