import { Scene } from 'phaser';
import { FloatingText } from '@/game/prefabs/FloatingText';

export class FloatingTextManager {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Exibe a pontuação de uma linha limpa.
     */
    public showScore(x: number, y: number, score: number, isPure: boolean, delayOffset: number = 0) {
        const text = isPure ? `Puro!\n+${score}` : `+${score}`;
        const color = isPure ? '#FFD700' : '#FFFFFF'; // Dourado ou Branco

        new FloatingText(this.scene, {
            x,
            y,
            message: text,
            color,
            isImportant: isPure,
            delay: delayOffset
        });
    }

    /**
     * Exibe um aviso no centro do tabuleiro (ex: Combo, Game Over, Perigo)
     */
    public showBoardAlert(message: string, color: string = '#FF4500', delay: number = 0) {
        const boardCenterX = this.scene.cameras.main.width / 2;
        const boardCenterY = this.scene.cameras.main.height * 0.35;

        new FloatingText(this.scene, {
            x: boardCenterX,
            y: boardCenterY,
            message: message,
            color: color,
            isImportant: true,
            delay: delay
        });
    }

    // Futuro: showDesasterWarning(x, y, "Vulcão!")
    // Futuro: showEnergyGained(x, y, "+ Energia")
}