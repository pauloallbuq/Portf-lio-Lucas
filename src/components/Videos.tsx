import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { videoCategories, videos, type Video } from '../data/videos';
import { asset } from '../lib/asset';
import { playShutter } from '../hooks/useSound';
import { MaskLines, Reveal } from './Reveal';

function embedUrl(v: Video) {
  if (v.kind === 'instagram') return v.url.replace(/\/?(\?.*)?$/, '/') + 'embed/';
  if (v.kind === 'youtube') {
    const id = v.url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{6,})/)?.[1] ?? '';
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
  }
  return asset(v.url);
}

const sourceLabel = (v: Video) => (v.kind === 'instagram' ? 'Abrir no Instagram' : v.kind === 'youtube' ? 'Abrir no YouTube' : 'Abrir vídeo');

/**
 * Carrossel de vídeos em moldura de câmera analógica.
 * Só o vídeo selecionado fica carregado: trocar de vídeo desmonta/pausa o anterior,
 * então nunca há dois tocando ao mesmo tempo.
 */
export function Videos() {
  const [i, setI] = useState(0);
  const [engaged, setEngaged] = useState(false); // o visitante já pediu para assistir
  const videoEl = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const v = videos[i];
  const n = videos.length;

  const go = (to: number) => {
    videoEl.current?.pause();
    setI(((to % n) + n) % n);
  };

  // arquivo local: inicia o selecionado quando o visitante já interagiu (se o navegador permitir)
  useEffect(() => {
    const el = videoEl.current;
    if (!el || !engaged) return;
    el.play().catch(() => {
      /* bloqueado pelo navegador: o visitante usa os controles */
    });
  }, [i, engaged]);

  if (!n) return null;

  return (
    <section className="section audiovisual" id="audiovisual" aria-labelledby="audiovisual-title">
      <div className="section-head">
        <p className="section-num">(03)</p>
        <h2 id="audiovisual-title" className="section-title">
          <MaskLines lines={['Filmagem,', <em key="e">edição & motion</em>]} />
        </h2>
        <Reveal className="section-aside" delay={0.2}>
          <p>Trabalhos audiovisuais publicados. Selecione um rolo na película e dê play — um vídeo de cada vez.</p>
        </Reveal>
      </div>

      <Reveal>
        <div
          className="av"
          role="region"
          aria-roledescription="carrossel"
          aria-label="Vídeos"
          onKeyDown={(e) => {
            if ((e.target as HTMLElement).tagName === 'IFRAME') return;
            if (e.key === 'ArrowRight') go(i + 1);
            if (e.key === 'ArrowLeft') go(i - 1);
          }}
        >
          <div className="cam">
            <div className="cam-top" aria-hidden="true">
              <span className="cam-dial" />
              <span className="cam-brand">LC · 35</span>
              <span className="cam-counter">
                {String(i + 1).padStart(2, '0')}
                <small>/{String(n).padStart(2, '0')}</small>
              </span>
              <span className="cam-shutter" />
              <span className="cam-dial cam-dial-sm" />
            </div>
            <div className="cam-body">
              <span className="cam-perf" aria-hidden="true" />
              <div className="cam-gate">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={v.id + String(engaged)}
                    className="cam-screen"
                    initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {!engaged ? (
                      <button
                        className="cam-poster"
                        onClick={() => {
                          playShutter();
                          setEngaged(true);
                        }}
                        aria-label={`Assistir: ${v.title}`}
                      >
                        <img src={asset(v.poster)} alt="" loading="lazy" decoding="async" />
                        <span className="cam-play" aria-hidden="true">
                          ▶
                        </span>
                      </button>
                    ) : v.kind === 'file' ? (
                      <video ref={videoEl} src={embedUrl(v)} poster={asset(v.poster)} controls playsInline preload="metadata" />
                    ) : (
                      <iframe
                        src={embedUrl(v)}
                        title={`${v.title} — ${v.service}`}
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        loading="lazy"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                <span className="cam-vf" aria-hidden="true" />
              </div>
              <span className="cam-perf" aria-hidden="true" />
            </div>
            <div className="cam-bottom" aria-hidden="true">
              <span className="cam-rec">
                <i /> {engaged ? 'PLAY' : 'STANDBY'}
              </span>
              <span>ISO 400 · 24 FPS</span>
            </div>
          </div>

          <div className="av-info">
            <p className="eyebrow">{v.service}</p>
            <h3 className="av-title" aria-live="polite">
              {v.title}
            </h3>
            <ul className="chips" aria-label="Categorias">
              {v.categories.map((c) => (
                <li key={c}>{videoCategories[c]}</li>
              ))}
            </ul>
            <div className="av-actions">
              {!engaged ? (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    playShutter();
                    setEngaged(true);
                  }}
                >
                  <span>Assistir aqui</span>
                  <span className="btn-arrow" aria-hidden="true">
                    ▶
                  </span>
                </button>
              ) : (
                <button className="link-underline" onClick={() => setEngaged(false)}>
                  Parar e voltar à capa
                </button>
              )}
              <a className="link-underline" href={v.url} target="_blank" rel="noopener noreferrer">
                {sourceLabel(v)} ↗
              </a>
            </div>
            <div className="carousel-controls">
              <p className="carousel-count">
                <strong>{String(i + 1).padStart(2, '0')}</strong> / {String(n).padStart(2, '0')}
              </p>
              <div className="carousel-progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${(i + 1) / n})` }} />
              </div>
              <div className="carousel-arrows">
                <button onClick={() => go(i - 1)} aria-label="Vídeo anterior">
                  ←
                </button>
                <button onClick={() => go(i + 1)} aria-label="Próximo vídeo">
                  →
                </button>
              </div>
            </div>
            {v.kind !== 'file' && (
              <p className="av-note">O vídeo é carregado do {v.kind === 'instagram' ? 'Instagram' : 'YouTube'}. Se não aparecer, use o link acima.</p>
            )}
          </div>
        </div>

        <div className="filmstrip" role="tablist" aria-label="Escolher vídeo">
          <span className="canister" aria-hidden="true">
            <span className="canister-cap" />
            <span className="canister-label">
              LC
              <small>135</small>
            </span>
          </span>
          <ul>
            {videos.map((x, k) => (
              <li key={x.id}>
                <button
                  role="tab"
                  aria-selected={k === i}
                  className={k === i ? 'is-active' : ''}
                  onClick={() => go(k)}
                  aria-label={`${x.title} — ${x.service}`}
                >
                  <img src={asset(x.poster)} alt="" loading="lazy" decoding="async" />
                  <span>{String(k + 1).padStart(2, '0')}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
