export function AmbientGlow() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 -left-40 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-40 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]"
      />
    </>
  );
}
