'use client';

export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      {/* Blob 1 */}
      <div
        className="absolute h-[600px] w-[600px] animate-blob-1"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 60%)',
          opacity: 'var(--blob-opacity-1, 0.18)',
          top: '-15%',
          left: '-15%',
          willChange: 'transform',
        }}
      />
      {/* Blob 2 */}
      <div
        className="absolute h-[700px] w-[700px] animate-blob-2"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 60%)',
          opacity: 'var(--blob-opacity-2, 0.15)',
          top: '30%',
          right: '-20%',
          willChange: 'transform',
        }}
      />
      {/* Blob 3 */}
      <div
        className="absolute h-[500px] w-[500px] animate-blob-3"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 60%)',
          opacity: 'var(--blob-opacity-3, 0.12)',
          bottom: '-15%',
          left: '15%',
          willChange: 'transform',
        }}
      />
    </div>
  );
}