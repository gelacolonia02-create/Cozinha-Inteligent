
import React from 'react';
import { Clock, ChefHat, Flame, Heart } from 'lucide-react';
import { Recipe } from '../types.ts';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  isDarkMode: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, isDarkMode }) => {
  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
        isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:shadow-2xl border-slate-100'
      } border`}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm">
          {recipe.category}
        </div>
        {recipe.isFavorite && (
          <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-sm">
            <Heart className="w-4 h-4 fill-current" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-1 font-serif">{recipe.title}</h3>
        <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {recipe.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100/10">
          <div className="flex items-center gap-1 text-xs font-semibold opacity-70">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            {recipe.prepTimeMinutes} min
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold opacity-70">
            <ChefHat className="w-3.5 h-3.5 text-orange-500" />
            {recipe.difficulty}
          </div>
          {recipe.calories && (
            <div className="flex items-center gap-1 text-xs font-semibold opacity-70">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {recipe.calories} kcal
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
