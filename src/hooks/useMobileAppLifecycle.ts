import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useUIStore } from '../store/useUIStore';
import { EventBus, GameEvents } from '@/game/events/EventBus';

export function useMobileAppLifecycle() {
    const setScreen = useUIStore((state) => state.setScreen);

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        const listener = App.addListener('appStateChange', ({ isActive }) => {
            if (!isActive) {
                setScreen('PAUSED');
                EventBus.emit(GameEvents.PAUSE_GAME);
            }
        });

        return () => {
            listener.then(sub => sub.remove());
        };
    }, [setScreen]);
}