import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MaskLines, Reveal } from './Reveal';
import { site } from '../config/site';
import { about, areas } from '../content';
import { asset } from '../lib/asset';

/** Foto em moldura (azul, preto e cinza). Sem arquivo → espaço reservado identificado. */
function Portrait() {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const src = asset(site.photo);
  const hasPhoto = !!src && !failed;
  const img = useRef<HTMLImageElement>(null);

  // cobre erro ocorrido antes do React registrar o evento
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <motion.figure
      className="portrait"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0, y: reduce ? 0 : 40 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: reduce ? 0.3 : 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="portrait-stage">
      <span className="portrait-back" aria-hidden="true" />
      <div className="portrait-frame">
        <motion.span
          className="portrait-curtain"
          aria-hidden="true"
          variants={{ hidden: { scaleY: reduce ? 0 : 1 }, show: { scaleY: 0 } }}
          transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.25, ease: [0.76, 0, 0.24, 1] }}
        />
        {hasPhoto ? (
          <img
            ref={img}
            src={src}
            alt={`Foto de ${site.fullName}`}
            style={{ objectPosition: site.photoPosition }}
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="portrait-placeholder" role="img" aria-label="Espaço reservado para a foto do Lucas">
            <strong>INSERIR FOTO DO LUCAS</strong>
            <span>Adicione public/lucas.jpg ou ajuste "photo" em src/config/site.ts</span>
          </div>
        )}
        <span className="vf vf-tl" aria-hidden="true" />
        <span className="vf vf-tr" aria-hidden="true" />
        <span className="vf vf-bl" aria-hidden="true" />
        <span className="vf vf-br" aria-hidden="true" />
        <span className="portrait-rec" aria-hidden="true">
          <i /> REC
        </span>
      </div>
      </div>
      <figcaption className="portrait-caption">
        <span className="portrait-name">{site.fullName}</span>
        {about.credentials.map((c) => (
          <span key={c.label} className="portrait-cred">
            <small>{c.label}</small>
            {c.value}
          </span>
        ))}
      </figcaption>
    </motion.figure>
  );
}

export function About() {
  const [lead, ...rest] = about.paragraphs;
  return (
    <section className="section about" id="sobre" aria-labelledby="sobre-title">
      <div className="section-head">
        <p className="section-num">(01)</p>
        <h2 id="sobre-title" className="section-title">
          <MaskLines lines={[about.title[0], <em key="m">{about.title[1]}</em>]} />
        </h2>
      </div>

      <div className="about-grid">
        <Portrait />

        <div className="about-text">
          <Reveal>
            <p className="lead">{lead}</p>
          </Reveal>
          {rest.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05}>
              <p>{p}</p>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <a href="#contato" className="btn btn-primary">
              <span>{about.contactButton}</span>
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </a>
          </Reveal>

          <Reveal delay={0.25} className="areas">
            <h3 className="subhead">{about.areasTitle}</h3>
            <ul>
              {areas.map((a, i) => (
                <li key={a}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
