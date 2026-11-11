import Image from 'next/image';
import { withAlpha } from '@/lib/palette';

type Props = {
  src: string | null;
  alt: string;
  /** Shown on the striped placeholder when no image is set */
  label: string;
  tint: string;
  sizes?: string;
};

/** Fills its (relative) parent with an image, or a branded striped placeholder. */
export function Media({ src, alt, label, tint, sizes = '(min-width: 1024px) 400px, 100vw' }: Props) {
  if (src) return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />;
  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 flex items-end p-4"
      style={{
        backgroundImage: `radial-gradient(90% 90% at 70% 10%, ${withAlpha(tint, 0.35)}, transparent 60%), repeating-linear-gradient(135deg, #17143a 0 10px, #141136 10px 20px)`,
      }}
    >
      <span className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">{label}</span>
    </div>
  );
}
