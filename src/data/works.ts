/**
 * PORTFÓLIO DE DESIGN GRÁFICO
 * Peças reais extraídas do portfólio 2026 do Lucas.
 * Para adicionar: coloque a imagem em /public/works/ e acrescente um item abaixo.
 * Um trabalho pode estar em mais de uma categoria.
 */
export type WorkCategory = 'identidade' | 'eventos' | 'campanhas' | 'redes' | 'promocionais' | 'institucionais';

export const workCategories: { id: WorkCategory; label: string }[] = [
  { id: 'identidade', label: 'Identidade visual e logotipos' },
  { id: 'eventos', label: 'Materiais gráficos para eventos' },
  { id: 'campanhas', label: 'Campanhas publicitárias' },
  { id: 'redes', label: 'Materiais para redes sociais' },
  { id: 'promocionais', label: 'Peças promocionais' },
  { id: 'institucionais', label: 'Projetos institucionais' },
];

export type Work = {
  id: string;
  title: string;
  project: string;
  year?: string;
  image: string; // caminho em /public
  width: number;
  height: number;
  categories: WorkCategory[];
  featured?: boolean;
  /** descrição curta exibida no cartão e no modal (opcional) */
  description?: string;
};

export const works: Work[] = [
  { id: 'ze-logo-abada', title: 'Logo e abadá', project: 'Zé Pereira de Amarante', year: '2024', image: 'works/ze-pereira-logo-abada.webp', width: 1600, height: 1131, categories: ['identidade', 'eventos'], featured: true },
  { id: 'ze-outdoor', title: 'Outdoor 9×3 m', project: 'Zé Pereira de Amarante', year: '2024', image: 'works/ze-pereira-outdoor.webp', width: 1600, height: 1131, categories: ['eventos', 'promocionais'], featured: true },
  { id: 'ze-backdrop', title: 'Backdrop para live 4,5×3,5 m', project: 'Zé Pereira de Amarante', year: '2024', image: 'works/ze-pereira-backdrop.webp', width: 1600, height: 1131, categories: ['eventos'], featured: true },
  { id: 'equatorial', title: 'Identidade visual — IX Encontro dos Conselhos de Consumidores de Energia Elétrica', project: 'Evento Equatorial — PI', image: 'works/equatorial-encontro.webp', width: 1600, height: 1131, categories: ['identidade', 'eventos'], featured: true },
  { id: 'amarante-id', title: 'Logo principal', project: 'Identidade visual de Amarante', year: '2025–2028', image: 'works/amarante-id.webp', width: 1600, height: 1131, categories: ['identidade', 'institucionais'], featured: true },
  { id: 'viva-logo', title: 'Logo — aplicação 1', project: 'Festival Viva Amar', year: '2025', image: 'works/viva-amar-logo.webp', width: 1600, height: 1131, categories: ['identidade', 'eventos'], featured: true },
  { id: 'viva-kv', title: 'Ilustração e identidade', project: 'Festival Viva Amar', year: '2025', image: 'works/viva-amar-key-visual.webp', width: 1600, height: 1131, categories: ['identidade', 'eventos'], featured: true },
  { id: 'viva-pecas', title: 'Camiseta, crachás e boné', project: 'Festival Viva Amar', year: '2025', image: 'works/viva-amar-pecas.webp', width: 1600, height: 1131, categories: ['eventos', 'promocionais'], featured: true },
  { id: 'crmv-faixa', title: 'Faixa 3 m × 60 cm', project: 'Campanha Chapa 2 — eleição CRMV-PI', year: '2024', image: 'works/crmv-faixa.webp', width: 1600, height: 1131, categories: ['campanhas', 'promocionais'] },
  { id: 'crmv-redes', title: 'Material para redes sociais', project: 'Campanha Chapa 2 — eleição CRMV-PI', year: '2024', image: 'works/crmv-redes.webp', width: 1600, height: 1131, categories: ['campanhas', 'redes'] },
];
