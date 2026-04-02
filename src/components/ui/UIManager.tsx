import React, { useEffect } from 'react';
import { Pause } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { MainMenu } from './MainMenu';
import { PauseMenu } from './PauseMenu';
import { GameOverMenu } from './GameOverMenu'; // <--- NOVO
import { HUD } from './HUD';
import { EventBus, GameEvents } from '@/game/events/EventBus';
import { PokiService } from '@/game/systems/PokiService';

export const UIManager: React.FC = () => {
    const currentScreen = useUIStore((state) => state.currentScreen);
    const setScreen = useUIStore((state) => state.setScreen);

    // Conecta o Game Over do Phaser com a tela do React
    useEffect(() => {
        const onGameOver = () => {
            setScreen('GAME_OVER');
            PokiService.gameplayStop();
        };

        EventBus.on(GameEvents.GAME_OVER, onGameOver);
        return () => {
            EventBus.off(GameEvents.GAME_OVER, onGameOver);
        };
    }, [setScreen]);

    const handlePause = () => {
        setScreen('PAUSED');
        EventBus.emit(GameEvents.PAUSE_GAME);
        PokiService.gameplayStop();
    };

    return (
        <>
            {currentScreen === 'MAIN_MENU' && <MainMenu />}

            {(currentScreen === 'PLAYING' || currentScreen === 'PAUSED' || currentScreen === 'GAME_OVER') && (
                <div className="absolute inset-0 pointer-events-none z-10">
                    <HUD />
                    
                    {currentScreen === 'PLAYING' && (
                        <div className="absolute top-0 right-0 p-4 pointer-events-none">
                            <button 
                                onClick={handlePause}
                                className="pointer-events-auto bg-black/50 p-3 rounded-full text-white hover:bg-black/70 active:scale-90 backdrop-blur-sm transition-transform"
                            >
                                <Pause size={24} fill="currentColor" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {currentScreen === 'PAUSED' && <PauseMenu />}
            {currentScreen === 'GAME_OVER' && <GameOverMenu />}
        </>
    );
};