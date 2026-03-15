import { useEffect, useRef } from 'react';

import type { VisualGalloProps } from '@/types/ui';

export function VisualGallo({ type, color, isRight }: VisualGalloProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSvg = async () => {
      try {
        // Aquí usa la ruta definitiva a public/
        const res = await fetch(`/gallo_${type}.svg`);
        if (!res.ok) throw new Error('SVG no encontrado');
        const text = await res.text();

        if (!isMounted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgEl = doc.documentElement;

        if (svgEl.tagName.toLowerCase() === 'svg') {
          if (color) {
            const f2 = svgEl.querySelector('#Feather2');
            if (f2)
              f2.querySelectorAll('path').forEach((p) =>
                p.setAttribute('fill', color),
              );
          }
          svgEl.setAttribute('width', '100%');
          svgEl.setAttribute('height', '100%');
          if (isRight) svgEl.classList.add('flip-horizontal');

          if (containerRef.current) {
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(svgEl);
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
          'Fallo carga SVG. Asegúrate de servir desde un host local y que la ruta sea correcta.',
          e,
        );
      }
    };
    void loadSvg();
    return () => {
      isMounted = false;
    };
  }, [type, color, isRight]);

  return <div className='visual-gallo-container' ref={containerRef}></div>;
}
