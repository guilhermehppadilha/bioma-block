import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useGameStore } from '@/store/useGameStore';
import { EventBus, GameEvents } from '@/game/events/EventBus';
import { RotateCcw, Home } from 'lucide-react';
// import { PokiService } from '@/game/systems/PokiService'; // Descomente depois para os anúncios

export const GameOverMenu: React.FC = () => {
    const setScreen = useUIStore((state) => state.setScreen);
    const energy = useGameStore((state) => state.energy);

    const handleRestart = () => {
        // Resetamos a energia/nível na store (se o GDD exigir que recomece do zero)
        useGameStore.setState({ energy: 0, currentLevel: 1 });
        
        setScreen('PLAYING');
        EventBus.emit(GameEvents.RESTART_GAME);
        
        // PokiService.commercialBreak(); // Exemplo de monetização no restart
    };

    const handleQuit = () => {
        setScreen('MAIN_MENU');
        EventBus.emit(GameEvents.QUIT_TO_MENU);
    };

    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto z-50">
            <h2 className="text-4xl font-black text-red-500 mb-2 uppercase tracking-widest">Game Over</h2>
            <p className="text-slate-300 mb-8 text-center px-8">O ecossistema entrou em colapso por falta de espaço vital.</p>

            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl mb-8 flex flex-col items-center min-w-[200px]">
                <span className="text-slate-400 text-sm font-bold uppercase">Energia Acumulada</span>
                <span className="text-green-400 text-3xl font-black">{energy.toLocaleString('pt-BR')}</span>
            </div>

            <div className="flex flex-col gap-4 w-64">
                <button 
                    onClick={handleRestart}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-full font-bold transition-transform active:scale-95"
                >
                    <RotateCcw size={20} />
                    Tentar Novamente
                </button>
                
                <button 
                    onClick={handleQuit}
                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-full font-bold transition-transform active:scale-95"
                >
                    <Home size={20} />
                    Menu Principal
                </button>
            </div>
        </div>
    );
};