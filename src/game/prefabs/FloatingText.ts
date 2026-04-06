import { Scene } from 'phaser';

export type FloatingTextConfig = {
    x: number;
    y: number;
    message: string;
    color?: string;
    isImportant?: boolean;
    delay?: number;
};

export class FloatingText extends Phaser.GameObjects.Text {
    constructor(scene: Scene, config: FloatingTextConfig) {
        const { x, y, message, color = '#FFFFFF', isImportant = false, delay = 0 } = config;

        // Configuração de estilo visual
        super(scene, x, y, message, {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: isImportant ? '36px' : '24px',
            color: color,
            stroke: '#000000',
            strokeThickness: isImportant ? 8 : 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 3, stroke: true, fill: true }
        });

        // Adiciona à cena
        scene.add.existing(this);
        this.setOrigin(0.5);
        this.setDepth(100); // Garante que sempre fique por cima das peças
        this.setAlpha(0);   // Nasce invisível para a animação de entrada

        // Se for importante, dá um leve "pop" no scale
        if (isImportant) {
            this.setScale(0.5);
        }

        this.animate(y, isImportant, delay);
    }

    private animate(startY: number, isImportant: boolean, delay: number) {
        const scene = this.scene;

        // Animação complexa: Aparece subindo um pouco, depois flutua e some
        scene.tweens.add({
            targets: this,
            y: startY - 60,
            alpha: 1,
            scale: isImportant ? 1.2 : 1,
            duration: 300,
            delay: delay,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Segunda fase da animação: dissolve subindo mais devagar
                scene.tweens.add({
                    targets: this,
                    y: startY - 100,
                    alpha: 0,
                    duration: 800,
                    ease: 'Sine.inOut',
                    onComplete: () => {
                        this.destroy(); // O objeto limpa a si mesmo da memória!
                    }
                });
            }
        });
    }
}