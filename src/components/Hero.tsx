import { motion, useReducedMotion } from 'motion/react';
import { MaskLines } from './Reveal';
import { site } from '../config/site';
import { areas, hero } from '../content';

const YEAR = new Date().getFullYear();
const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="hero" id="topo" aria-labelledby="hero-title">
      <div className="hero-hud" aria-hidden="true">
        <span className="hud-corner tl" />
        <span className="hud-corner tr" />
        <span className="hud-corner bl" />
        <span className="hud-corner br" />
        <span className="hud-rec">
          <i /> REC
        </span>
        <span className="hud-tc">{site.brand}</span>
        <span className="hud-scan" />
        <span className="hud-focus" />
      </div>

      <div className="hero-meta">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
          (Portfólio — {YEAR})
        </motion.span>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
          {site.role}
        </motion.span>
      </div>

      <h1 className="hero-title" id="hero-title">
        <MaskLines
          inView={false}
          delay={0.15}
          lines={hero.title.map((l, i) => (i === hero.highlight ? <em key={i}>{l}</em> : <span key={i}>{l}</span>))}
        />
      </h1>

      <motion.p
        className="hero-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {hero.subtitle.map((t, i) => (
          <span key={t}>
            {i > 0 && <b aria-hidden="true"> • </b>}
            {t}
          </span>
        ))}
      </motion.p>

      <div className="hero-bottom">
        <motion.p
          className="hero-intro"
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.9, ease }}
        >
          {hero.intro}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease }}
        >
          <a href="#design" className="btn btn-primary">
            <span>{hero.ctaPrimary}</span>
            <span className="btn-arrow" aria-hidden="true">↓</span>
          </a>
          <a href="#contato" className="btn btn-ghost">
            <span>{hero.ctaSecondary}</span>
          </a>
        </motion.div>
      </div>

      <a href="#sobre" className="scroll-cue" aria-label="Rolar para o conteúdo">
        <span className="scroll-cue-line" />
        <span>Role</span>
      </a>
    </section>
  );
}

const disciplines = areas;

export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {disciplines.map((d) => (
        <li key={d}>
          {d}
          <span className="marquee-star" aria-hidden="true">✳</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" role="region" aria-label="Áreas de atuação">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
