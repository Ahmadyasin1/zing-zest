'use client';

/** Fixed ambient background — animated orbs, grid, film grain */
export function AmbientLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <div className="ambient-grid absolute inset-0" />
      <div className="ambient-grain absolute inset-0" />
    </div>
  );
}
