
import React, { useState } from 'react';
import { Plus, Trash2, Camera, Save, X, Clock, ChefHat } from 'lucide-react';
import { Difficulty, Category, Recipe, Ingredient, RecipeStep } from '../types.ts';

interface RecipeFormProps {
  onSave: (recipe: Omit<Recipe, 'id' | 'isFavorite'>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSave, onCancel, isDarkMode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prepTime, setPrepTime] = useState(30);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [category, setCategory] = useState<Category>(Category.SAVORY);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now().toString(), name: '', amount: 0, unit: 'g' }]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now().toString(), description: '' }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      imageUrl: imageUrl || 'https://picsum.photos/800/600?random=' + Math.random(),
      prepTimeMinutes: prepTime,
      difficulty,
      category,
      ingredients,
      steps,
      author: 'Você'
    });
  };

  return (
    <div className={`max-w-4xl mx-auto p-8 rounded-[2rem] border animate-in slide-in-from-bottom-8 duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl'}`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold font-serif">Criar Nova Receita</h2>
        <button onClick={onCancel} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Título da Receita</label>
              <input 
                required
                type="text" 
                className={`w-full p-4 rounded-2xl border-2 transition-all outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`}
                placeholder="Ex: Torta de Limão Especial"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Descrição</label>
              <textarea 
                required
                className={`w-full p-4 rounded-2xl border-2 transition-all outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`}
                placeholder="Uma breve história sobre esta delícia..."
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className={`h-full min-h-[160px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-4 transition-colors ${isDarkMode ? 'border-slate-700 hover:border-orange-500' : 'border-slate-200 hover:border-orange-500 bg-slate-50'}`}>
              <Camera className="w-10 h-10 text-slate-300 mb-2" />
              <input 
                type="text" 
                placeholder="URL da Imagem (opcional)"
                className="w-full text-xs p-2 bg-transparent text-center border-none outline-none"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tempo (min)</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="number" 
                className={`w-full p-4 pl-10 rounded-2xl border-2 transition-all outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`}
                value={prepTime}
                onChange={e => setPrepTime(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Dificuldade</label>
            <div className="relative">
              <ChefHat className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                className={`w-full p-4 pl-10 rounded-2xl border-2 appearance-none transition-all outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`}
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
              >
                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Categoria</label>
            <select 
              className={`w-full p-4 rounded-2xl border-2 appearance-none transition-all outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`}
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
            >
              {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Ingredientes</h3>
            <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600">
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={ing.id} className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Qtd" 
                  className={`w-20 p-3 rounded-xl border-2 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                  value={ing.amount}
                  onChange={e => {
                    const newIngs = [...ingredients];
                    newIngs[idx].amount = Number(e.target.value);
                    setIngredients(newIngs);
                  }}
                />
                <input 
                  type="text" 
                  placeholder="Unid" 
                  className={`w-20 p-3 rounded-xl border-2 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                  value={ing.unit}
                  onChange={e => {
                    const newIngs = [...ingredients];
                    newIngs[idx].unit = e.target.value;
                    setIngredients(newIngs);
                  }}
                />
                <input 
                  type="text" 
                  placeholder="Nome do ingrediente" 
                  className={`flex-1 p-3 rounded-xl border-2 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                  value={ing.name}
                  onChange={e => {
                    const newIngs = [...ingredients];
                    newIngs[idx].name = e.target.value;
                    setIngredients(newIngs);
                  }}
                />
                <button type="button" onClick={() => removeIngredient(ing.id)} className="p-3 text-red-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Passo a Passo</h3>
            <button type="button" onClick={addStep} className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600">
              <Plus className="w-4 h-4" /> Adicionar Passo
            </button>
          </div>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-2">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <textarea 
                    placeholder="O que deve ser feito neste passo?" 
                    className={`w-full p-3 rounded-xl border-2 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                    value={step.description}
                    onChange={e => {
                      const newSteps = [...steps];
                      newSteps[idx].description = e.target.value;
                      setSteps(newSteps);
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      placeholder="Timer (segundos - opcional)" 
                      className={`p-2 text-xs rounded-lg border-2 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                      value={step.timerSeconds || ''}
                      onChange={e => {
                        const newSteps = [...steps];
                        newSteps[idx].timerSeconds = Number(e.target.value) || undefined;
                        setSteps(newSteps);
                      }}
                    />
                  </div>
                </div>
                <button type="button" onClick={() => removeStep(step.id)} className="p-3 text-red-400 hover:text-red-500 self-start">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t flex gap-4">
          <button 
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg active:scale-95"
          >
            <Save className="w-5 h-5" /> Salvar Receita
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className={`flex-1 py-4 rounded-2xl font-bold text-lg border-2 transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-100 hover:bg-slate-50'}`}
          >
            Descartar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
