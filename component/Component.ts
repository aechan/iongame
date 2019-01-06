import sha1 from 'sha1';
import { Entity } from '../entity/Entity';

export abstract class Component {
    private entity: Entity;

    constructor() {
        this.entity = undefined;
    }

    public attach(entity: Entity) {
        this.entity = entity;
    }

    get id(): string {
        return <string>sha1(JSON.stringify(this));
    }

    /**
     * Called every tick.
     */
    public abstract update();
}