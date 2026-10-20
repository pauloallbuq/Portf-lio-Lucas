import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { MaskLines, Reveal } from './Reveal';
import { about, timeline } from '../content';
import { playShutter } from '../hooks/useSound';

/**
 * Linha do tempo vertical: a linha azul acompanha a rolagem e os marcadores acendem ao passar.
 * Clicar numa etapa (ou usar ↑/↓ e os botões) "fotografa" a etapa: obturador + flash + conteúdo.
 */
export function Timeline() {
  const [active, setActive] = useState(0);
  const [lit, setLit] = useState(0); // quantos marcadores já acenderam pela rolagem
  const [shot, setShot] = useState(0);
  const reduce = useReducedMotion();
  const list = useRef<HTMLOListElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const n = timeline.length;

  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // acende marcadores conforme a rolagem (sem som: som só com clique)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = Number((e.target as HTMLElement).dataset.i);
          if (e.isIntersecting) setLit((l) => Math.max(l, i + 1));
        });
      },
      { rootMargin: '0px 0px -40% 0px' },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const select = (i: number, focus = false) => {
    const k = Math.max(0, Math.min(n - 1, i));
    setActive(k);
    setLit((l) => Math.max(l, k + 1));
    setShot((s) => s + 1);
    playShutter();
    if (focus) btns.current[k]?.focus({ preventScroll: true });
    items.current[k]?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section className="section trajectory" id="trajetoria" aria-labelledby="trajetoria-title">
      <div className="section-head">
        <p className="section-num">(02)</p>
        <h2 id="trajetoria-title" className="section-title">
          <MaskLines lines={['Linha do', <em key="t">tempo</em>]} />
        </h2>
        <Reveal className="section-aside" delay={0.2}>
          <p>Role para acender cada etapa ou clique nos marcadores. Use ↑ e ↓ no teclado.</p>
        </Reveal>
      </div>

      <div className="vtl">
        <div className="vtl-nav" role="group" aria-label="Navegar pelas etapas">
          <button onClick={() => select(active - 1, true)} disabled={active === 0} aria-label="Etapa anterior">
            ↑
          </button>
          <p aria-live="polite">
            <strong>{String(active + 1).padStart(2, '0')}</strong>/{String(n).padStart(2, '0')}
          </p>
          <button onClick={() => select(active + 1, true)} disabled={active === n - 1} aria-label="Próxima etapa">
            ↓
          </button>
        </div>

        <ol className="vtl-list" ref={list}>
          <span className="vtl-rail" aria-hidden="true">
            <motion.span style={{ scaleY: reduce ? 1 : fill }} />
          </span>
          {timeline.map((t, i) => {
            const isActive = i === active;
            return (
              <li
                key={t.mark + t.title}
                data-i={i}
                ref={(el) => {
                  items.current[i] = el;
                }}
                className={`vtl-item ${i < lit ? 'is-lit' : ''} ${isActive ? 'is-active' : ''}`}
              >
                <button
                  ref={(el) => {
                    btns.current[i] = el;
                  }}
                  className="vtl-mark"
                  aria-expanded={isActive}
                  aria-controls={`vtl-body-${i}`}
                  onClick={() => select(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      select(i + 1, true);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      select(i - 1, true);
                    }
                  }}
                >
                  <span className="vtl-dot" aria-hidden="true" />
                  <span className="vtl-step">Etapa {String(i + 1).padStart(2, '0')}</span>
                  <span className="vtl-label">{t.mark}</span>
                  <span className="vtl-title">{t.title}</span>
                </button>
                <div className="vtl-card" id={`vtl-body-${i}`}>
                  {isActive && !reduce && <span key={shot} className="tl-flash" aria-hidden="true" />}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        className="vtl-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="tl-place">{t.place}</p>
                        <p className="tl-text">{t.text}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="education">
        <Reveal>
          <h3 className="subhead">Formação</h3>
        </Reveal>
        <ul>
          {about.credentials.map((c, i) => (
            <Reveal as="li" key={c.label} delay={i * 0.06}>
              <p>{c.value}</p>
              <span>{c.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
