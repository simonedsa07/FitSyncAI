'use client';

export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      {/* Blob 1: Sunset Coral (#E8734A) */}
      <div
        className="absolute h-96 w-96 rounded-full animate-blob-1"
        style={{
          background: '#E8734A',
          filter: 'blur(95px)',
          opacity: 'var(--blob-opacity-1, 0.18)',
          top: '-10%',
          left: '-10%',
          willChange: 'transform',
        }}
      />
      {/* Blob 2: Dreamy Lavender (#9B8CF0) */}
      <div
        className="absolute h-[420px] w-[420px] rounded-full animate-blob-2"
        style={{
          background: '#9B8CF0',
          filter: 'blur(100px)',
          opacity: 'var(--blob-opacity-2, 0.15)',
          top: '40%',
          right: '-15%',
          willChange: 'transform',
        }}
      />
      {/* Blob 3: Mint Spark (#2BB893) */}
      <div
        className="absolute h-80 w-80 rounded-full animate-blob-3"
        style={{
          background: '#2BB893',
          filter: 'blur(80px)',
          opacity: 'var(--blob-opacity-3, 0.12)',
          bottom: '-10%',
          left: '25%',
          willChange: 'transform',
        }}
      />
    </div>
  );
}