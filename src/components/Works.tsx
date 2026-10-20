import { useState } from 'react';
import { workCategories, works, type WorkCategory } from '../data/works';
import { asset } from '../lib/asset';
import { Carousel } from './Carousel';
import { MaskLines, Reveal } from './Reveal';

/** Portfólio de design gráfico: carrossel automático com filtro por categoria. */
export function Works() {
  const [filter, setFilter] = useState<WorkCategory | 'todos'>('todos');
  const available = workCategories.filter((c) => works.some((w) => w.categories.includes(c.id)));

  const slides = works
        .filter((w) => filter === 'todos' || w.categories.includes(filter))
        .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
        .map((w) => ({
          src: asset(w.image),
          alt: `${w.project} — ${w.title}`,
          title: `${w.project}${w.year ? ` · ${w.year}` : ''} — ${w.title}`,
          width: w.width,
          height: w.height,
        }));

  return (
    <section className="section projects" id="design" aria-labelledby="design-title">
      <div className="section-head">
        <p className="section-num">(02)</p>
        <h2 id="design-title" className="section-title">
          <MaskLines lines={['Design', <em key="g">gráfico</em>]} />
        </h2>
        <Reveal className="section-aside" delay={0.2}>
          <p>Materiais gráficos e digitais. O carrossel avança sozinho — arraste, use as setas ou clique para ampliar.</p>
        </Reveal>
      </div>

      <Reveal>
        <div className="filters" role="group" aria-label="Filtrar por categoria">
          <button className={filter === 'todos' ? 'is-active' : ''} aria-pressed={filter === 'todos'} onClick={() => setFilter('todos')}>
            Todos<sup>{works.length}</sup>
          </button>
          {available.map((c) => (
            <button key={c.id} className={filter === c.id ? 'is-active' : ''} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label}
              <sup>{works.filter((w) => w.categories.includes(c.id)).length}</sup>
            </button>
          ))}
        </div>
        <Carousel key={filter} slides={slides} label="Trabalhos de design gráfico" variant="landscape" autoplay={4500} />
      </Reveal>
    </section>
  );
}
