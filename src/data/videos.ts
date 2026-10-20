/**
 * PORTFÓLIO AUDIOVISUAL
 * Cada vídeo pode ser:
 *  - kind: 'instagram' → url do post/reel (incorporado no site e com link para abrir no Instagram);
 *  - kind: 'file'      → arquivo de vídeo em /public/videos/ (ex.: 'videos/meu-video.mp4');
 *  - kind: 'youtube'   → url do vídeo no YouTube.
 * `poster` é a imagem de capa exibida antes de tocar.
 * Os links abaixo vêm dos botões "clique na imagem para visualizar" do portfólio 2026.
 */
export type VideoCategory = 'filmagem' | 'motion' | 'eventos' | 'institucionais' | 'promocionais' | 'redes';

export const videoCategories: Record<VideoCategory, string> = {
  filmagem: 'Filmagem e edição',
  motion: 'Motion design',
  eventos: 'Vídeos de eventos',
  institucionais: 'Conteúdos institucionais',
  promocionais: 'Vídeos promocionais',
  redes: 'Produções para redes sociais',
};

export type Video = {
  id: string;
  title: string;
  service: string;
  kind: 'instagram' | 'file' | 'youtube';
  url: string;
  poster: string;
  categories: VideoCategory[];
  /** descrição curta (opcional) */
  description?: string;
  /** legenda .vtt em /public (opcional, só para kind 'file') */
  captions?: string;
  /** link da publicação original (botão "Abrir no Instagram") */
  link?: string;
  /** trecho curto sem som usado nas películas do topo do site */
  loop?: string;
};

export const videos: Video[] = [
  { id: 'festeja', title: 'Festeja Amarante', service: 'Motion', kind: 'file', url: 'videos/festeja-amarante.mp4', link: 'https://www.instagram.com/p/DRhQT1AEQf8/', loop: 'videos/loop-festeja-amarante.mp4', poster: 'videos/festeja-amarante.webp', categories: ['motion', 'eventos', 'promocionais', 'redes'] },
  { id: 'viva-amar', title: 'Festival Viva Amar', service: 'Motion', kind: 'file', url: 'videos/viva-amar-motion.mp4', link: 'https://www.instagram.com/p/DLnI4xPxny4/', loop: 'videos/loop-viva-amar-motion.mp4', poster: 'videos/viva-amar-motion.webp', categories: ['motion', 'eventos', 'promocionais', 'redes'] },
  { id: 'aniversario', title: 'Aniversário de Amarante', service: 'Filmagem e edição', kind: 'file', url: 'videos/aniversario-amarante.mp4', link: 'https://www.instagram.com/p/DM7nUO8RI_E/', loop: 'videos/loop-aniversario-amarante.mp4', poster: 'videos/aniversario-amarante.webp', categories: ['filmagem', 'institucionais', 'redes'] },
  { id: 'dr-jose', title: 'Cirurgião plástico Dr. José Maurício', service: 'Filmagem e edição', kind: 'file', url: 'videos/dr-jose-mauricio.mp4', link: 'https://www.instagram.com/p/C8PGxnxgEFU/', loop: 'videos/loop-dr-jose-mauricio.mp4', poster: 'videos/dr-jose-mauricio.webp', categories: ['filmagem', 'redes'] },
  { id: 'stouradas', title: 'Bloquinho de carnaval Stouradas', service: 'Filmagem e edição', kind: 'file', url: 'videos/stouradas.mp4', link: 'https://www.instagram.com/p/C8dKjN_vtb7/', loop: 'videos/loop-stouradas.mp4', poster: 'videos/stouradas.webp', categories: ['filmagem', 'eventos', 'redes'] },
];
