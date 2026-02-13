
import React, { useState } from 'react';
import { ArrowLeft, Clock, ChefHat, Flame, Play, Heart, Info, Plus, Sparkles } from 'lucide-react';
import { Recipe } from '../types.ts';
import { getIngredientSubstitutions, getNutritionalQuickInfo } from '../geminiService.ts';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onStartCooking: () => void;
  isDarkMode: boolean;
  isLargeText: boolean;
  onToggleFavorite: () => void;
  onAddToShoppingList: (item: string) => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ 
  recipe, onBack, onStartCooking, isDarkMode, isLargeText, onToggleFavorite, onAddToShoppingList 
}) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{ type: string, content: string } | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const handleSubstitutions = async (ingredient: string) => {
    setLoadingAI(ingredient);
    try {
      const result = await getIngredientSubstitutions(ingredient);
      setAiResult({ type: `Substitutos para ${ingredient}`, content: result || '' });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(null);
    }
  };

  const handleNutritionalInfo = async () => {
    setLoadingAI('nutrition');
    try {
      const ingredientStr = recipe.ingredients.map(i => `${i.amount}${i.unit} ${i.name}`).join(', ');
      const result = await getNutritionalQuickInfo(recipe.title, ingredientStr);
      setAiResult({ type: 'Informação Nutricional IA', content: result || '' });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(null);
    }
  };

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedIngredients(newChecked);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className={`flex items-center gap-2 font-bold transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[400px]">
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
          <button 
            onClick={onToggleFavorite}
            className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md shadow-lg transition-all ${recipe.isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-400 hover:text-red-500'}`}
          >
            <Heart className={`w-6 h-6 ${recipe.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider">{recipe.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">{recipe.title}</h1>
          <p className={`text-lg mb-6 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {recipe.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Stat icon={<Clock />} value={`${recipe.prepTimeMinutes} min`} label="Preparo" isDarkMode={isDarkMode} />
            <Stat icon={<ChefHat />} value={recipe.difficulty} label="Nível" isDarkMode={isDarkMode} />
            <Stat icon={<Flame />} value={recipe.calories ? `${recipe.calories} kcal` : '--'} label="Calorias" isDarkMode={isDarkMode} />
          </div>

          <button 
            onClick={onStartCooking}
            className="group flex items-center justify-center gap-3 bg-orange-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20 active:scale-95"
          >
            <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
            Iniciar Modo Cozinhar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-8 rounded-[2rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm border border-slate-100'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Ingredientes</h2>
              <button 
                onClick={handleNutritionalInfo}
                disabled={loadingAI === 'nutrition'}
                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-30"
                title="Dica Nutricional IA"
              >
                <Sparkles className={`w-5 h-5 ${loadingAI === 'nutrition' ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <ul className="space-y-4">
              {recipe.ingredients.map(ing => (
                <li key={ing.id} className="group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={checkedIngredients.has(ing.id)}
                        onChange={() => toggleCheck(ing.id)}
                        className="w-5 h-5 rounded-full border-2 border-orange-200 text-orange-500 focus:ring-orange-500"
                      />
                      <span className={`transition-all ${checkedIngredients.has(ing.id) ? 'line-through opacity-40' : 'opacity-100'}`}>
                        <span className="font-bold mr-1">{ing.amount} {ing.unit}</span> {ing.name}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleSubstitutions(ing.name)} 
                        disabled={loadingAI === ing.name}
                        className="p-1 hover:text-orange-500 disabled:opacity-30" 
                        title="Substituições"
                      >
                        <Info className={`w-4 h-4 ${loadingAI === ing.name ? 'animate-pulse' : ''}`} />
                      </button>
                      <button onClick={() => onAddToShoppingList(`${ing.amount} ${ing.unit} ${ing.name}`)} className="p-1 hover:text-orange-500" title="Adicionar ao Carrinho">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {aiResult && (
            <div className={`p-6 rounded-3xl border-l-4 border-orange-500 animate-in slide-in-from-right-4 duration-300 ${isDarkMode ? 'bg-slate-800 border-orange-500' : 'bg-orange-50 border-orange-500'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-orange-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {aiResult.type}
                </h3>
                <button onClick={() => setAiResult(null)} className="text-orange-400 hover:text-orange-600">✕</button>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {aiResult.content}
              </div>
            </div>
          )}

          <div className={`p-8 rounded-[2rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm border border-slate-100'}`}>
            <h2 className="text-2xl font-bold mb-6">Modo de Preparo</h2>
            <div className="space-y-8">
              {recipe.steps.map((step, idx) => (
                <div key={step.id} className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`leading-relaxed ${isLargeText ? 'text-xl' : 'text-lg'}`}>{step.description}</p>
                    {step.timerSeconds && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        Tempo sugerido: {Math.floor(step.timerSeconds / 60)} min
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode, value: string, label: string, isDarkMode: boolean }> = ({ icon, value, label, isDarkMode }) => (
  <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
    <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-none mb-1">{label}</p>
      <p className="font-bold leading-none">{value}</p>
    </div>
  </div>
);

export default RecipeDetail;
