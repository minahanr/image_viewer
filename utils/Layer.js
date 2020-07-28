export default class Layer {
    constructor(format, urlsOverTime, startingIndex) {
        this.format = format;
        this.startingIndex = startingIndex;
        
        if (urlsOverTime[0].currentImageIdIndex !== undefined){
            this.stack = urlsOverTime;
        } else {
            this.stack = [];
            urlsOverTime.forEach(urls => this.stack.push({imageIds: urls, currentImageIdIndex: 0}));
        }
    }
}