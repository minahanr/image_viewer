function instances() {
    if (instances.map === undefined) {
        instances.map = new WeakMap();
    }

    return instances.map;
}

class Synchronizer {
    constructor(images) {
        this.images = images;

        images.forEach(image => instances().set(image, this));
    }
    
}

const obj = {
    Synchronizer,
    instances
};

export default obj;