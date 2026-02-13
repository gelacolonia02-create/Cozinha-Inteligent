
import { Difficulty, Category, Recipe } from './types.ts';

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Pasta à Carbonara Autêntica',
    description: 'Um clássico italiano cremoso feito apenas com ovos, queijo pecorino, guanciale e pimenta preta.',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800&auto=format&fit=crop',
    prepTimeMinutes: 20,
    difficulty: Difficulty.MEDIUM,
    category: Category.PASTA,
    author: 'Chef Giovanni',
    isFavorite: true,
    calories: 650,
    ingredients: [
      { id: 'i1', name: 'Espaguete', amount: 200, unit: 'g' },
      { id: 'i2', name: 'Guanciale ou Pancetta', amount: 100, unit: 'g' },
      { id: 'i3', name: 'Gemas de ovo', amount: 3, unit: 'unid' },
      { id: 'i4', name: 'Queijo Pecorino Romano', amount: 50, unit: 'g' },
      { id: 'i5', name: 'Pimenta do reino', amount: 1, unit: 'gosto' }
    ],
    steps: [
      { id: 's1', description: 'Ferva uma panela grande com água e sal.' },
      { id: 's2', description: 'Frite o guanciale em fogo médio até ficar crocante.', timerSeconds: 300 },
      { id: 's3', description: 'Em uma tigela separada, bata as gemas com o queijo pecorino e pimenta.' },
      { id: 's4', description: 'Cozinhe a massa por 2 minutos a menos que o tempo do pacote.', timerSeconds: 480 },
      { id: 's5', description: 'Misture a massa com o guanciale e adicione a mistura de ovos fora do fogo para não coagular.' }
    ]
  },
  {
    id: '2',
    title: 'Bowl de Salmão com Abacate',
    description: 'Uma opção saudável e refrescante repleta de ômega-3 e gorduras boas.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
    prepTimeMinutes: 15,
    difficulty: Difficulty.EASY,
    category: Category.FITNESS,
    author: 'Nutri Marina',
    calories: 420,
    ingredients: [
      { id: 'i6', name: 'Filé de Salmão', amount: 150, unit: 'g' },
      { id: 'i7', name: 'Abacate', amount: 0.5, unit: 'unid' },
      { id: 'i8', name: 'Arroz integral cozido', amount: 100, unit: 'g' },
      { id: 'i9', name: 'Pepino japonês', amount: 0.5, unit: 'unid' },
      { id: 'i10', name: 'Molho Shoyu light', amount: 1, unit: 'colher sopa' }
    ],
    steps: [
      { id: 's6', description: 'Grelhe o salmão temperado com sal e limão.', timerSeconds: 480 },
      { id: 's7', description: 'Corte o abacate e o pepino em fatias finas.' },
      { id: 's8', description: 'Monte o bowl começando pelo arroz, seguido dos vegetais e o peixe por cima.' }
    ]
  },
  {
    id: '3',
    title: 'Mousse de Chocolate Belga',
    description: 'Sobremesa sofisticada com textura aerada e sabor intenso de cacau.',
    imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=800&auto=format&fit=crop',
    prepTimeMinutes: 30,
    difficulty: Difficulty.HARD,
    category: Category.DESSERT,
    author: 'Chef Patissier',
    calories: 320,
    ingredients: [
      { id: 'i11', name: 'Chocolate 70% cacau', amount: 200, unit: 'g' },
      { id: 'i12', name: 'Claras de ovo', amount: 4, unit: 'unid' },
      { id: 'i13', name: 'Açúcar de confeiteiro', amount: 50, unit: 'g' },
      { id: 'i14', name: 'Creme de leite fresco', amount: 100, unit: 'ml' }
    ],
    steps: [
      { id: 's9', description: 'Derreta o chocolate em banho-maria.' },
      { id: 's10', description: 'Bata as claras em neve até formar picos firmes.', timerSeconds: 300 },
      { id: 's11', description: 'Misture delicadamente o chocolate com o creme de leite e depois as claras.' },
      { id: 's12', description: 'Leve à geladeira por pelo menos 4 horas.', timerSeconds: 14400 }
    ]
  }
];
