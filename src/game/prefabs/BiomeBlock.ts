import Phaser from 'phaser';
import { GameConstants } from '@/game/config/GameConstants';
import { HexCoord } from '@/game/systems/HexGridManager';
import { ContinentConfig } from '@/game/data/ContinentsData';

export class BiomeBlock extends Phaser.GameObjects.Container {
    public shape: HexCoord[];
    public biomeId: number;
    public startX: number;
    public startY: number;
    private continentConfig: ContinentConfig;

    constructor(scene: Phaser.Scene, x: number, y: number, shape: HexCoord[], biomeId: number, continentConfig: ContinentConfig) {
        super(scene, x, y);
        this.shape = shape;
        this.biomeId = biomeId;
        this.startX = x;
        this.startY = y;
        this.continentConfig = continentConfig;

        this.buildVisualsAndHitArea();
        
        scene.add.existing(this);
        this.scene.input.setDraggable(this);
    }

    private buildVisualsAndHitArea() {
        const color = this.continentConfig.biomes[this.biomeId].color;
        const hitAreaCircles: Phaser.Geom.Circle[] = [];
        const touchRadius = GameConstants.HEX_SIZE * 1.05;

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

        this.shape.forEach((hex) => {
            const px = GameConstants.HEX_SIZE * Math.sqrt(3) * (hex.q + hex.r / 2);
            const py = GameConstants.HEX_SIZE * (3 / 2) * hex.r;

            minX = Math.min(minX, px);
            maxX = Math.max(maxX, px);
            minY = Math.min(minY, py);
            maxY = Math.max(maxY, py);

            const graphics = this.scene.add.graphics({ x: px, y: py });
            graphics.fillStyle(color, 1);
            graphics.lineStyle(2, 0xffffff, 0.4);

            graphics.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle_rad = (Math.PI / 180) * (60 * i - 30);
                const hx = (GameConstants.HEX_SIZE - 2) * Math.cos(angle_rad);
                const hy = (GameConstants.HEX_SIZE - 2) * Math.sin(angle_rad);
                if (i === 0) graphics.moveTo(hx, hy);
                else graphics.lineTo(hx, hy);
            }
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
            
            this.add(graphics);
            hitAreaCircles.push(new Phaser.Geom.Circle(px, py, touchRadius));
        });

        const broadWidth = (maxX - minX) + (GameConstants.HEX_SIZE * 2);
        const broadHeight = (maxY - minY) + (GameConstants.HEX_SIZE * 2);
        const broadArea = new Phaser.Geom.Rectangle(minX - GameConstants.HEX_SIZE, minY - GameConstants.HEX_SIZE, broadWidth, broadHeight);

        this.setInteractive({
            hitArea: broadArea,
            hitAreaCallback: (hitArea: Phaser.Geom.Rectangle, x: number, y: number) => {
                for (const circle of hitAreaCircles) {
                    if (Phaser.Geom.Circle.Contains(circle, x, y)) return true;
                }
                return false;
            },
            cursor: 'pointer'
        });
    }

    public returnToOrigin() {
        this.scene.tweens.add({
            targets: this,
            x: this.startX,
            y: this.startY,
            scale: 0.8,
            duration: 250,
            ease: 'Back.easeOut'
        });
    }
}