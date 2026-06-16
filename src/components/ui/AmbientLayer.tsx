'use client';

/** Soft warm ambient - clean food-brand background */
export function AmbientLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl" />
    </div>
  );
}
