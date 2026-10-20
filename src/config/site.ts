/**
 * CONFIGURAÇÃO CENTRAL DO PORTFÓLIO
 * Edite este arquivo para trocar nome, foto, contatos e preferências.
 * Campos vazios ('') ficam ocultos no site.
 */
export const site = {
  name: 'Lucas de Carvalho',
  fullName: 'Lucas de Carvalho',
  brand: 'LUCAS DE CARVALHO',
  initials: 'LC',
  role: 'Publicitário — Design gráfico & Audiovisual',
  /**
   * Foto da seção "Sobre mim". Coloque o arquivo em /public e informe o nome aqui.
   * Deixe '' (ou um arquivo inexistente) para exibir o espaço "INSERIR FOTO DO LUCAS".
   */
  photo: 'lucas.jpg',
  /** Enquadramento da foto (CSS object-position). Ex.: 'center 30%' */
  photoPosition: 'center 28%',
  location: 'Amarante · Teresina — Piauí',

  availability: {
    show: false, // true para exibir o selo de disponibilidade
    open: true,
    label: 'Disponível para novos projetos',
    closedLabel: 'Agenda fechada no momento',
  },

  /** Preencha com os contatos do Lucas. Campos vazios não aparecem. */
  contact: {
    email: '',
    whatsapp: '', // só números, com DDI e DDD. Ex.: 5586999999999
    instagram: '', // URL completa do perfil
    linkedin: '', // URL completa do perfil
    behance: '', // URL completa do perfil
  },

  /** Som do obturador na linha do tempo (o visitante pode desligar no topo do site). */
  soundDefaultOn: true,

  url: '', // domínio final, ex.: https://lucasdecarvalho.netlify.app (usado no compartilhamento)
} as const;
