export default class Container {
    constructor(container, borderUp, borderRight, borderDown, borderLeft) {
        this.container = container;
        this.borderUp = borderUp;
        this.borderRight = borderRight;
        this.borderDown = borderDown;
        this.borderLeft = borderLeft;
        Container.instances().set(container, this);
    }

    static instances() {

        if (Container.instances.map === undefined) {
            Container.instances.map = new WeakMap();
        }
    
        return Container.instances.map;
    }
}