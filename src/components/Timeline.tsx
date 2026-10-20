import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MaskLines, Reveal } from './Reveal';
import { about, timeline } from '../content';
import { playShutter } from '../hooks/useSound';

/** Linha do tempo interativa: cada marcador "fotografa" a etapa (flash + som de obturador). */
export function Timeline() {
  const [active, setActive] = useState(timeline.length - 1);
  const [shot, setShot] = useState(0);
  const reduce = useReducedMotion();
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const item = timeline[active];

  const select = (i: number, focus = false) => {
    const n = (i + timeline.length) % timeline.length;
    setActive(n);
    setShot((s) => s + 1);
    playShutter();
    if (focus) btns.current[n]?.focus();
    btns.current[n]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section className="section trajectory" id="trajetoria" aria-labelledby="trajetoria-title">
      <div className="section-head">
        <p className="section-num">(04)</p>
        <h2 id="trajetoria-title" className="section-title">
          <MaskLines lines={['Linha do', <em key="t">tempo</em>]} />
        </h2>
        <Reveal className="section-aside" delay={0.2}>
          <p>Clique nos marcadores para percorrer a trajetória.</p>
        </Reveal>
      </div>

      <Reveal>
        <div className="tl-track" role="tablist" aria-label="Etapas da trajetória">
          <span className="tl-rail" aria-hidden="true">
            <span style={{ transform: `scaleX(${timeline.length > 1 ? active / (timeline.length - 1) : 1})` }} />
          </span>
          {timeline.map((t, i) => (
            <button
              key={t.mark + t.title}
              ref={(el) => {
                btns.current[i] = el;
              }}
              role="tab"
              id={`tl-tab-${i}`}
              aria-selected={i === active}
              aria-controls="tl-panel"
              tabIndex={i === active ? 0 : -1}
              className={`tl-mark ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
              onClick={() => select(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  select(active + 1, true);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  select(active - 1, true);
                }
              }}
            >
              <span className="tl-dot" aria-hidden="true" />
              <span className="tl-label">{t.mark}</span>
            </button>
          ))}
        </div>

        <div className="tl-panel" id="tl-panel" role="tabpanel" aria-labelledby={`tl-tab-${active}`} aria-live="polite">
          {!reduce && <span key={shot} className="tl-flash" aria-hidden="true" />}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="tl-content"
              initial={{ opacity: 0, y: reduce ? 0 : 16, filter: reduce ? 'none' : 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: reduce ? 0 : -10 }}
              transition={{ duration: reduce ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="tl-frame-num">
                {String(active + 1).padStart(2, '0')} / {String(timeline.length).padStart(2, '0')}
              </span>
              <p className="tl-big">{item.mark}</p>
              <div>
                <h3 className="tl-title">{item.title}</h3>
                <p className="tl-place">{item.place}</p>
                <p className="tl-text">{item.text}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

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
