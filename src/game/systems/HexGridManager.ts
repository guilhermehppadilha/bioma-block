export interface HexCoord {
    q: number;
    r: number;
}

export interface HexClearResult {
    clearedCells: HexCoord[];
    energyGenerated: number;
    comboMultiplier: number;
    isPureBiome: boolean;
}

export class HexGridManager {
    private grid: Map<string, number> = new Map();
    private radius: number;
    private comboStreak: number = 0;

    constructor(radius: number = 4) {
        this.generateHexagonalIsland(radius);
    }

    private generateHexagonalIsland(radius: number) {
        for (let q = -radius; q <= radius; q++) {
            let r1 = Math.max(-radius, -q - radius);
            let r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                this.grid.set(`${q},${r}`, 0);
            }
        }
    }

    public getGrid(): Map<string, number> {
        return this.grid;
    }

    public canPlacePiece(shape: HexCoord[], targetQ: number, targetR: number): boolean {
        for (const hex of shape) {
            const q = targetQ + hex.q;
            const r = targetR + hex.r;
            const key = `${q},${r}`;

            if (!this.grid.has(key)) return false; // Fora do mapa
            if (this.grid.get(key) !== 0) return false; // Espaço ocupado
        }
        return true;
    }

    public placePiece(shape: HexCoord[], targetQ: number, targetR: number, biomeId: number): number {
        let blocksPlaced = 0;
        for (const hex of shape) {
            this.grid.set(`${targetQ + hex.q},${targetR + hex.r}`, biomeId);
            blocksPlaced++;
        }
        return blocksPlaced;
    }

    public checkAndClear(): HexClearResult {
        const cellsToClear = new Set<string>();
        let linesClearedCount = 0;
        let isPureBiome = false;

        const qLines: Record<number, string[]> = {};
        const rLines: Record<number, string[]> = {};
        const sLines: Record<number, string[]> = {};

        // Agrupa as células por eixo (S = -Q - R)
        for (const key of this.grid.keys()) {
            const [q, r] = key.split(',').map(Number);
            const s = -q - r;

            if (!qLines[q]) qLines[q] = [];
            if (!rLines[r]) rLines[r] = [];
            if (!sLines[s]) sLines[s] = [];

            qLines[q].push(key);
            rLines[r].push(key);
            sLines[s].push(key);
        }

        const checkAxisForFullLines = (lines: Record<number, string[]>) => {
            for (const axisValue in lines) {
                const lineKeys = lines[axisValue];
                if (lineKeys.length <= 3) continue;

                let isFull = true;
                const biomesInLine = new Set<number>();

                for (const key of lineKeys) {
                    const cellBiome = this.grid.get(key);
                    if (cellBiome === 0 || cellBiome === undefined) {
                        isFull = false;
                        break;
                    }
                    biomesInLine.add(cellBiome);
                }

                if (isFull) {
                    linesClearedCount++;
                    lineKeys.forEach(k => cellsToClear.add(k));
                    if (biomesInLine.size === 1) isPureBiome = true;
                }
            }
        };

        checkAxisForFullLines(qLines);
        checkAxisForFullLines(rLines);
        checkAxisForFullLines(sLines);

        const result: HexClearResult = {
            clearedCells: [],
            energyGenerated: 0,
            comboMultiplier: 0,
            isPureBiome: false
        };

        if (cellsToClear.size > 0) {
            this.comboStreak++;
            cellsToClear.forEach(key => {
                const [q, r] = key.split(',').map(Number);
                this.grid.set(key, 0);
                result.clearedCells.push({ q, r });
            });

            result.comboMultiplier = this.comboStreak;
            result.isPureBiome = isPureBiome;
            
            let baseEnergy = linesClearedCount * 18;
            if (isPureBiome) baseEnergy *= 3;
            
            result.energyGenerated = baseEnergy * this.comboStreak;
        } else {
            this.comboStreak = 0;
        }

        return result;
    }

    public getBoardState() {
        let totalCells = 0;
        let occupiedCells = 0;

        this.grid.forEach((cellValue) => {
            totalCells++;

            if (cellValue !== null && cellValue !== undefined && cellValue !== -1) {
                occupiedCells++;
            }
        });

        return {
            totalCells,
            occupiedCells,
            occupancyRate: totalCells > 0 ? occupiedCells / totalCells : 0,
            grid: this.grid 
        };
    }

    public isGameOver(availableShapes: HexCoord[][]): boolean {
        if (availableShapes.length === 0) return false;

        for (const shape of availableShapes) {
            let canFit = false;
            for (const key of this.grid.keys()) {
                const [q, r] = key.split(',').map(Number);
                if (this.canPlacePiece(shape, q, r)) {
                    canFit = true;
                    break;
                }
            }
            if (canFit) return false;
        }
        return true; 
    }
}