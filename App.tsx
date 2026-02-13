
import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Search, 
  Heart, 
  Plus, 
  User, 
  Clock, 
  ChevronRight, 
  ChefHat, 
  Flame,
  ArrowLeft,
  Moon,
  Sun,
  Type as TypeIcon,
  ShoppingCart,
  Sparkles,
  Filter,
  X
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

  // Suggestion State
  const [ingredientInputs, setIngredientInputs] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('bg-slate-900', 'text-white');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    } else {
      document.body.classList.remove('bg-slate-900', 'text-white');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
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

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || r.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Todos' || r.difficulty === selectedDifficulty;
    const matchesTime = r.prepTimeMinutes <= maxPrepTime;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesTime;
  });

  const displayRecipes = activeTab === 'favorites' 
    ? filteredRecipes.filter(r => r.isFavorite) 
    : filteredRecipes;

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
    <div className={`min-h-screen pb-24 ${isLargeText ? 'text-lg' : 'text-base'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 transition-colors ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md border-b px-4 py-4`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setActiveTab('home'); setSelectedRecipe(null);}}>
            <div className="p-2 bg-orange-500 rounded-xl">
              <Utensils className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-serif hidden sm:block">Cozinha Inteligente</h1>
          </div>
          
          <div className="flex-1 max-w-md mx-4">
            <div className={`relative flex items-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-full px-4 py-2`}>
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar receitas..." 
                className="bg-transparent border-none outline-none w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsLargeText(!isLargeText)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
              title="Aumentar Fonte"
            >
              <TypeIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
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
          <>
            {activeTab === 'home' && (
              <div className="space-y-8">
                {/* Filters Section */}
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold font-serif">Explore Receitas</h2>
                      <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Encontre sua próxima refeição favorita</p>
                    </div>
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${showFilters ? 'bg-orange-500 text-white' : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white shadow-sm border border-slate-200'}`}
                    >
                      <Filter className="w-4 h-4" />
                      Filtros
                    </button>
                  </div>

                  {/* Horizontal Category Scroll */}
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['Todos', ...Object.values(Category)].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat as Category | 'Todos')}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                          selectedCategory === cat 
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                            : isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-slate-500 hover:bg-orange-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Advanced Filters Drawer */}
                  {showFilters && (
                    <div className={`p-6 rounded-3xl border animate-in slide-in-from-top-4 duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Dificuldade</label>
                          <div className="flex flex-wrap gap-2">
                            {['Todos', ...Object.values(Difficulty)].map((diff) => (
                              <button
                                key={diff}
                                onClick={() => setSelectedDifficulty(diff as Difficulty | 'Todos')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                  selectedDifficulty === diff 
                                    ? 'bg-orange-100 text-orange-600' 
                                    : isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-50 text-slate-500'
                                }`}
                              >
                                {diff}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex justify-between">
                            Tempo Máximo <span>{maxPrepTime} min</span>
                          </label>
                          <input 
                            type="range" 
                            min="5" 
                            max="120" 
                            step="5"
                            value={maxPrepTime}
                            onChange={(e) => setMaxPrepTime(Number(e.target.value))}
                            className="w-full accent-orange-500"
                          />
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                            <span>5 MIN</span>
                            <span>60 MIN</span>
                            <span>120+ MIN</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-100/10 flex justify-end">
                        <button 
                          onClick={() => {
                            setSelectedDifficulty('Todos');
                            setMaxPrepTime(120);
                            setSelectedCategory('Todos');
                          }}
                          className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Limpar Filtros
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayRecipes.map(recipe => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        onClick={() => setSelectedRecipe(recipe)}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                    <button 
                      onClick={() => setActiveTab('create')}
                      className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl transition-all ${isDarkMode ? 'border-slate-700 hover:border-orange-500 hover:bg-slate-800' : 'border-slate-200 hover:border-orange-500 hover:bg-orange-50'}`}
                    >
                      <Plus className="w-12 h-12 text-orange-500 mb-2" />
                      <span className="font-semibold">Adicionar Receita</span>
                    </button>
                  </div>

                  {displayRecipes.length === 0 && (
                    <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold">Nenhuma receita encontrada com esses filtros.</p>
                      <button 
                        onClick={() => {
                          setSelectedCategory('Todos');
                          setSelectedDifficulty('Todos');
                          setMaxPrepTime(120);
                          setSearchQuery('');
                        }}
                        className="mt-4 text-orange-500 font-bold text-sm"
                      >
                        Resetar todos os filtros
                      </button>
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === 'favorites' && (
              <section>
                <h2 className="text-3xl font-bold font-serif mb-6">Suas Favoritas</h2>
                {displayRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayRecipes.map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} isDarkMode={isDarkMode} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Você ainda não favoritou nenhuma receita que corresponda aos filtros atuais.</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'create' && (
              <RecipeForm 
                onSave={(newRecipe) => {
                  setRecipes(prev => [...prev, { ...newRecipe, id: Date.now().toString(), isFavorite: false }]);
                  setActiveTab('home');
                }}
                onCancel={() => setActiveTab('home')}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'suggestions' && (
              <div className="max-w-2xl mx-auto space-y-8">
                <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                  <div className="flex items-center gap-3 mb-4 text-orange-500">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-xl font-bold">O que tem na geladeira?</h2>
                  </div>
                  <p className="text-sm mb-4 opacity-70">Digite os ingredientes que você tem (separados por vírgula) e o Gemini sugerirá receitas incríveis.</p>
                  <textarea 
                    placeholder="Ex: ovo, arroz, tomate, frango..."
                    className={`w-full p-4 rounded-2xl border-2 transition-all outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`}
                    rows={3}
                    value={ingredientInputs}
                    onChange={(e) => setIngredientInputs(e.target.value)}
                  />
                  <button 
                    disabled={loadingSuggestions}
                    onClick={handleSuggest}
                    className="w-full mt-4 bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {loadingSuggestions ? 'Gerando ideias...' : 'Sugerir Receitas'}
                  </button>
                </div>

                {aiSuggestions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Sugestões para você:</h3>
                    {aiSuggestions.map((s, idx) => (
                      <div key={idx} className={`p-6 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold text-orange-500">{s.title}</h4>
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">{s.time}</span>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed">{s.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-xl mx-auto text-center space-y-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                    <User className="w-16 h-16 text-orange-500" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Chef Amador</h2>
                  <p className="text-slate-500">cozinheiro@exemplo.com</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Receitas Criadas</p>
                    <p className="text-xl font-bold">{recipes.filter(r => r.author === 'Você').length + 12}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Cozinhadas</p>
                    <p className="text-xl font-bold">45</p>
                  </div>
                </div>

                {shoppingList.length > 0 && (
                  <div className={`p-6 rounded-3xl text-left ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                    <h3 className="flex items-center gap-2 font-bold mb-4">
                      <ShoppingCart className="w-5 h-5 text-orange-500" />
                      Lista de Compras
                    </h3>
                    <ul className="space-y-2">
                      {shoppingList.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setShoppingList([])}
                      className="mt-4 text-xs text-red-500 font-bold"
                    >
                      Limpar Lista
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-t px-6 py-3 pb-6 flex items-center justify-around`}>
        <NavButton active={activeTab === 'home'} onClick={() => {setActiveTab('home'); setSelectedRecipe(null);}} icon={<Utensils />} label="Home" />
        <NavButton active={activeTab === 'suggestions'} onClick={() => {setActiveTab('suggestions'); setSelectedRecipe(null);}} icon={<Sparkles />} label="Ideias" />
        <NavButton active={activeTab === 'favorites'} onClick={() => {setActiveTab('favorites'); setSelectedRecipe(null);}} icon={<Heart />} label="Salvos" />
        <NavButton active={activeTab === 'profile'} onClick={() => {setActiveTab('profile'); setSelectedRecipe(null);}} icon={<User />} label="Perfil" />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-orange-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
