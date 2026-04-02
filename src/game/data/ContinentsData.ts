export interface BiomeConfig {
    id: number;
    name: string;
    color: number;
    unlockEnergy: number;
}

export interface ContinentConfig {
    id: string;
    name: string;
    biomes: Record<number, BiomeConfig>;
}

export const ContinentsDB: Record<string, ContinentConfig> = {
    'south_america': {
        id: 'south_america',
        name: 'América do Sul',
        biomes: {
            1: { id: 1, name: 'Amazônia', color: 0x22c55e, unlockEnergy: 0 },
            2: { id: 2, name: 'Pantanal', color: 0x0ea5e9, unlockEnergy: 500 },
            3: { id: 3, name: 'Caatinga', color: 0xf59e0b, unlockEnergy: 1500 },
            4: { id: 4, name: 'Andes',    color: 0x94a3b8, unlockEnergy: 3000 }
        }
    },
    'africa': {
        id: 'africa',
        name: 'África',
        biomes: {
            101: { id: 101, name: 'Savana', color: 0xeab308, unlockEnergy: 0 },
            // ...
        }
    }
};