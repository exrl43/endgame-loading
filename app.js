const video = document.getElementById('bg');
const fill = document.getElementById('fill');
const percent = document.getElementById('percent');
const status = document.getElementById('status');

const FALLBACK_DURATION = 4.0;

function update() {
  const duration = Number.isFinite(video.duration) && video.duration > 0
    ? video.duration
    : FALLBACK_DURATION;

  const current = Math.min(video.currentTime || 0, duration);
  const progress = Math.max(0, Math.min(1, current / duration));
  const p = Math.round(progress * 100);

  fill.style.width = p + '%';
  percent.textContent = p + '%';

  if (p < 25) status.textContent = 'INITIALIZING';
  else if (p < 55) status.textContent = 'LOADING MODULES';
  else if (p < 85) status.textContent = 'PREPARING INTERFACE';
  else status.textContent = 'READY';

  if (p >= 99) document.body.classList.add('ready');

  requestAnimationFrame(update);
}

video.addEventListener('ended', () => {
  fill.style.width = '100%';
  percent.textContent = '100%';
  status.textContent = 'READY';
  document.body.classList.add('ready');
});

video.play().catch(() => {});
requestAnimationFrame(update);
