import { useEffect, useState } from 'react';

/** Retorna o id da seção que ocupa o centro da viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>('');
  const key = ids.join('|');

  useEffect(() => {
    const els = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.4) setActive('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [key]);

  return active;
}
