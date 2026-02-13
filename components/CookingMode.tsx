
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Clock, CheckCircle2, RotateCcw, Play, Pause, AlertCircle, Utensils } from 'lucide-react';
import { Recipe } from '../types.ts';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
  isLargeText: boolean;
  isDarkMode: boolean;
}

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose, isLargeText, isDarkMode }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const currentStep = recipe.steps[currentStepIndex];

  useEffect(() => {
    if (currentStep.timerSeconds) {
      setTimer(currentStep.timerSeconds);
    } else {
      setTimer(null);
    }
    setIsTimerRunning(false);
  }, [currentStepIndex, currentStep.timerSeconds]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const progress = ((currentStepIndex + 1) / recipe.steps.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 z-[60] flex flex-col transition-colors ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <div className={`p-6 flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md hidden sm:block">
            <img src={recipe.imageUrl} className="w-full h-full object-cover" alt={recipe.title} />
          </div>
          <div>
            <h2 className="font-bold text-lg font-serif">{recipe.title}</h2>
            <p className="text-sm opacity-50">Passo {currentStepIndex + 1} de {recipe.steps.length}</p>
          </div>
        </div>
        <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div 
          className="h-full bg-orange-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-500">
            <div className="flex items-center gap-3 text-orange-500">
              <span className="text-6xl font-black font-serif opacity-20">{currentStepIndex + 1}</span>
              <div className="h-0.5 flex-1 bg-orange-500/20" />
            </div>
            
            <h3 className={`font-medium leading-snug tracking-tight ${isLargeText ? 'text-4xl' : 'text-3xl'}`}>
              {currentStep.description}
            </h3>

            {timer !== null && (
              <div className={`p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-xl'}`}>
                <div className={`text-6xl font-mono font-bold ${timer === 0 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                  {formatTime(timer)}
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform active:scale-90 ${isTimerRunning ? 'bg-slate-200 text-slate-700' : 'bg-orange-500 text-white'}`}
                  >
                    {isTimerRunning ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
                  </button>
                  <button 
                    onClick={() => { setTimer(currentStep.timerSeconds!); setIsTimerRunning(false); }}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-200 text-slate-700 shadow-lg active:scale-90"
                  >
                    <RotateCcw />
                  </button>
                </div>
                {timer === 0 && (
                  <p className="text-red-500 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Tempo esgotado!
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:block space-y-6">
            <div className={`p-8 rounded-[2rem] border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-orange-50/50 border-orange-100'}`}>
              <h4 className="font-bold flex items-center gap-2 mb-4 text-orange-600">
                <Utensils className="w-5 h-5" />
                Dica do Passo
              </h4>
              <p className="opacity-70 leading-relaxed italic">
                "{currentStep.description.length > 50 ? 'Certifique-se de seguir as medidas exatas para um resultado perfeito.' : 'Mantenha o foco nesta etapa, ela é crucial para a textura final.'}"
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Controls */}
      <div className={`p-6 sm:p-10 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} flex justify-between items-center bg-inherit`}>
        <button 
          onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
          disabled={currentStepIndex === 0}
          className={`flex items-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all ${currentStepIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        >
          <ChevronLeft /> Anterior
        </button>

        {currentStepIndex === recipe.steps.length - 1 ? (
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-green-600 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
          >
            <CheckCircle2 /> Finalizar Receita
          </button>
        ) : (
          <button 
            onClick={() => setCurrentStepIndex(prev => Math.min(recipe.steps.length - 1, prev + 1))}
            className="flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            Próximo Passo <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default CookingMode;
