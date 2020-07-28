export default class Layer {
    constructor(name, format, urlsOverTime, startingIndex) {
        this.name = name;
        this.format = format;
        this.startingIndex = startingIndex;
        this.options = {};
        
        if (urlsOverTime[0].currentImageIdIndex !== undefined){
            this.stack = urlsOverTime;
        } else {
            this.stack = [];
            urlsOverTime.forEach(urls => this.stack.push({imageIds: urls, currentImageIdIndex: 0}));
        }
    }
}