import confetti from 'canvas-confetti';

export function celebrate() {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#F6A8C8';

  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 35,
    origin: { y: 0.7 },
    colors: [accent, '#14121A', '#ffffff'],
    scalar: 0.9,
  });
}