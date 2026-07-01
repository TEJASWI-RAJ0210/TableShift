export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-[1200px] px-6 py-12 text-sm text-body">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-muted">
            TableShift — every conversion runs in your browser. Nothing is uploaded.
          </p>
          <p className="text-muted-soft">© {new Date().getFullYear()} TableShift</p>
        </div>
      </div>
    </footer>
  );
}