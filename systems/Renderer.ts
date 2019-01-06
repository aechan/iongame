import { Game } from "../Game";
import { System } from "./System";
/**
 * The renderer system.
 * Finds all Renderable components and draws them on the canvas.
 */
export class Renderer implements System {
    private canvas: CanvasRenderingContext2D;

    constructor(game: Game) {
        this.canvas = game.canvas.getContext('2d');
    }

    public update(): void {

    }
}