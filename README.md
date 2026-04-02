# 🧩 Bioma Block 2.5D

Um jogo de quebra-cabeça estratégico baseado em grades hexagonais, construído com **Phaser 3** e **TypeScript**. Inspirado em sucessos do gênero *Block Puzzle*, o jogo introduz uma mecânica fluida de Drag & Drop, um sistema visual de *Falso 3D (2.5D)* e uma lógica algorítmica rigorosa para manipulação de coordenadas axiais.

## 🚀 Visão Geral

O objetivo do jogo é arrastar blocos biome-temáticos de uma bandeja para um tabuleiro hexagonal. Formar linhas completas ou padrões específicos limpa os blocos do tabuleiro, gerando "Energia" (Pontuação) e liberando espaço. O jogo termina quando as peças geradas não cabem mais no espaço restante.

### ✨ Features Principais

* **Matemática Hexagonal de Alta Precisão:** Utiliza um sistema de coordenadas axiais `(q, r)` para cálculo de grade e vizinhança.
* **Física Tátil "1:1" Avançada:** O arrasto das peças preserva o offset exato do toque do jogador, elevando a peça visualmente (-60px no eixo Y) para não obstruir a visão, mas mantendo a colisão lógica intacta.
* **Ghost Snap Engine:** Um sistema de feedback preditivo (sombra) que mostra onde a peça será encaixada. Utiliza uma regra de *Hotspot Bias* (Volume Visual de 40%) que exige que a peça invada organicamente a casa antes de "pular", evitando trepidações e melhorando a sensação tátil.
* **Falso 3D (2.5D):** A arquitetura foi preparada para renderizar Sprites com volume direcional (perspectiva isométrica/oblíqua) em cima de um motor de colisão estritamente 2D.
* **Arquitetura Orientada a Eventos:** O core do jogo se comunica inteiramente através de um `EventBus` customizado, garantindo baixo acoplamento entre cenas, UI e lógica de pontuação.

---

## 🛠️ Tecnologias e Stack

* **Motor Gráfico:** [Phaser 3](https://phaser.io/) (HTML5 Canvas / WebGL)
* **Linguagem:** TypeScript
* **Bundler/Build Tool:** Vite (ou Webpack, adaptável pela estrutura de imports `@/`)
* **Arquitetura de Dados:** Orientada a Objetos com separação estrita de Lógica (Managers) e Visão (GameObjects).

---

## 🏗️ Arquitetura do Projeto

O código-fonte está estruturado para maximizar a escalabilidade, separando a matemática abstrata da renderização de tela:

```text
src/
├── game/
│   ├── config/          # Constantes matemáticas e paletas (GameConstants.ts)
│   ├── data/            # Banco de dados de Biomas e Continentes
│   ├── events/          # Sistema de EventBus e definição de GameEvents
│   ├── prefabs/         # GameObjects do Phaser (BiomeBlock.ts)
│   ├── scenes/          # Cenas do Phaser (GameScene.ts, MenuScene.ts)
│   └── systems/         # Lógica pura (HexGridManager.ts, PieceSpawner.ts)
```

### Componentes Core:
* **`HexGridManager`:** O "cérebro" do tabuleiro. Não sabe nada sobre pixels ou gráficos. Ele gerencia a matriz de ocupação e checa regras de Game Over e linhas fechadas.
* **`BiomeBlock`:** O container visual de uma peça interativa. Lida com escalas dinâmicas (ex: de `0.8` na bandeja para `1.0` no arrasto).
* **`PieceSpawner`:** Analisa o "peso" do tabuleiro e decide quais peças gerar, equilibrando a dificuldade do jogo.

---

## 💻 Instalação e Execução (Desenvolvimento)

Para rodar o projeto localmente, certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/hexa-puzzle-25d.git
   cd hexa-puzzle-25d
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. Acesse o jogo no seu navegador, geralmente em `http://localhost:5173`.

---

## 🗺️ Roadmap de Desenvolvimento

- [x] **Fase 1: Core Loop** (Matemática de Grade, Drag & Drop, Limpeza de Linhas).
- [x] **Fase 2: Polimento Tátil** (Ghost Snap, Escala de Peças, Compensação Geométrica).
- [ ] **Fase 3: Spawner Inteligente** (Dificuldade dinâmica baseada na ocupação do tabuleiro).
- [ ] **Fase 4: Integração de Assets 2.5D** (Substituição de polígonos `Graphics` por Sprites texturizados).
- [ ] **Fase 5: Juice e Feedback** (Sistemas de Partículas, Floating Texts, Animações de Combo).
- [ ] **Fase 6: UI / UX** (Telas de Menu, Game Over, Metagame de progressão de continentes).

