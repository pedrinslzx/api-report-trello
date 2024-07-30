const CATEGORY_POINTS_data = {
    "Sem categoria": { point: 0, obs: '' },
    // Demanda Paralela
    "Arte Simples": { point: 2, obs: '' },
    "Arte Intermediária": { point: 3, obs: '' },
    "Arte Avançada": { point: 4, obs: '' },
    "Marketing/Simples": { point: 1, obs: '' },
    "Marketing/Intermediária": { point: 3, obs: '' },
    "Marketing/Avançado": { point: 5, obs: '' },

    // PONTUAÇÕES
    "Convite Lembrança ": { point: 0.03, obs: '3 pontos a cada 100 formandos' },
    "Banco de Imagens": { point: 0.05, obs: '5 pontos a cada 100 formandos' },
    "Quadro aos Pais": { point: 0.03, obs: '3 pontos a cada 100 formandos' },
    "Convite Luxo ": { point: 10, obs: '' },
    "Quadro Assinatura/Mesa": { point: 0.03, obs: '3 pontos a cada 100 formandos' },
    "Posse de Mesa": { point: 0.05, obs: '5 pontos a cada 100 formandos' },
    "Quadro de Mesa": { point: 0.04, obs: '4 pontos a cada 100 formandos' },
    "Lista/Nomes para ação": { point: 2, obs: '' },
    "Demanda Paralela": { point: 2, obs: '' },
    "Ficha de identificação": { point: 4, obs: '' },
    "Modelo Convite ": { point: 1, obs: '' },


    "Motion": { point: 5, obs: '' },
    "Template Motion": { point: 2, obs: '' },
    "Vetorização": { point: 8, obs: '' },
    "Montagem Brasão": { point: 3, obs: '' },
    "Edição Vídeo": { point: 5, obs: '' },
    "Tarefa MKT": { point: 2, obs: '' },
    "Motion Avançado": { point: 8, obs: '' },


    "Col - Convite Lembrança ": { point: 0.04, obs: '4 pontos a cada 100 formandos' },
    "Col - Quadro Assinatura/Mesa": { point: 0.05, obs: '5 pontos a cada 100 formandos' },
    "Col - Posse de Mesa": { point: 0.04, obs: '4 pontos a cada 100 formandos' },
    "Col - Lista de revisão de nomes": { point: 2, obs: '' },
    "Col - Lista/Nomes para ação": { point: 2, obs: '' },
    "Col - Modelo Convite ": { point: 1, obs: '' },


    "Alteração": { point: 0.5, obs: '' },
    "Dia D": { point: 5, obs: '' },
    "Etiqueta": { point: 2, obs: '' },
    "O.S. Gráfica": { point: 1, obs: '' },
}
const CATEGORY_POINTS = CATEGORY_POINTS_data as Readonly<CATEGORY_POINTS>
type CATEGORY_POINTS = typeof CATEGORY_POINTS_data
const CATEGORY_NAMES = Object.keys(CATEGORY_POINTS)
type CATEGORY_NAMES = keyof typeof CATEGORY_POINTS


const CATEGORIES_WITH_DEFAULT_AMOUNT: CATEGORY_NAMES[] = ['Arte Simples',
    'Arte Intermediária',
    'Arte Avançada',
    'Marketing/Simples',
    'Marketing/Intermediária',
    'Marketing/Avançado',
    'Motion',
    'Template Motion',
    'Vetorização',
    'Montagem Brasão',
    'Edição Vídeo',
    'Tarefa MKT',
    'Motion Avançado',
    'Alteração',
    'Dia D',
    'Etiqueta',
    'O.S. Gráfica']

export { CATEGORY_POINTS, CATEGORY_NAMES, CATEGORY_POINTS as default, CATEGORIES_WITH_DEFAULT_AMOUNT }