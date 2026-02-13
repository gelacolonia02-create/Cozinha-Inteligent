
export enum Difficulty {
  EASY = 'Fácil',
  MEDIUM = 'Médio',
  HARD = 'Difícil'
}

export enum Category {
  SWEET = 'Doce',
  SAVORY = 'Salgado',
  FITNESS = 'Fitness',
  VEGETARIAN = 'Vegetariano',
  PASTA = 'Massas',
  DESSERT = 'Sobremesa'
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  isUsed?: boolean;
}

export interface RecipeStep {
  id: string;
  description: string;
  timerSeconds?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTimeMinutes: number;
  difficulty: Difficulty;
  category: Category;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  calories?: number;
  author: string;
  isFavorite?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  preferences: Category[];
  favorites: string[]; // Recipe IDs
}
