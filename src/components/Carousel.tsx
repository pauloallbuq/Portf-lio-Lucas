import { useCallback, useEffect, useRef, useState } from 'react';
import { playClick, playOpen } from '../hooks/useSound';

export type Slide = {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  /** cartão de projeto: nome, categoria e descrição */
  name?: string;
  category?: string;
  description?: string;
};

type Props = {
  slides: Slide[];
  label: string;
  variant: 'portrait' | 'screen' | 'landscape';
  /** avanço automático em ms (0 = desligado). Pausa ao interagir, fora da tela e com movimento reduzido. */
  autoplay?: number;
};

/** Carrossel com scroll-snap (arraste/toque nativo), setas, teclado, contador e ampliação em tela cheia. */
export function Carousel({ slides, label, variant, autoplay = 0 }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const [end, setEnd] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const [hold, setHold] = useState(false); // hover/foco/toque
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false); // botão do visitante
  const [reduced, setReduced] = useState(false);

  // índice do slide mais próximo da borda esquerda
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const items = Array.from(el.children) as HTMLElement[];
        const left = el.scrollLeft;
        let best = 0;
        let dist = Infinity;
        items.forEach((it, i) => {
          const d = Math.abs(it.offsetLeft - el.offsetLeft - left);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        const isEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        if (isEnd) best = items.length - 1;
        setEnd(isEnd);
        setIndex(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = el.children.length;
    const target = el.children[Math.max(0, Math.min(n - 1, i))] as HTMLElement;
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    const el = root.current;
    const io = el ? new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 }) : null;
    if (el && io) io.observe(el);
    return () => {
      mq.removeEventListener('change', on);
      io?.disconnect();
    };
  }, []);

  const running = autoplay > 0 && slides.length > 1 && visible && !hold && !paused && !reduced && zoom === null;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      if (document.hidden) return;
      goTo(end || index >= slides.length - 1 ? 0 : index + 1);
    }, autoplay);
    return () => window.clearTimeout(t);
  }, [running, index, end, autoplay, slides.length, goTo]);

  // lightbox
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (zoom !== null && !d.open) {
      d.showModal();
      document.body.classList.add('no-scroll');
    }
  }, [zoom]);

  const open = (i: number) => {
    playOpen();
    setZoom(i);
  };
  const nav = (i: number) => {
    playClick();
    goTo(i);
  };

  const closeZoom = () => dialog.current?.close();
  const step = (dir: number) => {
    playClick();
    setZoomStep(dir);
  };
  const setZoomStep = (dir: number) => setZoom((z) => (z === null ? z : (z + dir + slides.length) % slides.length));

  return (
    <div
      ref={root}
      className={`carousel carousel-${variant}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHold(false)}
      onTouchStart={() => setHold(true)}
      onTouchEnd={() => window.setTimeout(() => setHold(false), 4000)}
    >
      <ul
        className="carousel-track"
        ref={track}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            nav(index + 1);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            nav(index - 1);
          }
        }}
      >
        {slides.map((s, i) => (
          <li key={s.src} className={`carousel-slide ${i === index ? 'is-current' : ''}`} aria-roledescription="slide" aria-label={`${i + 1} de ${slides.length}`}>
            <button className="carousel-media" onClick={() => open(i)} aria-label={`Ampliar: ${s.title ?? s.alt}`}>
              <img src={s.src} alt={s.alt} width={s.width} height={s.height} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
              <span className="carousel-zoom" aria-hidden="true">
                Ampliar ↗
              </span>
            </button>
            {s.name ? (
              <div className="work-card">
                <p className="work-cat">
                  <span>{String(i + 1).padStart(2, '0')}</span> {s.category}
                </p>
                <h3 className="work-name">{s.name}</h3>
                {s.description && <p className="work-desc">{s.description}</p>}
                <button className="work-open" onClick={() => open(i)}>
                  Ver projeto <span aria-hidden="true">↗</span>
                </button>
              </div>
            ) : s.title && (
              <p className="carousel-caption">
                <span>{String(i + 1).padStart(2, '0')}</span> {s.title}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="carousel-controls">
        <p className="carousel-count" aria-live="polite">
          <strong>{String(index + 1).padStart(2, '0')}</strong> / {String(slides.length).padStart(2, '0')}
        </p>
        <div className="carousel-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${(index + 1) / slides.length})` }} />
        </div>
        <div className="carousel-dots" role="group" aria-label="Ir para o slide">
          {slides.map((_, k) => (
            <button key={k} className={k === index ? 'is-active' : ''} aria-label={`Slide ${k + 1}`} aria-current={k === index || undefined} onClick={() => nav(k)} />
          ))}
        </div>
        <div className="carousel-arrows">
          {autoplay > 0 && !reduced && (
            <button
              onClick={() => setPaused((v) => !v)}
              aria-label={paused ? 'Retomar avanço automático' : 'Pausar avanço automático'}
              aria-pressed={paused}
              className="carousel-pause"
            >
              {paused ? '▶' : '❚❚'}
            </button>
          )}
          <button onClick={() => nav(index - 1)} disabled={index === 0} aria-label="Imagem anterior">
            ←
          </button>
          <button onClick={() => nav(index + 1)} disabled={index >= slides.length - 1 || end} aria-label="Próxima imagem">
            →
          </button>
        </div>
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${label} — imagem ampliada`}
        onClose={() => {
          document.body.classList.remove('no-scroll');
          if (zoom !== null) goTo(zoom);
          setZoom(null);
        }}
        onClick={(e) => e.target === dialog.current && closeZoom()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
      >
        {zoom !== null && (
          <>
            <img src={slides[zoom].src} alt={slides[zoom].alt} />
            {slides[zoom].description && <p className="lightbox-desc">{slides[zoom].description}</p>}
            <div className="lightbox-bar">
              <span>
                {String(zoom + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                {slides[zoom].title ? ` — ${slides[zoom].title}` : ''}
              </span>
              <div className="carousel-arrows">
                <button onClick={() => step(-1)} aria-label="Imagem anterior">
                  ←
                </button>
                <button onClick={() => step(1)} aria-label="Próxima imagem">
                  →
                </button>
                <button onClick={closeZoom} className="lightbox-close" aria-label="Fechar">
                  ✕
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
