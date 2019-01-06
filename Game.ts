import { Renderer } from "./systems/Renderer";
import { request } from "http";
import { Component } from "./component/Component";

/**
 * Main Game class.
 * Starting point for a game.
 * Holds all entities and systems.
 * Runs gameloop
 */
export class Game {
    private _canvas: HTMLCanvasElement;
    private renderer: Renderer;

    private simulationTimestep: number = 1000/60;
    private frameDelta: number = 0;
    private lastFrameTimeMs: number = 0;
    private fps: number = 60;
    private fpsAlpha: number = 0.9;
    private fpsUpdateInterval: number = 1000;
    private lastFpsUpdate: number = 0;
    private framesSinceLastFpsUpdate: number = 0;
    private numUpdateSteps: number = 0;
    private minFrameDelay: number = 0;
    private running: boolean = false;
    private started: boolean = false;
    private panicked: boolean = false;
    private rafPointer: number;
    private static _interpolationPercent: number = 0;
    private static _delta: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this.renderer = new Renderer(this);
    }

    static get delta(): number {
        return this._delta;
    }

    static get interpolationPercent(): number {
        return this._interpolationPercent;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get getSimulationTimestep(): number {
        return this.simulationTimestep;
    }

    set setSimulationTimestep(timestep: number) {
        this.simulationTimestep = timestep;
    }

    get getFPS(): number {
        return this.fps;
    }

    get getMaxAllowedFPS(): number {
        return 1000/this.minFrameDelay;
    }

    set setMaxAllowedFPS(fps: number) {
        if(fps === 0) {
            this.stop();
        } else {
            this.minFrameDelay = 1000 / fps;
        }
    }

    private resetFrameDelta(): number {
        const oldFrameDelta = this.frameDelta;
        this.frameDelta = 0;
        return oldFrameDelta;
    }

    /**
     * all logic and physics should be done here.
     * @param delta time elapsed between frames
     */
    private update(delta: number): void {
        Game._delta = delta;

    }

    /**
     * all rendering should be here
     * @param interpolationPercent all renderings are interpolated by this much
     */
    private draw(interpolationPercent: number): void {
        Game._interpolationPercent = interpolationPercent;
        this.renderer.update();
    }

    public start(): void {
        if(!this.started) {
            this.started = true;
            this.rafPointer = requestAnimationFrame((timestamp) => {
                this.draw(1);
                this.running = true;
                this.lastFrameTimeMs = timestamp;
                this.lastFpsUpdate = timestamp;
                this.framesSinceLastFpsUpdate = 0;
                this.rafPointer = requestAnimationFrame(this.animate)
            });
        }
    }

    public stop(): void {
        this.running = false;
        this.started = false;
        cancelAnimationFrame(this.rafPointer);
    }

    get isRunning(): boolean {
        return this.running;
    }

    private animate(timestamp: number): void {
        this.rafPointer = requestAnimationFrame(this.animate);
        if(timestamp < this.lastFrameTimeMs + this.minFrameDelay) {
            return;
        }

        this.frameDelta += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        //this.begin(timestamp, this.frameDelta);

        if(timestamp > this.lastFpsUpdate + this.fpsUpdateInterval) {
            this.fps = this.fpsAlpha * this.framesSinceLastFpsUpdate + 1000/(timestamp - this.lastFpsUpdate) +
            (1 - this.fpsAlpha) * this.fps;

            this.lastFpsUpdate = timestamp;
            this.framesSinceLastFpsUpdate = 0;
        }

        this.framesSinceLastFpsUpdate++;

        this.numUpdateSteps = 0;
        while(this.frameDelta >= this.simulationTimestep) {
            this.update(this.simulationTimestep);
            this.frameDelta -= this.simulationTimestep;

            if(++this.numUpdateSteps >= 240) {
                this.panicked = true;
                break;
            }
        }

        this.draw(this.frameDelta/this.simulationTimestep);


        //this.end(this.fps, this.panicked);
        if (this.panicked) {
            // This pattern introduces non-deterministic behavior, but in this case
            // it's better than the alternative (the application would look like it
            // was running very quickly until the simulation caught up to real
            // time. See the documentation for `MainLoop.setEnd()` for additional
            // explanation.
            const discardedTime = Math.round(this.resetFrameDelta());
            console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
        }

        this.panicked = false;
    }

    public findAllEntitiesWith(component: Component) {
        
    }

}