export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="animate-float-slow absolute -left-40 top-[-10rem] h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-3xl" />
      <div className="animate-float-reverse absolute -right-32 top-[18rem] h-[30rem] w-[30rem] rounded-full bg-accent/25 blur-3xl" />
      <div className="animate-float-slow absolute bottom-[-12rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-secondary/50 blur-3xl" />
      <div
        className="animate-drift absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px), radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px, 56px 56px",
          backgroundPosition: "0 0, 28px 28px",
          color: "oklch(0.46 0.1 158 / 0.22)",
        }}
      />
    </div>
  );
}
