import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { videoCategories, videos, type Video } from '../data/videos';
import { asset } from '../lib/asset';
import { playClick, playShutter } from '../hooks/useSound';
import { MaskLines, Reveal } from './Reveal';

function embedUrl(v: Video) {
  if (v.kind === 'instagram') return v.url.replace(/\/?(\?.*)?$/, '/') + 'embed/';
  if (v.kind === 'youtube') {
    const id = v.url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{6,})/)?.[1] ?? '';
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
  }
  return asset(v.url);
}

const linkOf = (v: Video) => v.link ?? v.url;
const sourceLabel = (v: Video) => {
  const u = linkOf(v);
  return u.includes('instagram.com') ? 'Abrir no Instagram' : /youtu/.test(u) ? 'Abrir no YouTube' : 'Abrir vídeo';
};

/**
 * Carrossel de vídeos em moldura de câmera analógica.
 * Só o vídeo selecionado fica carregado: trocar de vídeo desmonta/pausa o anterior,
 * então nunca há dois tocando ao mesmo tempo.
 */
export function Videos() {
  const [i, setI] = useState(0);
  const [engaged, setEngaged] = useState(false); // o visitante já pediu para assistir
  const videoEl = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(false); // som ligado; se o navegador bloquear, cai para mudo
  const swipeX = useRef<number | null>(null);
  const [time, setTime] = useState(0);
  const [err, setErr] = useState(false);
  const reduce = useReducedMotion();
  const v = videos[i];
  const n = videos.length;

  const go = (to: number) => {
    videoEl.current?.pause();
    playClick();
    setTime(0);
    setErr(false);
    setI(((to % n) + n) % n);
  };

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // arquivo próprio: o ativo tenta tocar (mudo) ao entrar na tela; sai da tela → pausa
  const isFile = v?.kind === 'file';
  useEffect(() => {
    const el = videoEl.current;
    if (!el || !isFile) return;
    if (inView && !reduce)
      el.play().catch(() => {
        // navegador bloqueou autoplay com som: toca mudo e mantém o botão "Ativar som"
        el.muted = true;
        setMuted(true);
        el.play().catch(() => {});
      });
    else el.pause();
  }, [i, inView, isFile, reduce]);

  // arquivo local: inicia o selecionado quando o visitante já interagiu (se o navegador permitir)
  useEffect(() => {
    const el = videoEl.current;
    if (!el || !engaged || isFile) return;
    el.play().catch(() => {
      /* bloqueado pelo navegador: o visitante usa os controles */
    });
  }, [i, engaged, isFile]);

  if (!n) return null;

  return (
    <section className="section audiovisual" id="audiovisual" aria-labelledby="audiovisual-title">
      <div className="section-head">
        <p className="section-num">(04)</p>
        <h2 id="audiovisual-title" className="section-title">
          <MaskLines lines={['Filmagem,', <em key="e">edição & motion</em>]} />
        </h2>
        <Reveal className="section-aside" delay={0.2}>
          <p>Trabalhos audiovisuais publicados. Os vídeos tocam sozinhos com som — arraste para o lado, use as setas ou a película para trocar.</p>
        </Reveal>
      </div>

      <Reveal>
        <div
          className="av"
          ref={box}
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
              <div
                className="cam-gate"
                onPointerDown={(e) => {
                  swipeX.current = e.clientX;
                }}
                onPointerUp={(e) => {
                  const dx = swipeX.current === null ? 0 : e.clientX - swipeX.current;
                  swipeX.current = null;
                  if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1);
                }}
                onPointerCancel={() => (swipeX.current = null)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={v.id + String(engaged)}
                    className="cam-screen"
                    initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {isFile ? (
                      err ? (
                        <p className="cam-error">Não foi possível reproduzir este vídeo. Verifique o arquivo em src/data/videos.ts.</p>
                      ) : (
                        <video
                          ref={videoEl}
                          src={embedUrl(v)}
                          poster={asset(v.poster)}
                          muted={muted}
                          controls
                          playsInline
                          loop
                          preload="auto"
                          autoPlay
                          onPlay={playClick}
                          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                          onError={() => setErr(true)}
                        >
                          {v.captions && <track kind="captions" src={asset(v.captions)} srcLang="pt" label="Português" default />}
                        </video>
                      )
                    ) : !engaged ? (
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
                <span className="cam-fx" aria-hidden="true" />
              </div>
              <span className="cam-perf" aria-hidden="true" />
            </div>
            <div className="cam-bottom" aria-hidden="true">
              <span className="cam-rec">
                <i /> {engaged || (isFile && inView) ? 'REC' : 'STANDBY'}
              </span>
              <span className="cam-tc">
                {new Date(time * 1000).toISOString().slice(14, 19)}:{String(Math.floor((time % 1) * 24)).padStart(2, '0')}
              </span>
              <span>ISO 400 · 24 FPS</span>
            </div>
          </div>

          <div className="av-info">
            <p className="eyebrow">{v.service}</p>
            <h3 className="av-title" aria-live="polite">
              {v.title}
            </h3>
            {v.description && <p className="av-desc">{v.description}</p>}
            <ul className="chips" aria-label="Categorias">
              {v.categories.map((c) => (
                <li key={c}>{videoCategories[c]}</li>
              ))}
            </ul>
            <div className="av-actions">
              {isFile ? (
                <button className="btn btn-primary" onClick={() => { playClick(); setMuted((m) => !m); }} aria-pressed={!muted}>
                  <span>{muted ? 'Ativar som' : 'Silenciar'}</span>
                  <span className="btn-arrow" aria-hidden="true">
                    {muted ? '🔇' : '🔊'}
                  </span>
                </button>
              ) : !engaged ? (
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
              <a className="link-underline" href={v.kind === 'file' && !v.link ? asset(v.url) : linkOf(v)} target="_blank" rel="noopener noreferrer">
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
