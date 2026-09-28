export function LoadingSpinner() {
  return (
    <div className="flex h-32 w-full items-center justify-center">
      <span
        className="
          h-6 w-6
          animate-spin
          rounded-full
          border-2
          border-[#171d25]
          border-t-[#1a9fff]
        "
        aria-label="Carregando"
      />
    </div>
  );
}
