export default class Synchronizer {
    constructor(images) {
        this.images = images;

        images.forEach(image => Synchronizer.instances.set(image, this));
    }
    
    static instances = new WeakMap();
}