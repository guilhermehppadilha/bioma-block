import React from 'react';
import { Pause } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { MainMenu } from './MainMenu';
import { PauseMenu } from './PauseMenu';
import { EventBus, GameEvents } from '@/game/events/EventBus';
import { PokiService } from '@/game/systems/PokiService';

export const UIManager: React.FC = () => {
    const currentScreen = useUIStore((state) => state.currentScreen);
    const setScreen = useUIStore((state) => state.setScreen);

    const handleStartGame = () => {
        setScreen('PLAYING');
        EventBus.emit(GameEvents.START_GAME); 
        PokiService.gameplayStart();
    };

    const handlePause = () => {
        setScreen('PAUSED');
        EventBus.emit(GameEvents.PAUSE_GAME);
        PokiService.gameplayStop();
    };

    return (
        <>
            {currentScreen === 'MAIN_MENU' && <MainMenu />}

            {currentScreen === 'PLAYING' && (
                <div className="absolute top-0 left-0 w-full p-4 flex justify-end z-10 pointer-events-none">
                    <button 
                        onClick={handlePause}
                        className="pointer-events-auto bg-black/50 p-2 rounded-full text-white hover:bg-black/70 active:scale-90 backdrop-blur-sm"
                    >
                        <Pause size={24} fill="currentColor" />
                    </button>
                </div>
            )}

            {currentScreen === 'PAUSED' && <PauseMenu />}
        </>
    );
};