import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
  <rect width='400' height='400' fill='#0a0a0a'/>
  <g fill='none' stroke='#e30613' stroke-width='2' opacity='0.6'>
    <path d='M180 80 L180 240 Q180 290 130 290 Q80 290 80 250 Q80 210 130 210 Q180 210 180 240'/>
    <path d='M180 80 L220 60 L240 80 L220 100 L180 100'/>
    <line x1='200' y1='100' x2='200' y2='240'/>
  </g>
  <text x='200' y='350' text-anchor='middle' fill='#737373' font-family='monospace' font-size='12' letter-spacing='2'>NO IMAGE</text>
</svg>
  `);

export default function ProductImage({ src, alt, className = '' }: Props) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored || !src ? PLACEHOLDER : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
