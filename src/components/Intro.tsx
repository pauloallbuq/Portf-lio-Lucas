import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { site } from '../config/site';
import { playIris } from '../hooks/useSound';

/** Tela de entrada: botão REC → som de câmera + diafragma fechando/abrindo → portfólio. */
export function Intro({ onDone }: { onDone?: () => void }) {
  const [stage, setStage] = useState<'idle' | 'shoot' | 'done'>('idle');
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.classList.toggle('no-scroll', stage !== 'done');
    return () => document.body.classList.remove('no-scroll');
  }, [stage]);

  if (stage === 'done') return null;

  const start = () => {
    if (stage !== 'idle') return;
    playIris(true);
    setStage('shoot');
    window.setTimeout(() => setStage('done'), reduce ? 300 : 1300);
    window.setTimeout(() => onDone?.(), reduce ? 200 : 650); // reinicia a animação do topo quando o diafragma abre
  };

  return (
    <div className={`intro ${stage === 'shoot' ? 'is-shoot' : ''}`} role="dialog" aria-modal="true" aria-label="Entrada do portfólio">
      <span className="hud-corner tl" aria-hidden="true" />
      <span className="hud-corner tr" aria-hidden="true" />
      <span className="hud-corner bl" aria-hidden="true" />
      <span className="hud-corner br" aria-hidden="true" />
      <p className="intro-brand">{site.brand}</p>
      <button className="intro-rec" onClick={start} autoFocus aria-label="REC — entrar no portfólio">
        <span className="intro-rec-dot" aria-hidden="true" />
        REC
      </button>
      <p className="intro-hint">Aperte REC para entrar</p>
      <div className="iris" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} style={{ '--r': `${i * 45}deg` } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
