export function LogoMark({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="7" width="4" height="10" rx="1.3" fill="currentColor" />
      <rect x="19" y="7" width="4" height="10" rx="1.3" fill="currentColor" />
      <rect x="2.4" y="9.5" width="1.2" height="5" rx="0.6" fill="var(--accent)" />
      <rect x="20.4" y="9.5" width="1.2" height="5" rx="0.6" fill="var(--accent)" />
      <path
        d="M5 12 H9 L10.6 7.8 L13 16.2 L14.6 12 H19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}