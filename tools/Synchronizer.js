export default class Synchronizer {
    constructor(images) {
        this.images = images;

        images.forEach(image => Synchronizer.instances().set(image, this));
    }
    
    static instances() {

        if (Synchronizer.instances.map === undefined) {
            Synchronizer.instances.map = new WeakMap();
        }
    
        return Synchronizer.instances.map;
    }
}