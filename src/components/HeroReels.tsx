import { videos } from '../data/videos';
import { asset } from '../lib/asset';

const loops = videos.filter((v) => v.loop);

function Reel({ side, items }: { side: 'left' | 'right'; items: typeof loops }) {
  if (!items.length) return null;
  const base = Array.from({ length: Math.max(6, items.length) }, (_, k) => items[k % items.length]);
  const all = [...base, ...base]; // duplicado para a rolagem contínua
  return (
    <div className={`reel reel-${side}`} aria-hidden="true">
      <div className="reel-track">
        {all.map((v, i) => (
          <div className="reel-frame" key={v.id + i}>
            <video src={asset(v.loop!)} poster={asset(v.poster)} muted autoPlay loop playsInline preload="metadata" />
            <span>{String((i % items.length) + 1).padStart(2, '0')}A</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Películas de câmera antiga nas laterais do topo, rodando trechos dos vídeos. */
export function HeroReels() {
  const half = Math.ceil(loops.length / 2);
  return (
    <>
      <Reel side="left" items={loops.slice(0, half)} />
      <Reel side="right" items={loops.slice(half).length ? loops.slice(half) : loops} />
    </>
  );
}

/** Fragmentos de interface de edição (ilustrativos) — timeline, cor e keyframes. */
export function EditorPanels() {
  const clips = [
    [0, 22, 'v'], [24, 18, 'v'], [44, 30, 'v'], [76, 20, 'v'],
    [8, 26, 'g'], [52, 34, 'g'],
  ] as const;
  return (
    <div className="edit" aria-hidden="true">
      <div className="edit-panel edit-tl">
        <p className="edit-tag">Premiere Pro — Timeline</p>
        <div className="edit-ruler">
          {['00:00', '00:05', '00:10', '00:15', '00:20'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="edit-tracks">
          {['V2', 'V1', 'A1'].map((tr, k) => (
            <div className="edit-track" key={tr}>
              <b>{tr}</b>
              <div>
                {k === 2 ? (
                  <i className="edit-wave" />
                ) : (
                  clips
                    .filter((c) => (k === 0 ? c[2] === 'g' : c[2] === 'v'))
                    .map(([l, w, t]) => <i key={l} className={`edit-clip ${t}`} style={{ left: `${l}%`, width: `${w}%` }} />)
                )}
              </div>
            </div>
          ))}
          <span className="edit-head" />
        </div>
      </div>
      <div className="edit-panel edit-color">
        <p className="edit-tag">DaVinci Resolve — Color</p>
        <div className="edit-wheels">
          {['Lift', 'Gamma', 'Gain'].map((w) => (
            <div key={w}>
              <span className="edit-wheel">
                <i />
              </span>
              <small>{w}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="edit-panel edit-kf">
        <p className="edit-tag">After Effects — Keyframes</p>
        {['Position', 'Scale', 'Rotation', 'Opacity'].map((p, k) => (
          <div className="edit-kf-row" key={p}>
            <small>{p}</small>
            <div>
              {[10 + k * 6, 42 - k * 4, 78 - k * 8].map((x) => (
                <i key={x} style={{ left: `${x}%` }} />
              ))}
            </div>
          </div>
        ))}
        <span className="edit-head" />
      </div>
    </div>
  );
}
