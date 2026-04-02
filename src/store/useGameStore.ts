import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const safeLocalStorage = {
    getItem: (name: string) => {
        try {
            return localStorage.getItem(name);
        } catch (e) {
            console.warn('LocalStorage bloqueado, usando RAM.');
            return null;
        }
    },
    setItem: (name: string, value: string) => {
        try {
            localStorage.setItem(name, value);
        } catch (e) {
            console.warn('LocalStorage bloqueado, progresso não será salvo.');
        }
    },
    removeItem: (name: string) => {
        try {
            localStorage.removeItem(name);
        } catch (e) {}
    },
};

export interface GameState {
    energy: number;
    isMuted: boolean;
    currentLevel: number;
    addEnergy: (amount: number) => void;
    toggleMute: () => void;
    setLevel: (level: number) => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            energy: 0,
            isMuted: false,
            currentLevel: 1,
            addEnergy: (amount) => set((state) => ({ energy: state.energy + amount })),
            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
            setLevel: (level) => set({ currentLevel: level }),
        }),
        {
            name: 'biome-block-storage',
            storage: createJSONStorage(() => safeLocalStorage),
        }
    )
);