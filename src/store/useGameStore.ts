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

interface GameState {
    coins: number;
    // ...
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            coins: 0,
            // ...
        }),
        {
            name: 'game-storage',
            storage: createJSONStorage(() => safeLocalStorage),
        }
    )
);