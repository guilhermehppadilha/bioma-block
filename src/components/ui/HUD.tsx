import { useGameStore } from '@/store/useGameStore';
import { useGameEvent } from '@/hooks/useGameEvent';
import { GameEvents, IScorePayload } from '@/game/events/EventBus';

export const HUD = () => {
    const { energy, currentLevel, addEnergy } = useGameStore();

    useGameEvent(GameEvents.SCORE_UPDATED, (payload: IScorePayload) => {
        addEnergy(payload.score);
    });

    return (
        <div className="w-full p-4 flex justify-start gap-4 pointer-events-none">
            {/* Bloco de Energia */}
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl px-6 py-2 flex flex-col items-center pointer-events-auto shadow-lg">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Energia Vital</span>
                <span className="text-green-400 text-2xl font-black">{energy.toLocaleString('pt-BR')}</span>
            </div>

            {/* Bloco de Nível do Planeta */}
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl px-6 py-2 flex flex-col items-center pointer-events-auto shadow-lg">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Planeta</span>
                <span className="text-white text-2xl font-black">Nvl {currentLevel}</span>
            </div>
        </div>
    );
};