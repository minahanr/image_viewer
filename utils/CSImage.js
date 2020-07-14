export default class CSImage {
    static instances = new WeakMap();

    constructor(element, filePath, numImages, extension, format) {
        let max_str_len = Math.floor(Math.log10(numImages[numImages.length - 1]));

        this.format = format;
        this.movieReverse = false;
        this.element = element;
        this.stack = {
            currentImageIdIndex: 0,
            imageIds: []
        }
        for (let i = 1; i <= numImages; i++) {
            let i_str_len = Math.floor(Math.log10(i));
            let i_str = '0'.repeat(max_str_len - i_str_len) + i
    
            this.stack['imageIds'].push(filePath + '/' + 1 + '-' + i_str + '.' + extension + '?raw=true')
        }
        instances.set(element, this);
    }
}