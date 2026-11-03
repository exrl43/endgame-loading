// Simple self-contained background video player.
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
      result.catch(() => {});
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
