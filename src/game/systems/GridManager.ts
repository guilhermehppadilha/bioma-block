export interface ClearResult {
    clearedCells: { row: number; col: number }[];
    energyGenerated: number;
    comboMultiplier: number;
}

export class GridManager {
    private grid: number[][];
    private readonly ROWS = 9;
    private readonly COLS = 9;
    private comboStreak = 0;

    constructor() {
        this.grid = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(0));
    }

    public getGrid(): number[][] {
        return this.grid;
    }

    public canPlacePiece(shape: number[][], startRow: number, startCol: number): boolean {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] !== 0) {
                    const targetRow = startRow + r;
                    const targetCol = startCol + c;

                    if (targetRow < 0 || targetRow >= this.ROWS || targetCol < 0 || targetCol >= this.COLS) {
                        return false;
                    }

                    if (this.grid[targetRow][targetCol] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public placePiece(shape: number[][], startRow: number, startCol: number, biomeId: number): number {
        let blocksPlacedCount = 0;
        
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] !== 0) {
                    this.grid[startRow + r][startCol + c] = biomeId;
                    blocksPlacedCount++;
                }
            }
        }
        
        return blocksPlacedCount;
    }


    public checkAndClear(): ClearResult {
        const cellsToClear = new Set<string>();
        let linesClearedCount = 0;

        for (let r = 0; r < this.ROWS; r++) {
            if (this.grid[r].every(cell => cell !== 0)) {
                linesClearedCount++;
                for (let c = 0; c < this.COLS; c++) cellsToClear.add(`${r},${c}`);
            }
        }

        for (let c = 0; c < this.COLS; c++) {
            let isFull = true;
            for (let r = 0; r < this.ROWS; r++) {
                if (this.grid[r][c] === 0) isFull = false;
            }
            if (isFull) {
                linesClearedCount++;
                for (let r = 0; r < this.ROWS; r++) cellsToClear.add(`${r},${c}`);
            }
        }

        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                let isFull = true;
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        if (this.grid[boxRow * 3 + r][boxCol * 3 + c] === 0) isFull = false;
                    }
                }
                if (isFull) {
                    linesClearedCount++;
                    for (let r = 0; r < 3; r++) {
                        for (let c = 0; c < 3; c++) {
                            cellsToClear.add(`${boxRow * 3 + r},${boxCol * 3 + c}`);
                        }
                    }
                }
            }
        }

        const result: ClearResult = {
            clearedCells: [],
            energyGenerated: 0,
            comboMultiplier: 0
        };

        if (cellsToClear.size > 0) {
            this.comboStreak++;
            
            cellsToClear.forEach(coord => {
                const [row, col] = coord.split(',').map(Number);
                this.grid[row][col] = 0;
                result.clearedCells.push({ row, col });
            });

            result.comboMultiplier = this.comboStreak;
            result.energyGenerated = (linesClearedCount * 18) * this.comboStreak;
        } else {
            this.comboStreak = 0;
        }

        return result;
    }

    public isGameOver(availableShapes: number[][][]): boolean {
        if (availableShapes.length === 0) return false;

        for (const shape of availableShapes) {
            let canFit = false;
            for (let r = 0; r < this.ROWS; r++) {
                for (let c = 0; c < this.COLS; c++) {
                    if (this.canPlacePiece(shape, r, c)) {
                        canFit = true;
                        break;
                    }
                }
                if (canFit) break;
            }
            
            if (canFit) return false;
        }

        return true; 
    }
}