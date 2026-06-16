import { cn } from '@/lib/utils';

/** HUD-style animated border wrapper - 2050 holographic frame */
export function UltraFrame({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={cn('ultra-frame', className)}>
      <div className={cn('ultra-frame-inner hud-corners', innerClassName)}>{children}</div>
    </div>
  );
}
