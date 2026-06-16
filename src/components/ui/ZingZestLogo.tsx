import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BRAND_LOGO } from '@/lib/data/zz';

const VARIANTS = {
  splash: { width: 300, height: 163, className: 'rounded-2xl glow-pulse' },
  hero: { width: 240, height: 131, className: 'rounded-2xl animate-float glow-pulse' },
  sidebar: { width: 148, height: 81, className: 'rounded-xl' },
  compact: { width: 120, height: 65, className: 'rounded-lg' },
} as const;

type LogoVariant = keyof typeof VARIANTS;

export function ZingZestLogo({
  variant = 'hero',
  className,
  priority,
}: {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}) {
  const { width, height, className: variantClass } = VARIANTS[variant];

  return (
    <Image
      src={BRAND_LOGO}
      alt="Zing & Zest Street Bites - Fresh. Fast. Full of Flavor."
      width={width}
      height={height}
      priority={priority}
      className={cn('object-contain', variantClass, className)}
    />
  );
}
