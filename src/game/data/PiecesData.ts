import { HexCoord } from '@/game/systems/HexGridManager';

export type PieceDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'NIGHTMARE';

export interface PieceDefinition {
    id: string;
    name: string;
    size: number;
    difficulty: PieceDifficulty;
    tags: string[];
    coords: HexCoord[];
}

export const PiecesDB: PieceDefinition[] = [
    // EASY (Monominós e Dominós)
    { id: 'dot', name: 'Ponto', size: 1, difficulty: 'EASY', tags: ['standard'], coords: [{ q: 0, r: 0 }] },
    { id: 'line_2', name: 'Linha Curta', size: 2, difficulty: 'EASY', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }] },

    // MEDIUM (Trominós)
    { id: 'line_3', name: 'Linha Média', size: 3, difficulty: 'MEDIUM', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }] },
    { id: 'triangle', name: 'Triângulo', size: 3, difficulty: 'MEDIUM', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 0, r: 1 }] },
    { id: 'boomerang', name: 'Bumerangue', size: 3, difficulty: 'MEDIUM', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 1, r: -1 }] },

    // HARD (Tetrominós)
    { id: 'line_4', name: 'Barra Longa', size: 4, difficulty: 'HARD', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }, { q: 3, r: 0 }] },
    { id: 'diamond', name: 'Diamante', size: 4, difficulty: 'HARD', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 1 }] },
    { id: 'pistol', name: 'Pistola', size: 4, difficulty: 'HARD', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }, { q: 2, r: -1 }] },
    { id: 'propeller', name: 'Hélice', size: 4, difficulty: 'HARD', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: -1 }] },

    // NIGHTMARE (Pentominós)
    { id: 'star', name: 'Estrela', size: 5, difficulty: 'NIGHTMARE', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: -1, r: 0 }, { q: 0, r: 1 }, { q: 0, r: -1 }] },
    { id: 'hook', name: 'Anzol', size: 5, difficulty: 'NIGHTMARE', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }, { q: 2, r: -1 }, { q: 2, r: -2 }] },
    { id: 'boat', name: 'Barco', size: 5, difficulty: 'NIGHTMARE', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }, { q: 0, r: -1 }, { q: 2, r: -1 }] },
    { id: 'snake', name: 'Cobra', size: 5, difficulty: 'NIGHTMARE', tags: ['standard'], coords: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 1, r: 1 }, { q: 2, r: 1 }, { q: 2, r: 2 }] }
];