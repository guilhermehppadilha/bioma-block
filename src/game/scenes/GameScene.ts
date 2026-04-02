import { Scene } from 'phaser';
import { EventBus, GameEvents } from '@/game/events/EventBus';
import { HexGridManager, HexCoord } from '@/game/systems/HexGridManager';
import { GameConstants } from '@/game/config/GameConstants';
import { ContinentsDB, ContinentConfig } from '@/game/data/ContinentsData';
import { BiomeBlock } from '@/game/prefabs/BiomeBlock';

const availableHexShapes: HexCoord[][] = [
    [{ q: 0, r: 0 }],
    [{ q: 0, r: 0 }, { q: 1, r: 0 }],
    [{ q: 0, r: 0 }, { q: 1, r: -1 }, { q: 1, r: 0 }],
    [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }]
];

export class GameScene extends Scene {
    private hexManager!: HexGridManager;
    private visualGrid: Map<string, Phaser.GameObjects.Polygon> = new Map();
    private activePieces: BiomeBlock[] = [];
    private currentContinent!: ContinentConfig;

    private boardCenterX!: number;
    private boardCenterY!: number;

    // ✅ OTIMIZAÇÃO: Lista pré-criada de polígonos para a sombra (Evita usar Graphics para manter paridade visual)
    private shadowHexes: Phaser.GameObjects.Polygon[] = [];

    private onPauseHandler = () => { if (this.scene.isActive()) this.scene.pause(); };
    private onResumeHandler = () => { if (this.scene.isPaused()) this.scene.resume(); };
    private onQuitHandler = () => { this.scene.stop(); };
    private onRestartHandler = () => { this.scene.restart(); };

    constructor() {
        super('GameScene');
    }

    init() {
        this.currentContinent = ContinentsDB['south_america'];
        this.boardCenterX = this.cameras.main.width / 2;
        this.boardCenterY = this.cameras.main.height * 0.35;
    }

    create() {
        this.hexManager = new HexGridManager(4);

        // ✅ INICIALIZA O POOL DE SOMBRAS (Cria até 5 hexágonos invisíveis para uso simultâneo)
        const hexPoints = this.getHexPolygonPoints();
        for (let i = 0; i < 5; i++) {
            const shadowPoly = this.add.polygon(0, 0, hexPoints, 0xffffff, 0.4);
            shadowPoly.setStrokeStyle(2, 0xffffff, 0.8);
            shadowPoly.setDepth(10);
            shadowPoly.setVisible(false);
            this.shadowHexes.push(shadowPoly);
        }

        this.drawIsland();
        this.spawnPieces();
        this.setupDragEvents();

        EventBus.emit(GameEvents.SCENE_READY, this);

        EventBus.on(GameEvents.PAUSE_GAME, this.onPauseHandler);
        EventBus.on(GameEvents.RESUME_GAME, this.onResumeHandler);
        EventBus.on(GameEvents.QUIT_TO_MENU, this.onQuitHandler);
        EventBus.on(GameEvents.RESTART_GAME, this.onRestartHandler);
        
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            EventBus.off(GameEvents.PAUSE_GAME, this.onPauseHandler);
            EventBus.off(GameEvents.RESUME_GAME, this.onResumeHandler);
            EventBus.off(GameEvents.QUIT_TO_MENU, this.onQuitHandler);
            EventBus.off(GameEvents.RESTART_GAME, this.onRestartHandler);
        });
    }

    private getHexPolygonPoints(): number[] {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle_deg = 60 * i - 30;
            const angle_rad = Math.PI / 180 * angle_deg;
            points.push((GameConstants.HEX_SIZE - 2) * Math.cos(angle_rad));
            points.push((GameConstants.HEX_SIZE - 2) * Math.sin(angle_rad));
        }
        return points;
    }

    private axialToPixel(q: number, r: number): { x: number, y: number } {
        const x = this.boardCenterX + GameConstants.HEX_SIZE * Math.sqrt(3) * (q + r / 2);
        const y = this.boardCenterY + GameConstants.HEX_SIZE * (3 / 2) * r;
        return { x, y };
    }

    private pixelToAxial(px: number, py: number): { q: number, r: number } {
        const ptX = (px - this.boardCenterX) / GameConstants.HEX_SIZE;
        const ptY = (py - this.boardCenterY) / GameConstants.HEX_SIZE;
        
        const q = (Math.sqrt(3) / 3 * ptX - 1 / 3 * ptY);
        const r = (2 / 3 * ptY);
        
        return this.axialRound(q, r, -q - r);
    }

    private axialRound(fq: number, fr: number, fs: number): { q: number, r: number } {
        let q = Math.round(fq);
        let r = Math.round(fr);
        let s = Math.round(fs);

        const q_diff = Math.abs(q - fq);
        const r_diff = Math.abs(r - fr);
        const s_diff = Math.abs(s - fs);

        if (q_diff > r_diff && q_diff > s_diff) {
            q = -r - s;
        } else if (r_diff > s_diff) {
            r = -q - s;
        }

        return { q, r };
    }

    private drawIsland() {
        const hexPoints = this.getHexPolygonPoints();
        const gridData = this.hexManager.getGrid();

        gridData.forEach((_, key) => {
            const [q, r] = key.split(',').map(Number);
            const { x, y } = this.axialToPixel(q, r);

            const bgHex = this.add.polygon(x, y, hexPoints, GameConstants.BIOME_COLORS[0]);
            bgHex.setStrokeStyle(1, 0x334155);
        });
    }

    private spawnPieces() {
        const screenWidth = this.cameras.main.width;
        const spawnY = this.cameras.main.height - 150;

        for (let i = 0; i < 3; i++) {
            const randomShape = availableHexShapes[Phaser.Math.Between(0, availableHexShapes.length - 1)];
            const availableBiomes = Object.keys(this.currentContinent.biomes).map(Number);
            const randomBiome = availableBiomes[Phaser.Math.Between(0, availableBiomes.length - 1)];
            
            const startX = (screenWidth / 4) * (i + 1); 
            
            const piece = new BiomeBlock(this, startX, spawnY, randomShape, randomBiome, this.currentContinent);
            piece.setScale(0.8);
            this.activePieces.push(piece);
        }

        if (this.hexManager.isGameOver(this.activePieces.map(p => p.shape))) {
            this.evaluateBoardState();
        }
    }

    private setupDragEvents() {
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: BiomeBlock) => {
            this.children.bringToTop(gameObject);
            
            const currentScale = gameObject.scale;
            const diffX = pointer.worldX - gameObject.x;
            const diffY = pointer.worldY - gameObject.y;

            gameObject.setData('dragData', { 
                localX: diffX / currentScale, 
                localY: diffY / currentScale 
            });

            this.tweens.add({ targets: gameObject, scale: 1.0, duration: 80, ease: 'Sine.easeOut' });
        });

        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: BiomeBlock) => {
            const data = gameObject.getData('dragData');
            if (!data) return;
            
            // ✅ CORREÇÃO CHAVE: Posição "Lógica" vs Posição "Visual"
            // logicalX/Y é onde o seu dedo DE FATO está segurando a peça na matemática do jogo
            const logicalX = pointer.worldX - (data.localX * gameObject.scaleX);
            const logicalY = pointer.worldY - (data.localY * gameObject.scaleY);

            // A imagem visual é elevada (-60), mas não afeta mais o cálculo do grid!
            gameObject.x = logicalX;
            gameObject.y = logicalY - 60; 

            const collisionRadius = GameConstants.HEX_SIZE; 
            const overlapThreshold = 0.40; 
            const biasX = collisionRadius * overlapThreshold;
            const biasY = collisionRadius * overlapThreshold;

            // Consultamos o grid a partir da posição lógica (do seu dedo)
            const queryX = logicalX + biasX;
            const queryY = logicalY + biasY;

            const { q, r } = this.pixelToAxial(queryX, queryY);
            
            // Oculta todas as sombras inicialmente
            this.shadowHexes.forEach(h => h.setVisible(false));

            if (this.hexManager.canPlacePiece(gameObject.shape, q, r)) {
                gameObject.setData('validSnap', { q, r });
                
                // Reposiciona as sombras corretas e as torna visíveis
                gameObject.shape.forEach((hex, index) => {
                    if (this.shadowHexes[index]) {
                        const { x, y } = this.axialToPixel(q + hex.q, r + hex.r);
                        this.shadowHexes[index].setPosition(x, y);
                        this.shadowHexes[index].setVisible(true);
                    }
                });
            } else {
                gameObject.setData('validSnap', null);
            }
        });

        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: BiomeBlock) => {
            // Limpa as sombras ao soltar
            this.shadowHexes.forEach(h => h.setVisible(false));
            
            gameObject.setScale(1.0);
            const snap = gameObject.getData('validSnap');

            if (snap) {
                const placementEnergy = this.hexManager.placePiece(gameObject.shape, snap.q, snap.r, gameObject.biomeId);
                this.lockPieceToBoard(gameObject.shape, snap.q, snap.r, gameObject.biomeId);
                
                gameObject.disableInteractive();
                gameObject.setVisible(false);
                this.activePieces = this.activePieces.filter(p => p !== gameObject);
                
                this.time.delayedCall(10, () => gameObject.destroy());
                this.handleClears(placementEnergy);

                if (this.activePieces.length === 0) {
                    this.spawnPieces();
                } else {
                    this.evaluateBoardState();
                }
            } else {
                gameObject.returnToOrigin();
            }
        });
    }

    private lockPieceToBoard(shape: HexCoord[], startQ: number, startR: number, biomeId: number) {
        const color = this.currentContinent.biomes[biomeId].color;
        const hexPoints = this.getHexPolygonPoints();

        shape.forEach(hex => {
            const q = startQ + hex.q;
            const r = startR + hex.r;
            const key = `${q},${r}`;

            const { x, y } = this.axialToPixel(q, r);

            // Como as sombras e as peças trancadas usam o mesmo .polygon(), o alinhamento é matematicamente idêntico
            const fixedHex = this.add.polygon(x, y, hexPoints, color);
            this.visualGrid.set(key, fixedHex);
        });
    }

    private handleClears(placementEnergy: number) {
        const clearResult = this.hexManager.checkAndClear();
        const totalTurnEnergy = placementEnergy + clearResult.energyGenerated;

        if (clearResult.clearedCells.length > 0) {
            clearResult.clearedCells.forEach(coord => {
                const key = `${coord.q},${coord.r}`;
                const visualHex = this.visualGrid.get(key);
                
                if (visualHex) {
                    this.tweens.add({
                        targets: visualHex,
                        scale: 0,
                        duration: 300,
                        ease: 'Back.easeIn',
                        onComplete: () => visualHex.destroy()
                    });
                    this.visualGrid.delete(key);
                }
            });
        }
        
        EventBus.emit(GameEvents.SCORE_UPDATED, { 
            score: totalTurnEnergy, 
            multiplier: clearResult.comboMultiplier 
        });
    }

    private evaluateBoardState() {
        const currentShapes = this.activePieces.map(p => p.shape);

        if (this.hexManager.isGameOver(currentShapes)) {
            this.triggerGameOver();
        }
    }

    private triggerGameOver() {
        this.input.enabled = false; 

        this.cameras.main.fadeOut(1000, 0, 0, 0, (camera: any, progress: number) => {
            if (progress === 1) {
                EventBus.emit(GameEvents.GAME_OVER);
            }
        });
    }
}