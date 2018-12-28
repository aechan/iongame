import { Component } from './Component';

export class Entity {
    private components: Component[];

    constructor() {
        this.components = [];
    }

    /**
     * Attaches a component instance to this entity.
     * Tells the component which entity is is now attached to.
     * @param comp Component to attach.
     */
    public attachComponent(comp: Component) {
        this.components.push(comp);
        comp.attach(this);
    }

    /**
     * Attempts to get a SINGLE component from this entity's component collection.
     * Gets components by instance hash. If there are multiple components matching the hash it will return the first.
     * @param comp Component to find.
     */
    public getComponent(comp: Component): Component {
        return this.components.filter((component) => {
            component.id === comp.id;
        })[0];
    }

    /**
     * Attempts to get components from this entity's component collection.
     * Gets components by instance hash. If there are multiple components matching the hash it will return all.
     * @param comp Component to find.
     */
    public getComponents(comp: Component): Component[] {
        return this.components.filter((component) => {
            component.id === comp.id;
        });
    }

    /**
     * Attempts to remove a component from this entity by hash. If there is no matching component nothing will happen.
     * @param comp Component to remove
     */
    public removeComponent(comp: Component) {
        const idx = this.components.findIndex((component) => {
            return component.id === comp.id;
        });

        if(idx > -1) {
            delete this.components[idx];
        }
    }

    /**
     * Gets all attached components of certain type.
     * @param componentType Type of component we're getting.
     */
    public getComponentsByType(componentType: typeof Component): Component[] {
        return this.components.filter((component) => {
            component instanceof componentType;
        });
    }
}