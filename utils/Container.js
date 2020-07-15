export default class Container {
    constructor(container, borderUp, borderRight, borderDown, borderLeft) {
        this.container = container;
        this.borderUp = borderUp;
        this.borderRight = borderRight;
        this.borderDown = borderDown;
        this.borderLeft = borderLeft;
        Container.instances.set(container, this);
    }

    static instances = new WeakMap();
}