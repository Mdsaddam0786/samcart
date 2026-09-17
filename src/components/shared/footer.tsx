export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500 sm:px-6">
        © {new Date().getFullYear()} SamCart. Built with Next.js.
      </div>
    </footer>
  );
}
