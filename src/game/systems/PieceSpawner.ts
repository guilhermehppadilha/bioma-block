import { Scene, Math as PhaserMath } from 'phaser';
import { HexGridManager } from '@/game/systems/HexGridManager';
import { BiomeBlock } from '@/game/prefabs/BiomeBlock';
import { ContinentConfig } from '@/game/data/ContinentsData';
import { PiecesDB, PieceDefinition, PieceDifficulty } from '@/game/data/PiecesData';

type DifficultyDistribution = Record<PieceDifficulty, number>;

const TensionProfiles = {
    RELAXED: { EASY: 40, MEDIUM: 40, HARD: 20, NIGHTMARE: 0 } as DifficultyDistribution,
    NORMAL: { EASY: 15, MEDIUM: 45, HARD: 30, NIGHTMARE: 10 } as DifficultyDistribution,
    CRITICAL: { EASY: 5, MEDIUM: 25, HARD: 40, NIGHTMARE: 30 } as DifficultyDistribution
};

export interface QueuedPiece {
    definition: PieceDefinition;
    biome: number;
}

export class PieceSpawner {
    private scene: Scene;
    private continentConfig: ContinentConfig;
    private piecePoolByDifficulty: Record<PieceDifficulty, PieceDefinition[]>;

    private nextBatchQueue: QueuedPiece[] = [];

    constructor(scene: Scene, continentConfig: ContinentConfig) {
        this.scene = scene;
        this.continentConfig = continentConfig;
        
        this.piecePoolByDifficulty = {
            EASY: PiecesDB.filter(p => p.difficulty === 'EASY' && p.tags.includes('standard')),
            MEDIUM: PiecesDB.filter(p => p.difficulty === 'MEDIUM' && p.tags.includes('standard')),
            HARD: PiecesDB.filter(p => p.difficulty === 'HARD' && p.tags.includes('standard')),
            NIGHTMARE: PiecesDB.filter(p => p.difficulty === 'NIGHTMARE' && p.tags.includes('standard')),
        };
    }

    private getCurrentTensionProfile(gridManager: HexGridManager): DifficultyDistribution {
        const occupancy = 0.5; // TODO: Ligar com ocupação real depois
        if (occupancy < 0.3) return TensionProfiles.RELAXED;
        if (occupancy >= 0.7) return TensionProfiles.CRITICAL;
        return TensionProfiles.NORMAL;
    }

    private rollForDifficulty(distribution: DifficultyDistribution): PieceDifficulty {
        let randomValue = PhaserMath.Between(1, 100);
        let accumulatedWeight = 0;

        for (const [diff, weight] of Object.entries(distribution)) {
            accumulatedWeight += weight;
            if (randomValue <= accumulatedWeight) {
                return diff as PieceDifficulty;
            }
        }
        return 'MEDIUM'; 
    }

    private generateBatchData(gridManager: HexGridManager): QueuedPiece[] {
        const batch: QueuedPiece[] = [];
        const currentProfile = this.getCurrentTensionProfile(gridManager);
        const availableBiomes = Object.keys(this.continentConfig.biomes).map(Number);

        for (let i = 0; i < 3; i++) {
            const selectedDifficulty = this.rollForDifficulty(currentProfile);
            const pool = this.piecePoolByDifficulty[selectedDifficulty];
            const selectedPieceDef = pool[PhaserMath.Between(0, pool.length - 1)];
            
            const lockedBiome = availableBiomes[PhaserMath.Between(0, availableBiomes.length - 1)];
            
            batch.push({
                definition: selectedPieceDef,
                biome: lockedBiome
            });
        }
        return batch;
    }

    public initializeFirstHands(gridManager: HexGridManager): BiomeBlock[] {
        this.nextBatchQueue = this.generateBatchData(gridManager);
        return this.generateHand(gridManager); 
    }

    public generateHand(gridManager: HexGridManager): BiomeBlock[] {
        const newPieces: BiomeBlock[] = [];
        const screenWidth = this.scene.cameras.main.width;
        const spawnY = this.scene.cameras.main.height - 150;

        const currentBatch = [...this.nextBatchQueue];
        this.nextBatchQueue = this.generateBatchData(gridManager);

        for (let i = 0; i < 3; i++) {
            const queuedData = currentBatch[i];
            const startX = (screenWidth / 4) * (i + 1); 

            const piece = new BiomeBlock(
                this.scene, 
                startX, 
                spawnY, 
                queuedData.definition.coords, 
                queuedData.biome,
                this.continentConfig
            );
            
            piece.setData('pieceId', queuedData.definition.id);
            piece.setData('difficulty', queuedData.definition.difficulty);
            piece.setScale(0.8);
            newPieces.push(piece);
        }

        return newPieces;
    }

    public getNextBatchPreview(): QueuedPiece[] {
        return this.nextBatchQueue;
    }
}