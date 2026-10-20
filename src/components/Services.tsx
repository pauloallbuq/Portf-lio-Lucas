import { MaskLines, Reveal } from './Reveal';
import { services, skills } from '../content';

const icons: Record<string, string> = {
  megaphone: 'M3 10v4h3l6 4V6L6 10H3zm13 2a4 4 0 0 0-2-3.5v7A4 4 0 0 0 16 12zm-2-8v2a6 6 0 0 1 0 12v2a8 8 0 0 0 0-16z',
  pen: 'M3 17.2V21h3.8l11-11-3.8-3.8-11 11zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.8 3.8L20.7 7z',
  social: 'M18 16a3 3 0 0 0-2.4 1.2l-6.8-3.4a3 3 0 0 0 0-1.6l6.8-3.4A3 3 0 1 0 15 7l-6.8 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z',
  camera: 'M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z',
};

export function Services() {
  return (
    <section className="section services" id="servicos" aria-labelledby="servicos-title">
      <div className="section-head">
        <p className="section-num">(05)</p>
        <h2 id="servicos-title" className="section-title">
          <MaskLines lines={['Serviços', <em key="s">oferecidos</em>]} />
        </h2>
      </div>
      <ul className="svc-grid">
        {services.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.06} className="svc-card">
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path d={icons[s.icon]} fill="currentColor" />
            </svg>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export function Skills() {
  return (
    <section className="section skills" id="habilidades" aria-labelledby="habilidades-title">
      <div className="section-head">
        <p className="section-num">(06)</p>
        <h2 id="habilidades-title" className="section-title">
          <MaskLines lines={['Habilidades &', <em key="f">ferramentas</em>]} />
        </h2>
      </div>
      <div className="skill-grid">
        {skills.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.06} className="skill-card">
            <h3>{g.title}</h3>
            <ul>
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <p className="skill-tools">
              <span>Ferramentas</span>
              {g.tools.length ? g.tools.join(' · ') : 'A confirmar'}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
