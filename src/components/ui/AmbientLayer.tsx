'use client';

export function AmbientLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Primary warm glow — top right */}
      <div className="ambient-orb ambient-1" />
      {/* Cool teal accent — bottom left */}
      <div className="ambient-orb ambient-2" />
      {/* Gold mid — center right */}
      <div className="ambient-orb ambient-3" />
      {/* Deep orange — top left edge */}
      <div className="ambient-orb ambient-4" />
    </div>
  );
}
