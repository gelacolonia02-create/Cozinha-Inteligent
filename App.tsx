
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Utensils, 
  Search, 
  Heart, 
  Plus, 
  User, 
  Clock, 
  ChefHat, 
  Flame,
  Moon,
  Sun,
  Type as TypeIcon,
  ShoppingCart,
  Sparkles,
  Filter,
  X,
  ChevronRight
} from 'lucide-react';
import { Recipe, Category, Difficulty } from './types.ts';
import { MOCK_RECIPES } from './constants.tsx';
import RecipeCard from './components/RecipeCard.tsx';
import RecipeDetail from './components/RecipeDetail.tsx';
import CookingMode from './components/CookingMode.tsx';
import RecipeForm from './components/RecipeForm.tsx';
import { suggestRecipesFromIngredients } from './geminiService.ts';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'profile' | 'create' | 'suggestions'>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isCooking, setIsCooking] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'Todos'>('Todos');
  const [maxPrepTime, setMaxPrepTime] = useState<number>(120);
  const [showFilters, setShowFilters] = useState(false);

  // AI Suggestion State
  const [ingredientInputs, setIngredientInputs] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleFavorite = (id: string) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  const handleSuggest = async () => {
    if (!ingredientInputs.trim()) return;
    setLoadingSuggestions(true);
    try {
      const ingredients = ingredientInputs.split(',').map(i => i.trim());
      const suggestions = await suggestRecipesFromIngredients(ingredients);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Erro ao sugerir receitas:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || r.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'Todos' || r.difficulty === selectedDifficulty;
      const matchesTime = r.prepTimeMinutes <= maxPrepTime;
      
      const isTabMatch = activeTab === 'favorites' ? r.isFavorite : true;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesTime && isTabMatch;
    });
  }, [recipes, searchQuery, selectedCategory, selectedDifficulty, maxPrepTime, activeTab]);

  if (isCooking && selectedRecipe) {
    return (
      <CookingMode 
        recipe={selectedRecipe} 
        onClose={() => setIsCooking(false)} 
        isLargeText={isLargeText}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${isLargeText ? 'text-lg' : 'text-base'}`}>
      
      {/* Dynamic Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => {setActiveTab('home'); setSelectedRecipe(null);}}>
            <div className="p-2.5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/20">
              <Utensils className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black font-serif tracking-tight hidden md:block">Cozinha Inteligente</h1>
          </div>
          
          <div className="flex-1 max-w-xl">
            <div className={`relative flex items-center rounded-2xl px-4 py-2.5 transition-all duration-300 ${isDarkMode ? 'bg-slate-900 focus-within:ring-2 focus-within:ring-orange-500/50' : 'bg-slate-100 focus-within:ring-2 focus-within:ring-orange-500/30'}`}>
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Qual o sabor de hoje?" 
                className="bg-transparent border-none outline-none w-full text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <button 
              onClick={() => setIsLargeText(!isLargeText)}
              className={`p-2.5 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              title="Acessibilidade: Texto Grande"
            >
              <TypeIcon className="w-5 h-5 text-slate-400" />
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl transition-all duration-500 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 pb-32">
        {selectedRecipe ? (
          <RecipeDetail 
            recipe={selectedRecipe} 
            onBack={() => setSelectedRecipe(null)} 
            onStartCooking={() => setIsCooking(true)}
            isDarkMode={isDarkMode}
            isLargeText={isLargeText}
            onToggleFavorite={() => toggleFavorite(selectedRecipe.id)}
            onAddToShoppingList={(item) => setShoppingList(prev => [...prev, item])}
          />
        ) : (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'home' || activeTab === 'favorites' ? (
              <div className="space-y-8">
                {/* Visual Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-bold font-serif leading-tight">
                      {activeTab === 'home' ? 'Suas Descobertas' : 'Favoritos'}
                    </h2>
                    <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {activeTab === 'home' ? 'Inspiração para cada momento da sua cozinha' : 'Seus pratos mais amados reunidos aqui'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all ${showFilters ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white shadow-sm border border-slate-200 hover:border-orange-200'}`}
                  >
                    <Filter className="w-4 h-4" />
                    Filtros {showFilters ? 'Ativos' : ''}
                  </button>
                </div>

                {/* Filter Controls */}
                <div className={`grid grid-cols-1 transition-all duration-300 gap-4 overflow-hidden ${showFilters ? 'max-h-[500px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                   <div className={`p-6 sm:p-8 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Categoria</label>
                          <div className="flex flex-wrap gap-2">
                            {['Todos', ...Object.values(Category)].map(cat => (
                              <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-orange-500 text-white shadow-md' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Dificuldade</label>
                          <div className="flex flex-wrap gap-2">
                            {['Todos', ...Object.values(Difficulty)].map(diff => (
                              <button
                                key={diff}
                                onClick={() => setSelectedDifficulty(diff as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedDifficulty === diff ? 'bg-orange-100 text-orange-600' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                              >
                                {diff}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex justify-between">
                            Tempo Máximo <span>{maxPrepTime} MIN</span>
                          </label>
                          <input 
                            type="range" min="5" max="120" step="5"
                            value={maxPrepTime}
                            onChange={(e) => setMaxPrepTime(Number(e.target.value))}
                            className="w-full accent-orange-500 mt-2"
                          />
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-3">
                            <span>VAPT-VUPT</span>
                            <span>GOURMET</span>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredRecipes.map(recipe => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      onClick={() => setSelectedRecipe(recipe)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                  
                  {activeTab === 'home' && (
                    <button 
                      onClick={() => setActiveTab('create')}
                      className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[2.5rem] transition-all group ${isDarkMode ? 'border-slate-800 hover:border-orange-500 hover:bg-slate-900/50' : 'border-slate-200 hover:border-orange-500 hover:bg-orange-50/50'}`}
                    >
                      <div className="p-4 bg-orange-100 dark:bg-orange-950 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8 text-orange-500" />
                      </div>
                      <span className="font-bold text-slate-400 group-hover:text-orange-500 transition-colors">Nova Receita</span>
                    </button>
                  )}
                </div>

                {filteredRecipes.length === 0 && (
                  <div className={`text-center py-24 rounded-[3rem] border-2 border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <Utensils className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-xl font-bold mb-2">Nada por aqui...</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Tente ajustar seus filtros ou busca para encontrar o que deseja.</p>
                    <button 
                      onClick={() => {setSelectedCategory('Todos'); setSelectedDifficulty('Todos'); setMaxPrepTime(120); setSearchQuery('');}}
                      className="mt-6 font-bold text-orange-500 hover:underline"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === 'create' && (
              <RecipeForm 
                onSave={(newRecipe) => {
                  setRecipes(prev => [{ ...newRecipe, id: Date.now().toString(), isFavorite: false }, ...prev]);
                  setActiveTab('home');
                }}
                onCancel={() => setActiveTab('home')}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'suggestions' && (
              <div className="max-w-3xl mx-auto space-y-10">
                <div className={`p-8 sm:p-12 rounded-[3rem] ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-xl'}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-orange-100 rounded-2xl">
                      <Sparkles className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold font-serif">O Chef IA sugere</h2>
                      <p className="text-slate-500 font-medium">Use o que você já tem em casa</p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-6 leading-relaxed opacity-80">Liste seus ingredientes separados por vírgula e deixe nossa inteligência artificial criar o cardápio perfeito para você.</p>
                  
                  <textarea 
                    placeholder="Ex: Frango, milho, creme de leite, batata..."
                    className={`w-full p-6 rounded-[2rem] border-2 transition-all outline-none font-medium resize-none ${isDarkMode ? 'bg-slate-950 border-slate-800 focus:border-orange-500/50' : 'bg-slate-50 border-slate-100 focus:border-orange-500/30'}`}
                    rows={4}
                    value={ingredientInputs}
                    onChange={(e) => setIngredientInputs(e.target.value)}
                  />
                  
                  <button 
                    disabled={loadingSuggestions || !ingredientInputs.trim()}
                    onClick={handleSuggest}
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-[2rem] font-black text-lg hover:shadow-xl hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {loadingSuggestions ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Criando sugestões...
                      </span>
                    ) : 'Explorar Possibilidades'}
                  </button>
                </div>

                {aiSuggestions.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-700">
                    {aiSuggestions.map((s, idx) => (
                      <div key={idx} className={`p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'}`}>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-50 dark:bg-orange-950 px-3 py-1 rounded-full">
                            {s.time}
                          </span>
                        </div>
                        <h4 className="text-2xl font-bold font-serif mb-3">{s.title}</h4>
                        <p className="text-sm opacity-70 leading-relaxed mb-6">{s.description}</p>
                        <button className="text-sm font-bold text-orange-500 flex items-center gap-2 hover:translate-x-1 transition-transform">
                          Ver como fazer <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-xl mx-auto space-y-8 text-center">
                <div className="relative inline-block group">
                  <div className="w-40 h-40 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-8 border-white dark:border-slate-900 shadow-2xl overflow-hidden">
                    <User className="w-20 h-20 text-white opacity-90" />
                  </div>
                  <div className="absolute bottom-2 right-2 p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700">
                    <ChefHat className="w-5 h-5 text-orange-500" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold font-serif">Mestre Cuca</h2>
                  <p className="text-slate-500 font-medium">Chef entusiasta & Aventureiro</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-sm'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Receitas Criadas</p>
                    <p className="text-3xl font-black">{recipes.filter(r => r.author === 'Você').length}</p>
                  </div>
                  <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-sm'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Favoritas</p>
                    <p className="text-3xl font-black">{recipes.filter(r => r.isFavorite).length}</p>
                  </div>
                </div>

                {shoppingList.length > 0 && (
                  <div className={`p-8 rounded-[3rem] text-left animate-in fade-in zoom-in-95 duration-500 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-xl'}`}>
                    <h3 className="flex items-center gap-3 text-xl font-bold mb-6">
                      <ShoppingCart className="w-6 h-6 text-orange-500" />
                      Lista de Compras
                    </h3>
                    <ul className="space-y-4">
                      {shoppingList.map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm font-medium group">
                          <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-orange-200 text-orange-500 focus:ring-orange-500 transition-all cursor-pointer" />
                          <span className="flex-1 group-hover:text-orange-500 transition-colors">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setShoppingList([])}
                      className="mt-8 text-xs font-black text-red-500/70 hover:text-red-500 uppercase tracking-widest"
                    >
                      Esvaziar Lista
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 px-6 py-4 pb-8 transition-all duration-300 border-t ${isDarkMode ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'} backdrop-blur-xl`}>
        <div className="max-w-lg mx-auto flex items-center justify-around">
          <NavButton active={activeTab === 'home'} onClick={() => {setActiveTab('home'); setSelectedRecipe(null);}} icon={<Utensils />} label="Home" />
          <NavButton active={activeTab === 'suggestions'} onClick={() => {setActiveTab('suggestions'); setSelectedRecipe(null);}} icon={<Sparkles />} label="IA Chef" />
          <NavButton active={activeTab === 'favorites'} onClick={() => {setActiveTab('favorites'); setSelectedRecipe(null);}} icon={<Heart />} label="Salvos" />
          <NavButton active={activeTab === 'profile'} onClick={() => {setActiveTab('profile'); setSelectedRecipe(null);}} icon={<User />} label="Perfil" />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${active ? 'text-orange-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${active ? 'fill-orange-500/10' : ''}` })}
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    {active && <div className="absolute -bottom-2 w-1 h-1 bg-orange-500 rounded-full" />}
  </button>
);

export default App;
