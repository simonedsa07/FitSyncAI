export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-force-light className="min-h-screen bg-page">
      {children}
    </div>
  );
}